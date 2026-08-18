import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { attachSupabaseAuth } from "./auth-client-middleware";
import { smmflwCall } from "@/lib/smmflw.server";
import type { Json } from "@/integrations/supabase/types";

type OrderStatus =
  "pending" | "processing" | "in_progress" | "completed" | "partial" | "canceled" | "failed";

/**
 * Self-resolving support.
 *
 * The dominant complaint about this industry is panels that take money, under-
 * deliver, then stop replying to tickets. Most of those tickets are the same
 * four questions, and all four can be answered from data we already have or
 * can fetch: where is my order, it never arrived, only part arrived, cancel it.
 *
 * So the resolver tries to settle the request outright — including issuing the
 * refund — and only falls through to a human queue when it genuinely can't.
 * Every path writes a row, so nothing is silently dropped.
 */

const KINDS = [
  "order_status",
  "not_delivered",
  "partial",
  "cancel_request",
  "payment",
  "other",
] as const;

const STATUS_MAP: Record<string, OrderStatus> = {
  pending: "pending",
  processing: "processing",
  "in progress": "in_progress",
  inprogress: "in_progress",
  completed: "completed",
  partial: "partial",
  canceled: "canceled",
  cancelled: "canceled",
  fail: "failed",
  failed: "failed",
};

type OrderRow = {
  id: string;
  status: OrderStatus;
  quantity: number;
  charge: number | null;
  price: number | null;
  provider_order_id: string | null;
  link: string;
};

