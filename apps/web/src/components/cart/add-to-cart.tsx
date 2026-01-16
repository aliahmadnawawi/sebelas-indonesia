"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addCartItem, createCart } from "@/lib/api";

type Props = {
  storeSlug: string;
  productId: string;
};

export function AddToCartButton({ storeSlug, productId }: Props) {
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    const storageKey = `cart:${storeSlug}`;
    let cartId = localStorage.getItem(storageKey);
    if (!cartId) {
      const cart = await createCart(storeSlug);
      cartId = cart.id;
      localStorage.setItem(storageKey, cartId);
    }
    await addCartItem(storeSlug, cartId, productId, 1);
    setLoading(false);
  };

  return (
    <Button className="text-xs px-4 py-2" onClick={handleAdd} disabled={loading}>
      {loading ? "Adding..." : "Add"}
    </Button>
  );
}
