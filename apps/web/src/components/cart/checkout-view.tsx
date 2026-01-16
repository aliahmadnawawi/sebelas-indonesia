"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function CheckoutView({ storeSlug }: { storeSlug: string }) {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [provider, setProvider] = useState("tripay");
  const [method, setMethod] = useState("QRIS");
  const [cartTotal, setCartTotal] = useState(0);
  const [cartId, setCartId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(`cart:${storeSlug}`);
    if (!stored) return;
    setCartId(stored);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/stores/${storeSlug}/cart/${stored}`)
      .then((res) => res.json())
      .then((data) => {
        const total = (data.items || []).reduce(
          (acc: number, item: any) => acc + item.priceAtAdd * item.qty,
          0
        );
        setCartTotal(total);
      });
  }, [storeSlug]);

  const handleCheckout = async () => {
    if (!cartId) {
      return;
    }
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/stores/${storeSlug}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId, providerCode: provider, paymentMethod: method }),
    });
    const data = await res.json();
    setPaymentUrl(data.payment.paymentUrl || null);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-ink/10 bg-white/70 p-4 text-sm dark:border-sand/10 dark:bg-[#1a1a1a]">
        <p className="text-ink/60 dark:text-sand/60">Order summary</p>
        <p className="text-xl font-semibold text-ink dark:text-sand">{cartTotal} IDR</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm text-ink/70">
          Provider
          <select
            className="mt-2 w-full rounded-xl border border-ink/10 bg-white/70 p-2"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <option value="tripay">Tripay</option>
            <option value="pakasir">Pakasir</option>
            <option value="saweria">Saweria</option>
            <option value="mock">Mock</option>
          </select>
        </label>
        <label className="text-sm text-ink/70">
          Method
          <select
            className="mt-2 w-full rounded-xl border border-ink/10 bg-white/70 p-2"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="QRIS">QRIS</option>
          </select>
        </label>
      </div>
      <Button onClick={handleCheckout} disabled={loading || !cartId}>
        {loading ? "Processing..." : "Create Invoice"}
      </Button>
      {paymentUrl && (
        <div className="rounded-2xl border border-ink/10 bg-white/70 p-4 text-sm">
          Payment link:{" "}
          <a className="text-moss underline" href={paymentUrl} target="_blank">
            {paymentUrl}
          </a>
        </div>
      )}
    </div>
  );
}
