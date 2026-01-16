"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") || "light";
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <Button
      className="bg-transparent text-ink border border-ink/20 hover:bg-ink/10 dark:text-sand dark:border-sand/20 dark:hover:bg-white/10"
      onClick={toggle}
    >
      {dark ? "Light Mode" : "Dark Mode"}
    </Button>
  );
}
