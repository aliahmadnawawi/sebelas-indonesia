import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProduct, fetchStore } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/cart/add-to-cart";

export default async function ProductDetail({
  params,
}: {
  params: { storeSlug: string; productId: string };
}) {
  const store = await fetchStore(params.storeSlug);
  if (!store) {
    notFound();
  }
  const product = await fetchProduct(params.storeSlug, params.productId);
  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-sand px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link className="text-sm text-moss underline" href={`/${store.slug}`}>
          Back to store
        </Link>
        <h1 className="font-display text-4xl text-ink">{product.name}</h1>
        <p className="text-ink/70">{product.description}</p>
        <div className="flex gap-4">
          <AddToCartButton storeSlug={store.slug} productId={product.id} />
          <Link href={`/${store.slug}/cart`}>
            <Button className="bg-transparent text-ink border-ink/20 hover:bg-ink/10">
              View Cart
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
