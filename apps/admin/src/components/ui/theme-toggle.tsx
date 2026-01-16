"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin_theme") || "light";
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("admin_theme", next ? "dark" : "light");
  };

  return (
    <Button
      className="bg-transparent text-noir border border-noir/10 hover:bg-noir/10 dark:text-white dark:border-white/20 dark:hover:bg-white/10"
      onClick={toggle}
    >
      {dark ? "Light" : "Dark"}
    </Button>
  );
}
