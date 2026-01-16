import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProducts, fetchStore } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/cart/add-to-cart";

export default async function StorePage({ params }: { params: { storeSlug: string } }) {
  const store = await fetchStore(params.storeSlug);
  if (!store) {
    notFound();
  }
  const products = await fetchProducts(params.storeSlug);

  return (
    <main className="min-h-screen bg-sand px-6 py-8 md:py-12 dark:bg-[#121212]">
      <div className="mx-auto max-w-6xl space-y-8 md:space-y-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-clay">{store.slug}</p>
            <h1 className="font-display text-4xl text-ink">{store.name}</h1>
          </div>
          <Link href={`/${store.slug}/cart`}>
            <Button>View Cart</Button>
          </Link>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product: any) => (
            <Card key={product.id} className="flex flex-col justify-between">
              <div>
                <h3 className="font-display text-2xl text-ink">{product.name}</h3>
                <p className="mt-2 text-sm text-ink/70">{product.description}</p>
                <p className="mt-4 text-sm font-semibold text-moss">
                  {product.prices?.[0]?.currency || "IDR"}{" "}
                  {product.prices?.[0]?.amount || "-"}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <Link
                  className="text-sm font-semibold text-moss underline"
                  href={`/${store.slug}/products/${product.id}`}
                >
                  View details
                </Link>
                <AddToCartButton storeSlug={store.slug} productId={product.id} />
              </div>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
