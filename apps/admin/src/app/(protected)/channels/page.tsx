"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function ChannelsPage() {
  const [storeId, setStoreId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [telegramBots, setTelegramBots] = useState<any[]>([]);
  const [whatsappChannels, setWhatsappChannels] = useState<any[]>([]);
  const [botToken, setBotToken] = useState("");
  const [waPhoneNumberId, setWaPhoneNumberId] = useState("");
  const [waWabaId, setWaWabaId] = useState("");
  const [waAccessToken, setWaAccessToken] = useState("");
  const [waVerifyToken, setWaVerifyToken] = useState("");

  const loadChannels = async () => {
    if (!storeId) return;
    const telegram = await apiFetch(`/admin/stores/${storeId}/telegram-bots`);
    const whatsapp = await apiFetch(`/admin/stores/${storeId}/whatsapp-channels`);
    setTelegramBots(telegram);
    setWhatsappChannels(whatsapp);
  };

  const addTelegram = async () => {
    await apiFetch(`/admin/stores/${storeId}/telegram-bots`, {
      method: "POST",
      body: JSON.stringify({ tenantId, botToken }),
    });
    setBotToken("");
    loadChannels();
  };

  const addWhatsApp = async () => {
    await apiFetch(`/admin/stores/${storeId}/whatsapp-channels`, {
      method: "POST",
      body: JSON.stringify({
        tenantId,
        phoneNumberId: waPhoneNumberId,
        wabaId: waWabaId,
        accessToken: waAccessToken,
        webhookVerifyToken: waVerifyToken,
      }),
    });
    setWaPhoneNumberId("");
    setWaWabaId("");
    setWaAccessToken("");
    setWaVerifyToken("");
    loadChannels();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-noir">Channels</h1>
      <Card>
        <h2 className="font-semibold">Select Store</h2>
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
        <Button className="mt-4" onClick={loadChannels}>
          Load Channels
        </Button>
      </Card>

      <Card>
        <h2 className="font-semibold">Telegram Bots</h2>
        <p className="mt-2 text-sm text-noir/60">
          Webhook URL format: {API_URL}/telegram/webhook/&lt;botToken&gt;
        </p>
        <p className="text-xs text-noir/50">
          Set secret header `X-Telegram-Bot-Api-Secret-Token` to TELEGRAM_WEBHOOK_SECRET.
        </p>
        <div className="mt-4 flex gap-3">
          <input
            className="flex-1 rounded-xl border border-noir/10 bg-white px-3 py-2"
            placeholder="Bot token"
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
          />
          <Button onClick={addTelegram}>Add Bot</Button>
        </div>
        <div className="mt-4 space-y-3">
          {telegramBots.map((bot) => (
            <div key={bot.id} className="border-b border-noir/10 pb-3 text-sm">
              <p>{bot.botToken}</p>
              <p className="text-xs uppercase text-mint">{bot.status}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold">WhatsApp Cloud API</h2>
        <p className="mt-2 text-sm text-noir/60">
          Webhook URL: {API_URL}/whatsapp/webhook
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border border-noir/10 bg-white px-3 py-2"
            placeholder="Phone Number ID"
            value={waPhoneNumberId}
            onChange={(e) => setWaPhoneNumberId(e.target.value)}
          />
          <input
            className="rounded-xl border border-noir/10 bg-white px-3 py-2"
            placeholder="WABA ID"
            value={waWabaId}
            onChange={(e) => setWaWabaId(e.target.value)}
          />
          <input
            className="rounded-xl border border-noir/10 bg-white px-3 py-2"
            placeholder="Access Token"
            value={waAccessToken}
            onChange={(e) => setWaAccessToken(e.target.value)}
          />
          <input
            className="rounded-xl border border-noir/10 bg-white px-3 py-2"
            placeholder="Verify Token"
            value={waVerifyToken}
            onChange={(e) => setWaVerifyToken(e.target.value)}
          />
        </div>
        <Button className="mt-4" onClick={addWhatsApp}>
          Add WhatsApp Channel
        </Button>
        <div className="mt-4 space-y-3">
          {whatsappChannels.map((channel) => (
            <div key={channel.id} className="border-b border-noir/10 pb-3 text-sm">
              <p>Phone: {channel.phoneNumberId}</p>
              <p className="text-xs uppercase text-mint">{channel.status}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
