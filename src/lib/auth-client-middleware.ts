import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

// Client-side middleware that attaches the current Supabase session's
// access token as a Bearer Authorization header on the outgoing server-fn
// request. Pair with `requireSupabaseAuth` on the server side.
export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return next({
      sendContext: {},
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
);
