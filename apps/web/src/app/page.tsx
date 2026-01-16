import { redirect } from "next/navigation";
import { fetchStore } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function Home() {
  const defaultStore = await fetchStore("sebelas");
  if (defaultStore) {
    redirect("/sebelas");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f6f1e8,_#e9e1d6)] px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-clay">sebelasindonesia</p>
          <h1 className="font-display text-5xl leading-tight text-ink md:text-6xl">
            Commerce that lives where your customers already are.
          </h1>
          <p className="max-w-xl text-lg text-ink/70">
            Launch storefronts, Telegram bots, and WhatsApp commerce in one place.
          </p>
          <div className="flex gap-4">
            <Button>Get Started</Button>
            <a href="/sebelas">
              <Button className="bg-transparent text-ink border-ink/20 hover:bg-ink/10">
                View Demo Store
              </Button>
            </a>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Multi-tenant",
              body: "Manage many stores with strict tenant isolation and role-based access.",
            },
            {
              title: "Multi-channel",
              body: "Sell on web, Telegram, and WhatsApp with unified catalog + inventory.",
            },
            {
              title: "Payments",
              body: "Plug in QRIS-ready providers with webhook retries and idempotency.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <h3 className="font-display text-2xl text-ink">{item.title}</h3>
              <p className="mt-3 text-ink/70">{item.body}</p>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
