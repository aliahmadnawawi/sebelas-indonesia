"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export default function PaymentsPage() {
  const [storeId, setStoreId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [providerCode, setProviderCode] = useState("tripay");
  const [config, setConfig] = useState("{}");
  const [providers, setProviders] = useState<any[]>([]);
  const [qrisEnabled, setQrisEnabled] = useState(true);

  const loadProviders = async () => {
    if (!storeId) return;
    const data = await apiFetch(`/admin/stores/${storeId}/payment-providers`);
    setProviders(data);
  };

  const saveProvider = async () => {
    let parsedConfig = {};
    try {
      parsedConfig = JSON.parse(config || "{}");
    } catch {
      parsedConfig = {};
    }
    parsedConfig = { ...parsedConfig, qrisEnabled };
    await apiFetch(`/admin/stores/${storeId}/payment-providers/${providerCode}`, {
      method: "PATCH",
      body: JSON.stringify({
        tenantId,
        isEnabled: true,
        config: parsedConfig,
      }),
    });
    loadProviders();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-noir">Payment Providers</h1>
      <Card>
        <h2 className="font-semibold">Configure Store Provider</h2>
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
          <select
            className="rounded-xl border border-noir/10 bg-white px-3 py-2"
            value={providerCode}
            onChange={(e) => setProviderCode(e.target.value)}
          >
            <option value="tripay">Tripay</option>
            <option value="pakasir">Pakasir</option>
            <option value="saweria">Saweria</option>
            <option value="mock">Mock</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-noir/70">
            <input
              type="checkbox"
              checked={qrisEnabled}
              onChange={(e) => setQrisEnabled(e.target.checked)}
            />
            Enable QRIS
          </label>
          <textarea
            className="rounded-xl border border-noir/10 bg-white px-3 py-2"
            rows={4}
            placeholder='{"apiKey":"..."}'
            value={config}
            onChange={(e) => setConfig(e.target.value)}
          />
        </div>
        <div className="mt-4 flex gap-3">
          <Button onClick={saveProvider}>Save Provider</Button>
          <Button className="bg-transparent text-noir border border-noir/10" onClick={loadProviders}>
            Load Store Providers
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold">Configured Providers</h2>
        <div className="mt-4 space-y-3">
          {providers.map((provider) => (
            <div key={provider.id} className="border-b border-noir/10 pb-3 text-sm">
              <p>{provider.providerCode}</p>
              <p className="text-xs uppercase text-mint">
                {provider.isEnabled ? "enabled" : "disabled"}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
