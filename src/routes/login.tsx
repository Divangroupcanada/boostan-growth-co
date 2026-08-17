import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { Sprout, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — Boostan" }] }),
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) return toast.error(error);
    toast.success("Welcome back");
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const redirect = params.get("redirect");
    if (redirect && redirect.startsWith("/")) {
      window.location.href = redirect;
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="glow-orb animate-float-slow"
        style={{ top: -160, left: -120, background: "var(--primary)" }}
      />
      <div
        className="glow-orb animate-float-med"
        style={{ bottom: -160, right: -120, background: "var(--primary-glow)", opacity: 0.35 }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 py-12">
        <Link to="/" className="mb-10 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg gradient-bg shadow-glow">
            <Sprout className="h-4 w-4 text-white" />
          </span>
          <span className="text-lg font-medium">Boostan</span>
        </Link>

        <div className="glass w-full rounded-2xl p-8">
          <h1 className="text-2xl">Welcome back</h1>
          <p className="mt-1 text-sm text-foreground-muted">Sign in to your panel.</p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@email.com"
            />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />
            <button
              disabled={loading}
              className="btn-gradient mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm disabled:opacity-60"
            >
              {loading ? (
                "Signing in…"
              ) : (
                <>
                  Sign in <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground-muted">
            New to Boostan?{" "}
            <Link to="/signup" className="text-foreground hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-foreground-muted">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--border-strong)] focus:ring-2 focus:ring-[var(--primary-glow)]/30"
      />
    </label>
  );
}
