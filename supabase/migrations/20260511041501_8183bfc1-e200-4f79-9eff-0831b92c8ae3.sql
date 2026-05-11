-- 1. New columns
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS order_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS display_order integer,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS services_featured_idx ON public.services (is_featured, display_order);
CREATE INDEX IF NOT EXISTS services_order_count_idx ON public.services (order_count DESC);

-- 2. Standardize service_type via name pattern matching (order matters: more specific first)
UPDATE public.services SET service_type = CASE
  WHEN lower(name) ~ 'watch ?time'                  THEN 'watch_time'
  WHEN lower(name) ~ 'story (view|impression)'      THEN 'story_views'
  WHEN lower(name) ~ 'reel'                         THEN 'reels_plays'
  WHEN lower(name) ~ 'subscriber'                   THEN 'subscribers'
  WHEN lower(name) ~ 'share|repost|retweet'         THEN 'shares'
  WHEN lower(name) ~ 'save|bookmark'                THEN 'saves'
  WHEN lower(name) ~ 'comment'                      THEN 'comments'
  WHEN lower(name) ~ 'follower|member'              THEN 'followers'
  WHEN lower(name) ~ 'like'                         THEN 'likes'
  WHEN lower(name) ~ 'view|impression|play'         THEN 'views'
  ELSE 'other'
END;

-- 3. Update place_order_atomic to bump order_count
CREATE OR REPLACE FUNCTION public.place_order_atomic(
  _service_id uuid, _link text, _quantity integer, _charge numeric, _cost numeric, _is_test boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _user_id UUID := auth.uid();
  _balance NUMERIC;
  _new_balance NUMERIC;
  _order_id UUID;
BEGIN
  IF _user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT balance INTO _balance FROM public.profiles WHERE user_id = _user_id FOR UPDATE;
  IF _balance IS NULL THEN RAISE EXCEPTION 'Profile not found'; END IF;
  IF _balance < _charge THEN RAISE EXCEPTION 'Insufficient balance'; END IF;

  _new_balance := _balance - _charge;

  UPDATE public.profiles SET balance = _new_balance, updated_at = now()
    WHERE user_id = _user_id;

  INSERT INTO public.orders (user_id, service_id, link, quantity, price, charge, cost, status, is_test_order)
    VALUES (_user_id, _service_id, _link, _quantity, _charge, _charge, _cost, 'pending', _is_test)
    RETURNING id INTO _order_id;

  INSERT INTO public.transactions (user_id, type, amount, status, description, reference_id, balance_after)
    VALUES (_user_id, 'order_debit', -_charge, 'completed',
      CASE WHEN _is_test THEN 'Test order payment' ELSE 'Order payment' END, _order_id, _new_balance);

  UPDATE public.services SET order_count = COALESCE(order_count,0) + 1 WHERE id = _service_id;

  RETURN _order_id;
END;
$function$;

-- Also update the older 5-arg variant for compatibility
CREATE OR REPLACE FUNCTION public.place_order_atomic(
  _service_id uuid, _link text, _quantity integer, _charge numeric, _cost numeric
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN public.place_order_atomic(_service_id, _link, _quantity, _charge, _cost, false);
END;
$function$;