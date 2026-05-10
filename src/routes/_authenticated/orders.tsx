import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/orders")({
  component: OrdersPage,
  head: () => ({ meta: [{ title: "Orders — Boostan" }] }),
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

function OrdersPage() {
  const { user } = useAuth();
  const { data: orders } = useQuery({
    queryKey: ["orders-all", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, services(name, platform)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-foreground-subtle">History</p>
        <h1 className="mt-1 text-3xl md:text-4xl">Orders</h1>
      </header>

      <section className="glass overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wider text-foreground-subtle">
                <th className="px-6 py-3 font-normal">ID</th>
                <th className="px-6 py-3 font-normal">Service</th>
                <th className="px-6 py-3 font-normal">Link</th>
                <th className="px-6 py-3 font-normal">Qty</th>
                <th className="px-6 py-3 font-normal">Price</th>
                <th className="px-6 py-3 font-normal">Status</th>
                <th className="px-6 py-3 font-normal">Date</th>
              </tr>
            </thead>
            <tbody>
              {(orders ?? []).length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-sm text-foreground-muted">
                    No orders yet. Head to <span className="text-foreground">New order</span> to create your first one.
                  </td>
                </tr>
              )}
              {(orders ?? []).map((o: any) => (
                <tr key={o.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)]">
                  <td className="px-6 py-4 font-mono text-xs text-foreground-subtle">{o.id.slice(0, 8)}</td>
                  <td className="px-6 py-4">
                    <div>{o.services?.name}</div>
                    <div className="text-xs text-foreground-subtle">{o.services?.platform}</div>
                  </td>
                  <td className="max-w-[220px] truncate px-6 py-4 text-foreground-muted">{o.link}</td>
                  <td className="tabular px-6 py-4">{Number(o.quantity).toLocaleString()}</td>
                  <td className="tabular px-6 py-4">${Number(o.price).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-md px-2 py-0.5 text-xs capitalize ${STATUS_STYLES[o.status]}`}>
                      {String(o.status).replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-foreground-muted">
                    {new Date(o.created_at).toLocaleDateString()}
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
