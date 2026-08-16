-- Refund paths for orders that were debited but not delivered.
-- refund_order:         full refund (provider rejected / canceled / failed)
-- refund_order_partial: refunds only the undelivered share of a partial order
-- Both are idempotent per order id and callable by service_role only.

CREATE OR REPLACE FUNCTION public.refund_order(_order_id uuid, _reason text DEFAULT NULL)
RETURNS numeric
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _user_id UUID; _charge NUMERIC; _status order_status; _new_balance NUMERIC;
BEGIN
  SELECT user_id, COALESCE(charge, price), status
    INTO _user_id, _charge, _status
    FROM public.orders WHERE id = _order_id FOR UPDATE;
  IF _user_id IS NULL THEN RAISE EXCEPTION 'Order % not found', _order_id; END IF;

  IF EXISTS (SELECT 1 FROM public.transactions
             WHERE reference_id = _order_id AND type = 'refund') THEN
    RETURN 0;
  END IF;

  UPDATE public.profiles SET balance = balance + _charge, updated_at = now()
    WHERE user_id = _user_id RETURNING balance INTO _new_balance;

  INSERT INTO public.transactions
    (user_id, type, amount, status, description, reference_id, balance_after)
  VALUES (_user_id, 'refund', _charge, 'completed',
          COALESCE('Refund: ' || _reason, 'Order refund'), _order_id, _new_balance);

  UPDATE public.orders SET status = 'failed', updated_at = now() WHERE id = _order_id;
  RETURN _charge;
END;
$$;

CREATE OR REPLACE FUNCTION public.refund_order_partial(
  _order_id uuid, _amount numeric, _reason text DEFAULT NULL
)
RETURNS numeric
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _user_id UUID; _charge NUMERIC; _new_balance NUMERIC;
BEGIN
  IF _amount IS NULL OR _amount <= 0 THEN RETURN 0; END IF;

  SELECT user_id, COALESCE(charge, price) INTO _user_id, _charge
    FROM public.orders WHERE id = _order_id FOR UPDATE;
  IF _user_id IS NULL THEN RAISE EXCEPTION 'Order % not found', _order_id; END IF;

  IF _amount > _charge THEN _amount := _charge; END IF;

  IF EXISTS (SELECT 1 FROM public.transactions
             WHERE reference_id = _order_id AND type = 'refund') THEN
    RETURN 0;
  END IF;

  UPDATE public.profiles SET balance = balance + _amount, updated_at = now()
    WHERE user_id = _user_id RETURNING balance INTO _new_balance;

  INSERT INTO public.transactions
    (user_id, type, amount, status, description, reference_id, balance_after)
  VALUES (_user_id, 'refund', _amount, 'completed',
          COALESCE('Partial refund: ' || _reason, 'Partial order refund'),
          _order_id, _new_balance);
  RETURN _amount;
END;
$$;

REVOKE ALL ON FUNCTION public.refund_order(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.refund_order(uuid, text) TO service_role;
REVOKE ALL ON FUNCTION public.refund_order_partial(uuid, numeric, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.refund_order_partial(uuid, numeric, text) TO service_role;
