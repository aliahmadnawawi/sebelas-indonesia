"use client";

import { useState } from "react";

const whatsapp = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "";
const telegram = process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM || "";

export function SupportWidget() {
  const [open, setOpen] = useState(false);

  if (!whatsapp && !telegram) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6">
      {open && (
        <div className="mb-3 space-y-2 rounded-2xl border border-ink/10 bg-white/90 p-3 text-sm shadow-lg backdrop-blur dark:border-sand/10 dark:bg-[#1f1f1f]/90">
          {whatsapp && (
            <a
              className="block text-moss underline"
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
            >
              Chat on WhatsApp
            </a>
          )}
          {telegram && (
            <a
              className="block text-moss underline"
              href={`https://t.me/${telegram}`}
              target="_blank"
            >
              Chat on Telegram
            </a>
          )}
        </div>
      )}
      <button
        className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-sand shadow-md dark:bg-sand dark:text-[#121212]"
        onClick={() => setOpen(!open)}
      >
        Customer Service
      </button>
    </div>
  );
}
