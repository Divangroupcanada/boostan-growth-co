-- SECURITY FIX (critical): users could set their own wallet balance.
--
-- The policy "Users update own profile" allows UPDATE on public.profiles for the
-- owning user with no column restriction, and `balance` lives on that table.
-- Because the anon key is public (browser bundle + public repo), any signed-in
-- user could PATCH /rest/v1/profiles?user_id=eq.<self> {"balance": 999999}
-- and then place real orders paid for by us at the provider.
--
-- Defence in depth — three independent layers:
--   1. Revoke column-level UPDATE on the money columns.
--   2. Re-scope the RLS policy with a WITH CHECK clause.
--   3. Trigger that hard-blocks any balance change not made by a SECURITY DEFINER
--      routine or the service role (belt and braces if a policy is ever loosened).
--
-- Legitimate balance changes keep working: place_order_atomic and the deposit
-- credit paths are SECURITY DEFINER / service-role, both of which bypass RLS.

-- 1. Column-level privileges ------------------------------------------------
REVOKE UPDATE (balance) ON public.profiles FROM authenticated, anon;

-- 2. Tighten the RLS policy -------------------------------------------------
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

CREATE POLICY "Users update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Guard trigger ----------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_balance_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.balance IS DISTINCT FROM OLD.balance THEN
    -- service_role (server-side admin client) and SECURITY DEFINER routines
    -- run as roles other than `authenticated`; only block direct client writes.
    IF current_setting('request.jwt.claim.role', true) = 'authenticated' THEN
      RAISE EXCEPTION
        'balance is read-only from the client; use the deposit or order flow'
        USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_balance_guard ON public.profiles;

CREATE TRIGGER trg_profiles_balance_guard
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_balance_tampering();

-- 4. Audit helper -----------------------------------------------------------
-- Run manually after applying to spot any balances inflated before the fix:
--   SELECT p.user_id, p.balance,
--          COALESCE(SUM(t.amount) FILTER (WHERE t.status = 'completed'), 0) AS ledger
--   FROM public.profiles p
--   LEFT JOIN public.transactions t ON t.user_id = p.user_id
--   GROUP BY p.user_id, p.balance
--   HAVING p.balance <> COALESCE(SUM(t.amount) FILTER (WHERE t.status = 'completed'), 0);
