"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "", label: "Home" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
  { href: "/support", label: "Support" },
];

export function BottomNav({ storeSlug }: { storeSlug: string }) {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-ink/10 bg-sand/95 px-6 py-3 backdrop-blur md:hidden dark:border-sand/10 dark:bg-[#1a1a1a]/95">
      <div className="flex items-center justify-between text-xs">
        {links.map((link) => {
          const target = `/${storeSlug}${link.href}`;
          const active = pathname === target;
          return (
            <Link
              key={link.label}
              href={target}
              className={`rounded-full px-3 py-1 ${
                active
                  ? "bg-ink text-sand dark:bg-sand dark:text-[#121212]"
                  : "text-ink/70 dark:text-sand/70"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
