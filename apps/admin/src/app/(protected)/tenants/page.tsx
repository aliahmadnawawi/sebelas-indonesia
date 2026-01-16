"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);

  useEffect(() => {
    apiFetch("/admin/tenants")
      .then(setTenants)
      .catch(() => setTenants([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-noir">Tenants</h1>
      <Card>
        <div className="space-y-4">
          {tenants.map((tenant) => (
            <div key={tenant.id} className="border-b border-noir/10 pb-4">
              <p className="font-semibold text-noir">{tenant.name}</p>
              <p className="text-sm text-noir/60">{tenant.id}</p>
              <p className="text-xs uppercase text-mint">{tenant.status}</p>
            </div>
          ))}
          {tenants.length === 0 && (
            <p className="text-sm text-noir/60">No tenants found.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
