/**
 * Order pricing — one implementation, used by the order form, the homepage
 * estimator, the /buy package pages and the server-side charge.
 *
 * WHY A MINIMUM CHARGE
 * `marked_up_rate` is a per-1,000 rate that already has the settings "fixed
 * fee" baked in (base * (1 + markup%) + fee). Because the rate is then scaled
 * by quantity/1000, that fee scales down with it — so a "$1 fixed fee" is only
 * 10c on a 100-unit order. The result was real packages priced at $0.14, which
 * cannot cover payment fees, a refund, or a minute of support.
 *
 * A floor is the smallest correct fix: large orders are untouched, and small
 * ones stop being sold below viability. The proper fix is to stop folding the
 * fee into the rate and charge it once per order instead — that changes every
 * stored rate, so it's a deliberate migration rather than a patch.
 */

/** No order is worth transacting below this. */
export const MIN_ORDER_CHARGE = 1.0;

/** Raw price from the per-1,000 rate, before any floor is applied. */
export function rawOrderPrice(ratePer1000: number, quantity: number): number {
  return (ratePer1000 * quantity) / 1000;
}

/** What the customer is actually charged, rounded to cents. */
export function orderPrice(ratePer1000: number, quantity: number): number {
  const raw = rawOrderPrice(ratePer1000, quantity);
  return Math.round(Math.max(raw, MIN_ORDER_CHARGE) * 100) / 100;
}

/** True when the floor is what's setting the price, so the UI can say so. */
export function isMinimumApplied(ratePer1000: number, quantity: number): boolean {
  return rawOrderPrice(ratePer1000, quantity) < MIN_ORDER_CHARGE;
}
