import { Sprout } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./theme-toggle";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50">
      <div className="glass mx-auto mt-4 flex max-w-[1200px] items-center justify-between rounded-2xl px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg gradient-bg shadow-[0_8px_24px_-8px_rgba(184,62,148,.6)]">
            <Sprout className="h-4 w-4 text-white" />
          </span>
          <span className="text-base font-medium tracking-tight">Boostan</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-foreground-muted md:flex">
          <a href="#services" className="hover:text-foreground">Services</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#api" className="hover:text-foreground">API</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login" className="hidden rounded-lg px-3 py-2 text-sm text-foreground-muted hover:text-foreground sm:inline-block">
            Sign in
          </Link>
          <Link to="/signup" className="btn-gradient rounded-lg px-4 py-2 text-sm">
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
