"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function BotSettingsPage() {
  const [storeId, setStoreId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [telegramBots, setTelegramBots] = useState<any[]>([]);
  const [whatsappChannels, setWhatsappChannels] = useState<any[]>([]);

  const loadChannels = async () => {
    if (!storeId) return;
    const telegram = await apiFetch(`/admin/stores/${storeId}/telegram-bots`);
    const whatsapp = await apiFetch(`/admin/stores/${storeId}/whatsapp-channels`);
    setTelegramBots(telegram);
    setWhatsappChannels(whatsapp);
  };

  const toggleTelegram = async (botId: string, status: string) => {
    await apiFetch(`/admin/stores/${storeId}/telegram-bots/${botId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    loadChannels();
  };

  const toggleWhatsApp = async (channelId: string, status: string) => {
    await apiFetch(`/admin/stores/${storeId}/whatsapp-channels/${channelId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    loadChannels();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-noir">Bot Settings</h1>
      <Card>
        <div className="grid gap-3 md:grid-cols-2">
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
        <Button className="mt-4" onClick={loadChannels}>
          Load Bot Settings
        </Button>
      </Card>

      <Card>
        <h2 className="font-semibold">Telegram</h2>
        <p className="text-sm text-noir/60">
          Webhook: {API_URL}/telegram/webhook/&lt;botToken&gt;
        </p>
        <div className="mt-4 space-y-3">
          {telegramBots.map((bot) => (
            <div key={bot.id} className="flex items-center justify-between border-b pb-3 text-sm">
              <div>
                <p className="font-semibold">{bot.botToken}</p>
                <p className="text-xs uppercase text-mint">{bot.status}</p>
              </div>
              <Button
                className="bg-transparent text-noir border border-noir/10"
                onClick={() =>
                  toggleTelegram(bot.id, bot.status === "ACTIVE" ? "DISABLED" : "ACTIVE")
                }
              >
                {bot.status === "ACTIVE" ? "Disable" : "Enable"}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold">WhatsApp</h2>
        <p className="text-sm text-noir/60">Webhook: {API_URL}/whatsapp/webhook</p>
        <div className="mt-4 space-y-3">
          {whatsappChannels.map((channel) => (
            <div
              key={channel.id}
              className="flex items-center justify-between border-b pb-3 text-sm"
            >
              <div>
                <p className="font-semibold">Phone {channel.phoneNumberId}</p>
                <p className="text-xs uppercase text-mint">{channel.status}</p>
              </div>
              <Button
                className="bg-transparent text-noir border border-noir/10"
                onClick={() =>
                  toggleWhatsApp(
                    channel.id,
                    channel.status === "ACTIVE" ? "DISABLED" : "ACTIVE"
                  )
                }
              >
                {channel.status === "ACTIVE" ? "Disable" : "Enable"}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
