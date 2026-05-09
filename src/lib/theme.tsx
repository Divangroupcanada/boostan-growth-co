import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light" | "system";
type Ctx = { theme: Theme; resolved: "dark" | "light"; setTheme: (t: Theme) => void };

const ThemeContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "boostan-theme";

function applyTheme(t: "dark" | "light") {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(t);
  root.style.colorScheme = t;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolved, setResolved] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "dark";
    setThemeState(stored);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const compute = () => {
      const r = theme === "system" ? (mql.matches ? "light" : "dark") : theme;
      setResolved(r);
      applyTheme(r);
    };
    compute();
    if (theme === "system") {
      mql.addEventListener("change", compute);
      return () => mql.removeEventListener("change", compute);
    }
  }, [theme]);

  const setTheme = (t: Theme) => {
    localStorage.setItem(STORAGE_KEY, t);
    setThemeState(t);
  };

  return <ThemeContext.Provider value={{ theme, resolved, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
