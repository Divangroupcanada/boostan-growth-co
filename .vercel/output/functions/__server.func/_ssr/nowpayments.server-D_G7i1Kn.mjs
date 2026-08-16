import { createHmac, timingSafeEqual } from "crypto";
const NP_URL = "https://api.nowpayments.io/v1";
function getApiKey() {
  const k = process.env.NOWPAYMENTS_API_KEY;
  if (!k) throw new Error("NOWPAYMENTS_API_KEY is not configured");
  return k;
}
function getIpnSecret() {
  const s = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!s) throw new Error("NOWPAYMENTS_IPN_SECRET is not configured");
  return s;
}
async function npFetch(path, init = {}) {
  const res = await fetch(`${NP_URL}${path}`, {
    method: init.method ?? "GET",
    headers: {
      "x-api-key": getApiKey(),
      "Content-Type": "application/json"
    },
    body: init.body ? JSON.stringify(init.body) : void 0
  });
  const text = await res.text();
  console.log(`[nowpayments] ${init.method ?? "GET"} ${path} -> ${res.status} ${text.slice(0, 300)}`);
  if (!res.ok) {
    throw new Error(`NOWPayments HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`NOWPayments non-JSON response: ${text.slice(0, 200)}`);
  }
}
function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    const obj = value;
    const out = {};
    for (const k of Object.keys(obj).sort()) out[k] = sortKeysDeep(obj[k]);
    return out;
  }
  return value;
}
function verifyIpnSignature(rawBody, signature) {
  if (!signature) return false;
  let parsed;
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
export {
  getIpnSecret as g,
  npFetch as n,
  verifyIpnSignature as v
};
