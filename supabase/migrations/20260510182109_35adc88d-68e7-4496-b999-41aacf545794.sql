CREATE TABLE public.webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'nowpayments',
  method text,
  headers jsonb,
  raw_body text,
  parsed_payload jsonb,
  signature_valid boolean,
  signature_reason text,
  payment_id text,
  payment_status text,
  tx_lookup_found boolean,
  tx_id uuid,
  action text,
  amount_credited numeric,
  response_status integer,
  error text,
  is_test boolean NOT NULL DEFAULT false
);

CREATE INDEX idx_webhook_logs_created_at ON public.webhook_logs (created_at DESC);
CREATE INDEX idx_webhook_logs_payment_id ON public.webhook_logs (payment_id);

ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read webhook logs"
  ON public.webhook_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
