-- Extend transactions table for NOWPayments
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS payment_id text,
  ADD COLUMN IF NOT EXISTS pay_address text,
  ADD COLUMN IF NOT EXISTS pay_amount numeric,
  ADD COLUMN IF NOT EXISTS pay_currency text,
  ADD COLUMN IF NOT EXISTS payment_status text,
  ADD COLUMN IF NOT EXISTS ipn_payload jsonb;

-- Add new tx types to the enum
ALTER TYPE public.tx_type ADD VALUE IF NOT EXISTS 'deposit_pending';
ALTER TYPE public.tx_type ADD VALUE IF NOT EXISTS 'manual_etransfer';

-- Idempotency: prevent double-crediting the same NOWPayments invoice
CREATE UNIQUE INDEX IF NOT EXISTS transactions_deposit_payment_id_uniq
  ON public.transactions (payment_id)
  WHERE type = 'deposit' AND payment_id IS NOT NULL;

-- Helpful index for webhook lookups
CREATE INDEX IF NOT EXISTS transactions_payment_id_idx
  ON public.transactions (payment_id) WHERE payment_id IS NOT NULL;