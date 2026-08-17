// Server-only NOWPayments helpers. Never import from client code.
// Docs: https://documenter.getpostman.com/view/7907941/2s93JusNJt
import { createHmac, timingSafeEqual } from "crypto";

const NP_URL = "https://api.nowpayments.io/v1";

export type CreateInvoiceInput = {
  price_amount: number;
  price_currency: string; // "usd"
  pay_currency?: string; // "usdttrc20"
  order_id: string;
  order_description?: string;
  ipn_callback_url: string;
  success_url?: string;
  cancel_url?: string;
};

export type Invoice = {
  id: string;
  invoice_url: string;
  order_id: string;
  price_amount: string | number;
  price_currency: string;
  pay_currency: string | null;
  created_at: string;
};

export type PaymentStatus = {
  payment_id: number | string;
  payment_status: string;
  pay_address?: string;
  price_amount: number;
  price_currency: string;
  pay_amount?: number;
  actually_paid?: number;
  pay_currency?: string;
  order_id?: string;
  order_description?: string;
};

function getApiKey(): string {
  const k = process.env.NOWPAYMENTS_API_KEY;
  if (!k) throw new Error("NOWPAYMENTS_API_KEY is not configured");
  return k;
}

export function getIpnSecret(): string {
  const s = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!s) throw new Error("NOWPAYMENTS_IPN_SECRET is not configured");
  return s;
}

export async function npFetch<T = any>(
  path: string,
  init: { method?: "GET" | "POST"; body?: unknown } = {},
): Promise<T> {
  const res = await fetch(`${NP_URL}${path}`, {
    method: init.method ?? "GET",
    headers: {
      "x-api-key": getApiKey(),
      "Content-Type": "application/json",
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  const text = await res.text();
  console.log(
    `[nowpayments] ${init.method ?? "GET"} ${path} -> ${res.status} ${text.slice(0, 300)}`,
  );
  if (!res.ok) {
    throw new Error(`NOWPayments HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`NOWPayments non-JSON response: ${text.slice(0, 200)}`);
  }
}

// Recursively sort object keys alphabetically and produce a deterministic JSON string.
// NOWPayments computes HMAC over JSON.stringify of the body with all keys sorted.
function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(obj).sort()) out[k] = sortKeysDeep(obj[k]);
    return out;
  }
  return value;
}

export function verifyIpnSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return false;
  }
  const sortedJson = JSON.stringify(sortKeysDeep(parsed));
  const expected = createHmac("sha512", getIpnSecret()).update(sortedJson).digest("hex");
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signature, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