type Resolution = {
  state: "auto_resolved" | "open";
  response: string;
  detail?: Json;
  refunded?: number;
};

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export const submitTicket = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .inputValidator(
    z.object({
      kind: z.enum(KINDS),
      orderId: z.string().uuid().optional(),
      message: z.string().max(2000).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;

    let order: OrderRow | null = null;

    if (data.orderId) {
      const { data: row } = await supabaseAdmin
        .from("orders")
        .select("id, status, quantity, charge, price, provider_order_id, link, user_id")
        .eq("id", data.orderId)
        .maybeSingle();
      // Scope to the requester: an order id is guessable, a refund is not
      // something we want triggered against somebody else's order.
      if (row && row.user_id === userId) {
        order = row as unknown as OrderRow;
      }
    }

    const resolution = await resolve(data.kind, order, userId);

    const { data: ticket, error } = await supabaseAdmin
      .from("support_tickets")
      .insert({
        user_id: userId,
        order_id: order?.id ?? null,
        kind: data.kind,
        state: resolution.state,
        message: data.message ?? null,
        auto_response: resolution.response,
        auto_detail: resolution.detail ?? null,
        refunded_amount: resolution.refunded ?? null,
        resolved_at: resolution.state === "auto_resolved" ? new Date().toISOString() : null,
      })
      .select("id, state, auto_response, refunded_amount")
      .single();

    if (error) throw new Error(error.message);
    return ticket;
  });

async function resolve(
  kind: (typeof KINDS)[number],
  order: OrderRow | null,
  _userId: string,
): Promise<Resolution> {
  // Payment and open-ended questions need a person.
  if (kind === "payment" || kind === "other") {
    return {
      state: "open",
      response:
        "Thanks — this one needs a human. We've logged it and you'll get a reply by email. Deposits that haven't credited are usually resolved within a few hours.",
    };
  }

  if (!order) {
    return {
      state: "open",
      response:
        "We couldn't match that to an order on your account, so we've passed it to a person to look at.",
    };
  }

  // Ask the provider for the live truth rather than trusting our cached row.
  let providerStatus: OrderStatus | null = null;
  let remains: number | null = null;
  let startCount: number | null = null;

  if (order.provider_order_id) {
    try {
      const res = await smmflwCall<{
        status?: string;
        remains?: string | number;
        start_count?: string | number;
        error?: string;
      }>({ action: "status", order: order.provider_order_id });
      if (res.status) {
        providerStatus =
          (STATUS_MAP[String(res.status).toLowerCase().trim()] as OrderStatus | undefined) ?? null;
        remains = res.remains != null && res.remains !== "" ? Number(res.remains) : null;
        startCount = res.start_count != null ? Number(res.start_count) : null;
      }
    } catch {
      // Provider unreachable — fall back to our stored status below.
    }
  }

  const status = providerStatus ?? order.status;
  const charge = Number(order.charge ?? order.price ?? 0);

  // Keep our record current while we're here.
  if (providerStatus && providerStatus !== order.status) {
    await supabaseAdmin
      .from("orders")
      .update({
        status: providerStatus,
        remains,
        start_count: startCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);
  }

  const detail = {
    status,
    remains,
    startCount,
    provider_order_id: order.provider_order_id,
  } as unknown as Json;

  // ---- failed or cancelled: refund in full, now ---------------------------
  if (status === "failed" || status === "canceled") {
    const { data: refunded, error } = await supabaseAdmin.rpc("refund_order", {
      _order_id: order.id,
      _reason: "Support request — provider reported " + status,
    });
    if (error) {
      return {
        state: "open",
        response:
          "This order didn't complete and is owed a refund, but the refund didn't go through automatically. We've flagged it for immediate manual settlement.",
        detail: { ...(detail as object), refundError: error.message } as unknown as Json,
      };
    }
    const amount = Number(refunded ?? 0);
    return {
      state: "auto_resolved",
      response:
        amount > 0
          ? `That order was ${status} by the provider, so we've refunded ${money(amount)} to your balance. It's there now.`
          : `That order was ${status} and had already been refunded to your balance.`,
      detail,
      refunded: amount,
    };
  }

  // ---- partial: refund the undelivered share ------------------------------
  if (status === "partial" && remains && remains > 0 && order.quantity > 0) {
    const undelivered = Math.round(((charge * remains) / order.quantity) * 100) / 100;
    const { data: refunded, error } = await supabaseAdmin.rpc("refund_order_partial", {
      _order_id: order.id,
      _amount: undelivered,
      _reason: `Support request — ${remains} of ${order.quantity} undelivered`,
    });
    if (error) {
      return {
        state: "open",
        response:
          "This order delivered partially and is owed a partial refund. The automatic refund didn't go through, so we've flagged it for manual settlement.",
        detail: { ...(detail as object), refundError: error.message } as unknown as Json,
      };
    }
    const amount = Number(refunded ?? 0);
    return {
      state: "auto_resolved",
      response:
        amount > 0
          ? `The provider delivered ${order.quantity - remains} of ${order.quantity}. We've refunded ${money(amount)} for the ${remains} that didn't arrive.`
          : "This order delivered partially and the refund for the undelivered portion has already been credited.",
      detail,
      refunded: amount,
    };
  }

  // ---- completed ----------------------------------------------------------
  if (status === "completed") {
    return {
      state: "auto_resolved",
      response:
        "The provider reports this order as completed. If the count on your profile looks lower than expected, that's usually platform-side caching or natural drop-off in the days after delivery — counts can take a while to settle.",
      detail,
    };
  }

  // ---- cancel request -----------------------------------------------------
  if (kind === "cancel_request") {
    if (status === "pending") {
      return {
        state: "open",
        response:
          "This order hasn't started yet, so cancelling may be possible. We've queued the request with the provider and you'll hear back shortly.",
        detail,
      };
    }
    return {
      state: "auto_resolved",
      response:
        "This order is already in progress with the provider, so it can't be cancelled. If it ends up delivering short, the undelivered portion is refunded to your balance automatically — you won't need to ask.",
      detail,
    };
  }

  // ---- still running ------------------------------------------------------
  const remainsLine =
    remains != null && remains > 0
      ? ` ${order.quantity - remains} of ${order.quantity} have been delivered so far.`
      : "";
  return {
    state: "auto_resolved",
    response: `This order is currently "${status.replace(/_/g, " ")}".${remainsLine} Our provider quotes 1–72 hours to start depending on the service, and we re-check status every 15 minutes. If it ends up failing or delivering short, the refund is automatic.`,
    detail,
  };
}

export const listTickets = createServerFn({ method: "GET" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { data, error } = await supabaseAdmin
      .from("support_tickets")
      .select("id, kind, state, message, auto_response, admin_reply, refunded_amount, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });
