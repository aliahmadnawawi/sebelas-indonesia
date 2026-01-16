import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-6">
      <div className="max-w-md text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-clay">404</p>
        <h1 className="mt-4 font-display text-4xl text-ink">Store not found</h1>
        <p className="mt-3 text-ink/70">
          The store you are looking for doesn&apos;t exist or has moved.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button>Back to home</Button>
        </Link>
      </div>
    </main>
  );
}
