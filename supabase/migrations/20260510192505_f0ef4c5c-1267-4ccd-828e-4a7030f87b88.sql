-- Add tier classification to services
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS tier text;

-- Recompute tiers per platform: bottom 33% base_rate -> basic, mid -> premium, top -> vip
CREATE OR REPLACE FUNCTION public.recompute_service_tiers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  WITH ranked AS (
    SELECT
      id,
      platform,
      ntile(3) OVER (PARTITION BY platform ORDER BY COALESCE(base_rate, marked_up_rate, rate_per_1000) ASC) AS bucket,
      COUNT(*) OVER (PARTITION BY platform) AS platform_count
    FROM public.services
    WHERE active = true AND COALESCE(base_rate, marked_up_rate, rate_per_1000) IS NOT NULL
  )
  UPDATE public.services s
  SET tier = CASE
    WHEN r.platform_count < 3 THEN 'premium'
    WHEN r.bucket = 1 THEN 'basic'
    WHEN r.bucket = 2 THEN 'premium'
    ELSE 'vip'
  END
  FROM ranked r
  WHERE r.id = s.id;
END;
$$;

-- Backfill existing rows
SELECT public.recompute_service_tiers();