import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { submitTicket, listTickets } from "@/lib/support.functions";
import { BUSINESS } from "@/lib/business";

export const Route = createFileRoute("/_authenticated/support")({
  head: () => ({ meta: [{ title: "Support — Boostan" }] }),
  component: SupportPage,
});

const KINDS = [
  { value: "order_status", label: "Where is my order?" },
  { value: "not_delivered", label: "My order never arrived" },
  { value: "partial", label: "Only part of my order arrived" },
  { value: "cancel_request", label: "I want to cancel an order" },
  { value: "payment", label: "A deposit hasn't credited" },
  { value: "other", label: "Something else" },
] as const;

/** Kinds that need an order attached to be answerable. */
const NEEDS_ORDER = new Set(["order_status", "not_delivered", "partial", "cancel_request"]);

function SupportPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const submit = useServerFn(submitTicket);
  const fetchTickets = useServerFn(listTickets);

  const [kind, setKind] = useState<(typeof KINDS)[number]["value"]>("order_status");
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const { data: orders } = useQuery({
    queryKey: ["support-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, quantity, status, created_at, link")
        .order("created_at", { ascending: false })
        .limit(25);
      return data ?? [];
    },
  });

  const { data: tickets } = useQuery({
    queryKey: ["tickets", user?.id],
    enabled: !!user,
    queryFn: () => fetchTickets(),
  });

  const needsOrder = NEEDS_ORDER.has(kind);

  const onSubmit = async () => {
    if (needsOrder && !orderId) {
      toast.error("Pick which order this is about.");
      return;
    }
    setBusy(true);
    try {
      const t = await submit({
        data: {
          kind,
          orderId: orderId || undefined,
          message: message.trim() || undefined,
        },
      });
      setMessage("");
      await qc.invalidateQueries({ queryKey: ["tickets"] });
      await qc.invalidateQueries({ queryKey: ["profile"] });
      if (t.state === "auto_resolved") {
        toast.success(
          t.refunded_amount
            ? `Resolved — $${Number(t.refunded_amount).toFixed(2)} refunded`
            : "Resolved",
        );
      } else {
        toast.success("Sent to our team");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't submit that");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Support</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Most questions are answered the moment you send them — we check your order with the provider
        live, and if a refund is owed it's credited straight away rather than after a conversation.
      </p>

      <div className="mt-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-6">
        <label className="block text-sm font-medium text-[var(--text-primary)]">
          What's happening?
        </label>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as typeof kind)}
          className="mt-2 w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-base)] px-3 py-2.5 text-sm text-[var(--text-primary)]"
        >
          {KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>

        {needsOrder && (
          <>
            <label className="mt-5 block text-sm font-medium text-[var(--text-primary)]">
              Which order?
            </label>
            <select
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="mt-2 w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-base)] px-3 py-2.5 text-sm text-[var(--text-primary)]"
            >
              <option value="">Select an order…</option>
              {(orders ?? []).map((o) => (
                <option key={o.id} value={o.id}>
                  {new Date(o.created_at).toLocaleDateString()} · {o.quantity.toLocaleString()} ·{" "}
                  {String(o.status).replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </>
        )}

        <label className="mt-5 block text-sm font-medium text-[var(--text-primary)]">
          Anything to add? <span className="text-[var(--text-tertiary)]">(optional)</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          maxLength={2000}
          className="mt-2 w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-base)] px-3 py-2.5 text-sm text-[var(--text-primary)]"
        />

        <button
          type="button"
          onClick={onSubmit}
          disabled={busy}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {busy ? "Checking with the provider…" : "Get an answer"}
        </button>
      </div>

      <h2 className="mt-10 text-sm tracking-[0.2em] text-[var(--text-tertiary)] uppercase">
        Your requests
      </h2>
      <div className="mt-4 space-y-3">
        {(tickets ?? []).length === 0 && (
          <p className="text-sm text-[var(--text-tertiary)]">Nothing yet.</p>
        )}
        {(tickets ?? []).map((t) => {
          const resolved = t.state === "auto_resolved" || t.state === "closed";
          return (
            <div
              key={t.id}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4"
            >
              <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                {resolved ? (
                  <CheckCircle2 className="h-4 w-4 text-[var(--success)]" />
                ) : (
                  <Clock className="h-4 w-4 text-[var(--saffron)]" />
                )}
                <span>{resolved ? "Resolved" : "With our team"}</span>
                <span>·</span>
                <span>{new Date(t.created_at).toLocaleString()}</span>
                {t.refunded_amount ? (
                  <>
                    <span>·</span>
                    <span className="text-[var(--success)]">
                      ${Number(t.refunded_amount).toFixed(2)} refunded
                    </span>
                  </>
                ) : null}
              </div>
              {t.message && (
                <p className="mt-2 text-sm text-[var(--text-secondary)] italic">“{t.message}”</p>
              )}
              {t.auto_response && (
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
                  {t.auto_response}
                </p>
              )}
              {t.admin_reply && (
                <p className="mt-2 border-t border-[var(--border-subtle)] pt-2 text-sm leading-relaxed text-[var(--text-primary)]">
                  {t.admin_reply}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-xs text-[var(--text-tertiary)]">
        Anything the automatic checks can't settle goes to a person, and you'll get a reply by
        email. You can also reach us at {BUSINESS.supportEmail}.
      </p>
    </div>
  );
}
