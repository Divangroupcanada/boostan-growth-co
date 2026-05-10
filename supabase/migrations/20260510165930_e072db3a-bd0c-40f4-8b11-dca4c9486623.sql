ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_test_order boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.place_order_atomic(_service_id uuid, _link text, _quantity integer, _charge numeric, _cost numeric, _is_test boolean DEFAULT false)
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

  INSERT INTO public.orders (user_id, service_id, link, quantity, price, charge, cost, status, is_test_order)
    VALUES (_user_id, _service_id, _link, _quantity, _charge, _charge, _cost, 'pending', _is_test)
    RETURNING id INTO _order_id;

  INSERT INTO public.transactions (user_id, type, amount, status, description, reference_id, balance_after)
    VALUES (_user_id, 'order_debit', -_charge, 'completed', CASE WHEN _is_test THEN 'Test order payment' ELSE 'Order payment' END, _order_id, _new_balance);

  RETURN _order_id;
END;
$function$;