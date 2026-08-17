import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ArrowUpRight, Plus, TrendingUp, ShoppingBag, Wallet, Activity } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — Boostan" }] }),
});

const STATUS_STYLES: Record<string, string> = {
  pending: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_15%,transparent)]",
  processing: "text-[var(--secondary)] bg-[color-mix(in_oklab,var(--secondary)_15%,transparent)]",
  in_progress: "text-[var(--secondary)] bg-[color-mix(in_oklab,var(--secondary)_15%,transparent)]",
  completed: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_15%,transparent)]",
  partial: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_15%,transparent)]",
  canceled: "text-[var(--foreground-muted)] bg-[var(--surface)]",
  failed: "text-[var(--danger)] bg-[color-mix(in_oklab,var(--danger)_15%,transparent)]",
};

function DashboardPage() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: orders } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, services(name, platform)")
        .order("created_at", { ascending: false })
        .limit(8);
      return data ?? [];
    },
    enabled: !!user,
  });

  const balance = profile?.balance ?? 0;
  const totalOrders = orders?.length ?? 0;
  const completed = orders?.filter((o) => o.status === "completed").length ?? 0;
  const spent = orders?.reduce((s, o) => s + Number(o.price), 0) ?? 0;

  const stats = [
    {
      label: "Wallet balance",
      value: `$${Number(balance).toFixed(2)}`,
      icon: Wallet,
      accent: "var(--primary-glow)",
    },
    {
      label: "Total orders",
      value: totalOrders.toString(),
      icon: ShoppingBag,
      accent: "var(--secondary)",
    },
    { label: "Completed", value: completed.toString(), icon: TrendingUp, accent: "var(--success)" },
    {
      label: "Spent (recent)",
      value: `$${spent.toFixed(2)}`,
      icon: Activity,
      accent: "var(--accent)",
    },
  ];

  const sample = MOCK_ORDERS;
  const showOrders = (orders && orders.length > 0 ? orders : sample) as any[];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-foreground-subtle">Welcome back</p>
          <h1 className="mt-1 text-3xl md:text-4xl">
            {profile?.display_name ?? user?.email?.split("@")[0]}{" "}
            <span className="gradient-text">·</span> ready to grow.
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            to="/wallet"
            className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm"
          >
            Top up <Plus className="h-4 w-4" />
          </Link>
          <Link
            to="/new-order"
            className="btn-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm"
          >
            New order <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass relative overflow-hidden rounded-2xl p-5">
            <div
              className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-30 blur-2xl"
              style={{ background: s.accent }}
            />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="text-xs text-foreground-muted">{s.label}</div>
                <div className="tabular mt-2 text-2xl">{s.value}</div>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--surface-strong)]">
                <s.icon className="h-4 w-4 text-foreground" />
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="glass rounded-2xl">
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <h2 className="text-lg">Recent orders</h2>
            <p className="text-xs text-foreground-muted">Last 8 orders across your account.</p>
          </div>
          <Link to="/orders" className="text-xs text-foreground-muted hover:text-foreground">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-[var(--border)] text-left text-xs uppercase tracking-wider text-foreground-subtle">
                <th className="px-6 py-3 font-normal">Service</th>
                <th className="px-6 py-3 font-normal">Link</th>
                <th className="px-6 py-3 font-normal">Quantity</th>
                <th className="px-6 py-3 font-normal">Price</th>
                <th className="px-6 py-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {showOrders.map((o, i) => (
                <tr
                  key={o.id ?? i}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)]"
                >
                  <td className="px-6 py-4">
                    <div>{o.services?.name ?? o.service}</div>
                    <div className="text-xs text-foreground-subtle">
                      {o.services?.platform ?? o.platform}
                    </div>
                  </td>
                  <td className="max-w-[200px] truncate px-6 py-4 text-foreground-muted">
                    {o.link}
                  </td>
                  <td className="tabular px-6 py-4">{Number(o.quantity).toLocaleString()}</td>
                  <td className="tabular px-6 py-4">${Number(o.price).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-xs capitalize ${STATUS_STYLES[o.status] ?? ""}`}
                    >
                      {String(o.status).replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

const MOCK_ORDERS = [
  {
    id: "m1",
    services: { name: "Instagram Followers - HQ", platform: "Instagram" },
    link: "instagram.com/marcus.l",
    quantity: 5000,
    price: 12.0,
    status: "in_progress",
  },
  {
    id: "m2",
    services: { name: "TikTok Views", platform: "TikTok" },
    link: "tiktok.com/@priya/video/9821",
    quantity: 50000,
    price: 5.0,
    status: "completed",
  },
  {
    id: "m3",
    services: { name: "YouTube Subscribers", platform: "YouTube" },
    link: "youtube.com/@diegor",
    quantity: 200,
    price: 2.4,
    status: "processing",
  },
  {
    id: "m4",
    services: { name: "Twitter Likes", platform: "Twitter / X" },
    link: "x.com/marcusl/status/884",
    quantity: 1000,
    price: 1.4,
    status: "completed",
  },
  {
    id: "m5",
    services: { name: "Telegram Members", platform: "Telegram" },
    link: "t.me/boostangrowth",
    quantity: 2500,
    price: 7.0,
    status: "pending",
  },
];
