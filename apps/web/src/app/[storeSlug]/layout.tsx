import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BottomNav } from "@/components/storefront/bottom-nav";
import { SupportWidget } from "@/components/storefront/support-widget";

export default function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeSlug: string };
}) {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-sand/90 px-6 py-4 backdrop-blur dark:border-sand/10 dark:bg-[#141414]/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href={`/${params.storeSlug}`} className="font-display text-xl">
            {params.storeSlug}
          </Link>
          <ThemeToggle />
        </div>
      </header>
      {children}
      <BottomNav storeSlug={params.storeSlug} />
      <SupportWidget />
    </div>
  );
}
