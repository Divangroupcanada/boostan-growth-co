## Goal

Adopt Buzzoid's "package picker" UX wins (interactive pricer, step wizard, premium-tier badging) while keeping Boostan's Linear-disciplined dark + magenta aesthetic. Ship 5 coordinated changes.

---

## Change 1 — DB: add `tier` column to `services`

**Migration** (run first, since all downstream UI reads it):
- `ALTER TABLE services ADD COLUMN tier text` (values `'basic' | 'premium' | 'vip'`)
- Add a SQL function `recompute_service_tiers()` that, per-platform, ranks active services by `base_rate` ascending and assigns:
  - bottom 33% → `basic`
  - middle 33% → `premium`
  - top 33% → `vip`
  - (fallback `premium` when only 1–2 services exist on a platform)
- Run the function once after migration to backfill existing 143 services.
- **Note**: I won't edit `syncServices` source unless you confirm — instead the function is idempotent and can be called from the admin UI / called at the end of sync as a follow-up. (Will wire it into syncServices if you want a one-line addition.)

---

## Change 2 — Landing: "Try it now" interactive pricer

New component `<TryItNow />` mounted between `<Stats />` and `<ServicesPreview />` in `src/components/landing.tsx`.

**State machine (single card, all steps visible at once — no wizard on landing):**
1. Platform: 3 large radio cards (Instagram / TikTok / YouTube) with react-icons + service count (75/21/47).
2. Category chips (Followers / Likes / Views / Comments / Subscribers / Watch Time) — auto-hide categories with no matching services for the selected platform.
3. Quantity: preset chips (100, 500, 1K, 2.5K, 5K, 10K, 25K) + range slider snapped to nice round numbers (round to nearest 100 below 1K, nearest 500 below 10K, nearest 1K above).
4. Quality tier: 3 segmented buttons (Basic / Premium / VIP) with hover tooltip explaining each tier.

**Live result panel** (right column on desktop ≥md, stacked below on mobile):
- Matched service name + smmflw_id reference (small mono font)
- Estimated price = `marked_up_rate × qty / 1000`, 2-decimal format
- "Less than 30 seconds to start"
- "30-day auto-refill" only when category === Followers
- Primary CTA: `<Link to="/signup" search={{ platform, category, qty, tier }}>` → carries config via URL params

**Matching logic** (client-side, services fetched once via Supabase):
- Filter active services where `platform === selected && categoryMatches(name) && tier === selected`
- Pick the one whose `[min_quantity, max_quantity]` brackets the requested qty; if multiple, pick lowest `marked_up_rate`
- If qty outside any matching service's range → show "Adjust quantity to fit available service ranges (e.g. 100 – 40,000)" instead of price + disable CTA

**Category derivation**: parse `services.name` for keywords (followers, likes, views, comments, subscribers, watch time) since there's no explicit category column — store as a derived `inferCategory(name)` helper; reused in Change 3 too.

**Style**: card = `bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] rounded-xl p-6`. Selected chips/cards = `bg-[var(--accent)] text-white`. Unselected = `bg-transparent border border-[var(--border-default)]`. All transitions `200ms ease`.

---

## Change 3 — `/new-order` rebuilt as 6-step wizard

Replace existing single-form page at `src/routes/_authenticated/new-order.tsx`.

**Steps** (each locks until prior is complete; step content slides in with a 150ms fade):
1. Platform picker (same 3 cards as landing pricer)
2. Service category chips
3. Quantity (presets + slider)
4. Tier (segmented)
5. Link input (`<input>` with placeholder `https://instagram.com/yourpost`, basic URL validation)
6. Review summary card → service name, qty, tier, link, charge → `[Place order]` button

**Pre-fill from URL params** if `?platform=&category=&qty=&tier=` are present (so landing CTA hands off seamlessly).

**Header**: progress bar `Step X of 6` at top, "Back" link on steps 2–6.

**Place order**: reuse existing `placeOrder` server fn unchanged. Test mode toggle stays on step 6, default ON.

