"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export default function ProductsPage() {
  const [storeId, setStoreId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [amount, setAmount] = useState("0");
  const [updateProductId, setUpdateProductId] = useState("");
  const [updateStock, setUpdateStock] = useState("0");
  const [updatePrice, setUpdatePrice] = useState("0");

  const loadProducts = async () => {
    if (!storeId) return;
    const data = await apiFetch(`/admin/stores/${storeId}/products`);
    setProducts(data);
  };

  const handleCreate = async () => {
    await apiFetch(`/admin/stores/${storeId}/products`, {
      method: "POST",
      body: JSON.stringify({
        tenantId,
        name,
        slug,
        currency: "IDR",
        amount: Number(amount),
      }),
    });
    setName("");
    setSlug("");
    setAmount("0");
    loadProducts();
  };

  const handleUpdateStock = async () => {
    await apiFetch(`/admin/stores/${storeId}/products/${updateProductId}/stock`, {
      method: "PATCH",
      body: JSON.stringify({ stockQty: Number(updateStock) }),
    });
    setUpdateProductId("");
    setUpdateStock("0");
  };

  const handleUpdatePrice = async () => {
    await apiFetch(`/admin/stores/${storeId}/products/${updateProductId}/price`, {
      method: "PATCH",
      body: JSON.stringify({ amount: Number(updatePrice) }),
    });
    setUpdateProductId("");
    setUpdatePrice("0");
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-noir">Products</h1>
      <Card>
        <h2 className="font-semibold">Load Store Products</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border border-noir/10 bg-white px-3 py-2"
            placeholder="Store ID"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
          />
          <input
            className="rounded-xl border border-noir/10 bg-white px-3 py-2"
            placeholder="Tenant ID"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
          />
        </div>
        <Button className="mt-4" onClick={loadProducts}>
          Load Products
        </Button>
      </Card>
      <Card>
        <h2 className="font-semibold">Create Product</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            className="rounded-xl border border-noir/10 bg-white px-3 py-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="rounded-xl border border-noir/10 bg-white px-3 py-2"
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <input
            className="rounded-xl border border-noir/10 bg-white px-3 py-2"
            placeholder="Price"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <Button className="mt-4" onClick={handleCreate}>
          Create Product
        </Button>
      </Card>
      <Card>
        <h2 className="font-semibold">Update Stock / Price</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            className="rounded-xl border border-noir/10 bg-white px-3 py-2"
            placeholder="Product ID"
            value={updateProductId}
            onChange={(e) => setUpdateProductId(e.target.value)}
          />
          <input
            className="rounded-xl border border-noir/10 bg-white px-3 py-2"
            placeholder="Stock Qty"
            value={updateStock}
            onChange={(e) => setUpdateStock(e.target.value)}
          />
          <input
            className="rounded-xl border border-noir/10 bg-white px-3 py-2"
            placeholder="Price"
            value={updatePrice}
            onChange={(e) => setUpdatePrice(e.target.value)}
          />
        </div>
        <div className="mt-4 flex gap-3">
          <Button onClick={handleUpdateStock}>Update Stock</Button>
          <Button className="bg-transparent text-noir border border-noir/10" onClick={handleUpdatePrice}>
            Update Price
          </Button>
        </div>
      </Card>
      <Card>
        <h2 className="font-semibold">Product List</h2>
        <div className="mt-4 space-y-4">
          {products.map((product) => (
            <div key={product.id} className="border-b border-noir/10 pb-4">
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-noir/60">{product.slug}</p>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-sm text-noir/60">No products loaded.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
