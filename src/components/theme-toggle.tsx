import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <button
      onClick={() => setTheme(next)}
      className="glass inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:text-foreground"
      aria-label={`Theme: ${theme}. Switch to ${next}.`}
      title={`Theme: ${theme}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
