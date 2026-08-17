import { createFileRoute, Outlet, Navigate, Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  ShoppingBag,
  ListOrdered,
  Wallet,
  Sparkles,
  LogOut,
  Sprout,
  Code2,
  Shield,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/services", label: "Services", icon: Sparkles },
  { to: "/new-order", label: "New order", icon: ShoppingBag },
  { to: "/orders", label: "Orders", icon: ListOrdered },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/api-keys", label: "API", icon: Code2 },
] as const;

function AuthenticatedLayout() {
  const { session, loading, signOut, user } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    },
    enabled: !!user,
  });

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="text-sm text-foreground-muted">Loading…</div>
      </div>
    );
  }
  if (!session) return <Navigate to="/login" />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="glow-orb"
        style={{ top: -260, left: -200, background: "var(--primary)", opacity: 0.3 }}
      />
      <div
        className="glow-orb"
        style={{ top: 600, right: -240, background: "var(--secondary)", opacity: 0.22 }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px]">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-[var(--border)] px-4 py-6 lg:flex">
          <Link to="/dashboard" className="mb-10 flex items-center gap-2 px-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg gradient-bg shadow-glow">
              <Sprout className="h-4 w-4 text-white" />
            </span>
            <span className="text-base font-medium">Boostan</span>
          </Link>

          <nav className="flex flex-col gap-1">
            {NAV.map((n) => {
              const active = path === n.to || (n.to !== "/dashboard" && path.startsWith(n.to));
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-[var(--surface-strong)] text-foreground"
                      : "text-foreground-muted hover:bg-[var(--surface)] hover:text-foreground"
                  }`}
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  path.startsWith("/admin")
                    ? "bg-[var(--surface-strong)] text-foreground"
                    : "text-foreground-muted hover:bg-[var(--surface)] hover:text-foreground"
                }`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            <div className="glass rounded-xl p-3 text-xs">
              <div className="text-foreground-subtle">Signed in</div>
              <div className="mt-0.5 truncate text-foreground">{user?.email}</div>
            </div>
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <button
                onClick={signOut}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-foreground-muted hover:bg-[var(--surface)] hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile topbar */}
        <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between border-b border-[var(--border)] bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg gradient-bg">
              <Sprout className="h-3.5 w-3.5 text-white" />
            </span>
            <span className="text-sm font-medium">Boostan</span>
          </Link>
          <button onClick={signOut} className="text-xs text-foreground-muted">
            Sign out
          </button>
        </div>

        <main className="flex-1 px-5 pb-20 pt-20 lg:px-10 lg:pt-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
