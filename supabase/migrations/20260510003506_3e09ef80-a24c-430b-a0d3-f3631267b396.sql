
-- Extend tx_type enum
ALTER TYPE public.tx_type ADD VALUE IF NOT EXISTS 'order_debit';

-- Settings table (singleton row)
CREATE TABLE public.settings (
  id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id = true),
  markup_percentage NUMERIC NOT NULL DEFAULT 20,
  fixed_fee NUMERIC NOT NULL DEFAULT 0,
  min_deposit NUMERIC NOT NULL DEFAULT 25,
  last_services_sync TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO public.settings (id) VALUES (true);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage settings" ON public.settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can read settings" ON public.settings
  FOR SELECT USING (true);

-- Extend services
ALTER TABLE public.services
  ADD COLUMN smmflw_id TEXT UNIQUE,
  ADD COLUMN display_name TEXT,
  ADD COLUMN base_rate NUMERIC,
  ADD COLUMN marked_up_rate NUMERIC,
  ADD COLUMN service_type TEXT,
  ADD COLUMN display_tier TEXT,
  ADD COLUMN synced_at TIMESTAMPTZ;

-- Extend orders
ALTER TABLE public.orders
  ADD COLUMN smmflw_order_id TEXT,
  ADD COLUMN charge NUMERIC,
  ADD COLUMN cost NUMERIC;

-- Extend transactions
ALTER TABLE public.transactions
  ADD COLUMN balance_after NUMERIC;

-- Atomic order placement RPC
CREATE OR REPLACE FUNCTION public.place_order_atomic(
  _service_id UUID,
  _link TEXT,
  _quantity INTEGER,
  _charge NUMERIC,
  _cost NUMERIC
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID := auth.uid();
  _balance NUMERIC;
  _new_balance NUMERIC;
  _order_id UUID;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT balance INTO _balance FROM public.profiles
    WHERE user_id = _user_id FOR UPDATE;

  IF _balance IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF _balance < _charge THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  _new_balance := _balance - _charge;

  UPDATE public.profiles SET balance = _new_balance, updated_at = now()
    WHERE user_id = _user_id;

  INSERT INTO public.orders (user_id, service_id, link, quantity, price, charge, cost, status)
    VALUES (_user_id, _service_id, _link, _quantity, _charge, _charge, _cost, 'pending')
    RETURNING id INTO _order_id;

  INSERT INTO public.transactions (user_id, type, amount, status, description, reference_id, balance_after)
    VALUES (_user_id, 'order_debit', -_charge, 'completed', 'Order payment', _order_id, _new_balance);

  RETURN _order_id;
END;
$$;
