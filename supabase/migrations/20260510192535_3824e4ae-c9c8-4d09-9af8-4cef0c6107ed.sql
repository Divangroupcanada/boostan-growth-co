REVOKE EXECUTE ON FUNCTION public.recompute_service_tiers() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.recompute_service_tiers() TO service_role;