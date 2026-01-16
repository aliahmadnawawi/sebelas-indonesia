"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { clearToken } from "@/lib/api";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = () => {
    clearToken();
    router.replace("/login");
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-ash">
        <nav className="border-b border-noir/10 bg-white dark:bg-[#1a1a1a] dark:border-white/10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-6">
              <Link className="font-display text-xl text-noir" href="/tenants">
                sebelasindonesia Admin
              </Link>
              <Link className="text-sm text-noir/70" href="/tenants">
                Tenants
              </Link>
              <Link className="text-sm text-noir/70" href="/stores">
                Stores
              </Link>
              <Link className="text-sm text-noir/70" href="/products">
                Products
              </Link>
              <Link className="text-sm text-noir/70" href="/channels">
                Channels
              </Link>
              <Link className="text-sm text-noir/70" href="/payments">
                Payment Providers
              </Link>
              <Link className="text-sm text-noir/70" href="/bot-settings">
                Bot Settings
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button className="text-sm text-signal" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </nav>
        <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
      </div>
    </AuthGuard>
  );
}
