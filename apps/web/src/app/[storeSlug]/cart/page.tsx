import { fetchStore } from "@/lib/api";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { CartView } from "@/components/cart/cart-view";

export default async function CartPage({ params }: { params: { storeSlug: string } }) {
  const store = await fetchStore(params.storeSlug);
  if (!store) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-sand px-6 py-10 dark:bg-[#121212]">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="font-display text-3xl text-ink">Your Cart</h1>
        <Card>
          <CartView storeSlug={store.slug} />
        </Card>
      </div>
    </main>
  );
}
