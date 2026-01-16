"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type CartItem = {
  id: string;
  productId: string;
  qty: number;
  priceAtAdd: number;
  product?: { name: string };
};

export function CartView({ storeSlug }: { storeSlug: string }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const storageKey = `cart:${storeSlug}`;
    const stored = localStorage.getItem(storageKey);
    if (!stored) return;
    setCartId(stored);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/stores/${storeSlug}/cart/${stored}`)
      .then((res) => res.json())
      .then((data) => {
        const cartItems = data.items || [];
        setItems(cartItems);
        const sum = cartItems.reduce(
          (acc: number, item: CartItem) => acc + item.priceAtAdd * item.qty,
          0
        );
        setTotal(sum);
      });
  }, [storeSlug]);

  if (!cartId) {
    return <p className="text-ink/70">Cart is empty.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ink/60">Product</p>
            <p className="font-semibold text-ink">
              {item.product?.name || item.productId}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="text-ink/70">x{item.qty}</p>
            <p className="font-semibold text-moss">{item.priceAtAdd * item.qty}</p>
          </div>
        </div>
      ))}
      <div className="border-t border-ink/10 pt-4 text-right">
        <p className="text-sm text-ink/60">Total</p>
        <p className="text-xl font-semibold text-ink">{total}</p>
      </div>
      <Link href={`/${storeSlug}/checkout`}>
        <Button>Proceed to checkout</Button>
      </Link>
    </div>
  );
}
