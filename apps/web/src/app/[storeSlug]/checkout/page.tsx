import { fetchStore } from "@/lib/api";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { CheckoutView } from "@/components/cart/checkout-view";

export default async function CheckoutPage({ params }: { params: { storeSlug: string } }) {
  const store = await fetchStore(params.storeSlug);
  if (!store) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-sand px-6 py-10 dark:bg-[#121212]">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="font-display text-3xl text-ink">Checkout</h1>
        <Card>
          <CheckoutView storeSlug={store.slug} />
        </Card>
      </div>
    </main>
  );
}