---

## Change 4 — Refreshed service card

New shared component `src/components/service-card.tsx`:

```text
┌──────────────────────────────────────┐
│ [PlatformIcon]            [TierPill] │
│                                      │
│ Service Name                         │
│ Category subtitle                    │
│                                      │
│ $X.XX per 1,000                      │
│ Min: 100 · Max: 40,000               │
│                                      │
│ ✓ Starts in <30 seconds              │
│ ✓ 30-day refill (Followers only)     │
│ ✓ Drip-feed available (where appl.)  │
│                                      │
│ [Order →]                            │
└──────────────────────────────────────┘
```

**Tier pill**: small rounded badge top-right
- `basic` → gray (`bg-[var(--bg-surface-3)] text-[var(--text-secondary)]`)
- `premium` → subtle magenta (`bg-[var(--accent-subtle)] text-[var(--accent)]`)
- `vip` → solid (`bg-[var(--accent)] text-white`)

**Refill/drip flags**: parse `service_type` and `description`. When neither says "refill" or "drip", swap green check → "Refill: case-by-case" muted line.

**Card style**: `bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] rounded-xl p-6 transition-colors hover:bg-[var(--bg-surface-2)] hover:border-[var(--border-default)]`. No shadow.

**Used in**:
- Landing `<ServicesPreview />` — replace inline JSX
- `/services` page grid
- Admin services table (kept tabular but with TierPill cell — optional, just adding the pill)

---

## Change 5 — Honest trust copy

In `src/components/landing.tsx`:

- **Hero subtext**: keep existing line, append small muted line: "Built in Toronto. 143 services live. Real engagement, never bots."
- **TrustBar**: replace `"Trusted by 200+ agencies..."` with `"Built by a Toronto-based agency that's run 7+ retainers in beauty, real estate, and hospitality."`
- **New section** `<HowWereDifferent />` inserted between `<HowItWorks />` and `<WhoItsFor />`. Eyebrow "How we're different", h2 "Not the cheapest. Reliable.", followed by 4 horizontal rows with magenta check + claim:
  1. Premium upstream provider — not the cheapest, but reliable
  2. Real engagement, drip-feed delivery available
  3. 30-day auto-refill on follower drops
  4. Crypto + e-transfer accepted, no card processing risks
- **Remove** the existing "Trusted by 200+ agencies and creators across Toronto, Dubai, NYC, LA" text and `<WhoItsFor />` audience cards' "Trusted by 200+ Toronto businesses" copy (rephrase generically).

No fake testimonials, ratings, or numbers added.

---

## Implementation order

1. Run migration (Change 4) → wait for approval
2. Build `service-card.tsx` shared component (Change 3)
3. Build `inferCategory.ts` helper + `<TryItNow />` (Change 2)
4. Update `landing.tsx` — insert TryItNow, HowWereDifferent, swap trust copy, swap service card (Changes 2, 3, 5)
5. Update `/services` page to use new card (Change 3)
6. Rebuild `/new-order` wizard (Change 2 carry-over + Change 3 reuse of step components)
7. Screenshot 3 deliverables → pause for review

---

## Files touched

- `supabase/migrations/<new>.sql` — tier column + recompute function
- `src/lib/service-tier.ts` (new) — `inferCategory`, `tierLabel`, `tierClasses` helpers
- `src/components/service-card.tsx` (new)
- `src/components/landing.tsx` (edited)
- `src/routes/_authenticated/new-order.tsx` (rewritten)
- `src/routes/_authenticated/services.tsx` (uses new card)
- `src/routes/_authenticated/admin.tsx` (small TierPill addition only — optional, will skip if it bloats the diff)

---

## One open question

After landing-page CTA passes `?platform=&category=&qty=&tier=` to `/signup`, should those params then forward through signup → `/new-order` so the wizard auto-fills? Default plan: **yes** — store them in `sessionStorage` on landing CTA click, read on `/new-order` mount. Tell me if you'd rather drop them at signup.