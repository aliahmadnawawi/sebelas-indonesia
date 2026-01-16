"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [tenantId, setTenantId] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const loadStores = () => {
    apiFetch("/admin/stores")
      .then(setStores)
      .catch(() => setStores([]));
  };

  useEffect(() => {
    loadStores();
  }, []);

  const handleCreate = async () => {
    await apiFetch("/admin/stores", {
      method: "POST",
      body: JSON.stringify({ tenantId, name, slug }),
    });
    setName("");
    setSlug("");
    loadStores();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-noir">Stores</h1>
      <Card>
        <h2 className="font-semibold text-noir">Create Store</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            className="rounded-xl border border-noir/10 bg-white px-3 py-2"
            placeholder="Tenant ID"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
          />
          <input
            className="rounded-xl border border-noir/10 bg-white px-3 py-2"
            placeholder="Store Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="rounded-xl border border-noir/10 bg-white px-3 py-2"
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <Button className="mt-4" onClick={handleCreate}>
          Create Store
        </Button>
      </Card>

      <Card>
        <h2 className="font-semibold text-noir">Store List</h2>
        <p className="mt-2 text-sm text-noir/60">
          Connect Domain: Point a custom subdomain to sebelasindonesia.app and add DNS A
          record. Wildcard routing will resolve the store slug.
        </p>
        <div className="mt-6 space-y-4">
          {stores.map((store) => (
            <div key={store.id} className="border-b border-noir/10 pb-4">
              <p className="font-semibold">{store.name}</p>
              <p className="text-sm text-noir/60">
                {store.slug} · {store.tenantId}
              </p>
              <p className="text-xs uppercase text-mint">{store.status}</p>
            </div>
          ))}
          {stores.length === 0 && (
            <p className="text-sm text-noir/60">No stores found.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
