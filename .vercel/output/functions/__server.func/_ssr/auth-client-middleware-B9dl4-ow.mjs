import { c as createMiddleware, g as getRequest } from "./server-B-gRx3ND.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { a as supabase } from "./client.server-j8IJ-cKj.mjs";
const requireSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      const missing = [
        ...!SUPABASE_URL ? ["SUPABASE_URL"] : [],
        ...!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []
      ];
      const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`;
      console.error(`[Supabase] ${message}`);
      throw new Response(message, { status: 500 });
    }
    const request = getRequest();
    if (!request?.headers) {
      throw new Response("Unauthorized: No request headers available", { status: 401 });
    }
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      throw new Response("Unauthorized: No authorization header provided", { status: 401 });
    }
    if (!authHeader.startsWith("Bearer ")) {
      throw new Response("Unauthorized: Only Bearer tokens are supported", { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      throw new Response("Unauthorized: No token provided", { status: 401 });
    }
    const supabase2 = createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        auth: {
          storage: void 0,
          persistSession: false,
          autoRefreshToken: false
        }
      }
    );
    const { data, error } = await supabase2.auth.getClaims(token);
    if (error || !data?.claims) {
      throw new Response("Unauthorized: Invalid token", { status: 401 });
    }
    if (!data.claims.sub) {
      throw new Response("Unauthorized: No user ID found in token", { status: 401 });
    }
    return next({
      context: {
        supabase: supabase2,
        userId: data.claims.sub,
        claims: data.claims
      }
    });
  }
);
const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return next({
      sendContext: {},
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }
);
export {
  attachSupabaseAuth as a,
  requireSupabaseAuth as r
};
