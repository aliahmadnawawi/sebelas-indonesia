"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiFetch, setToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.accessToken);
      router.replace("/tenants");
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-ash px-6">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="font-display text-3xl text-noir">Admin Login</h1>
        <input
          className="w-full rounded-xl border border-noir/10 bg-white px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-noir/10 bg-white px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-signal">{error}</p>}
        <Button onClick={handleLogin}>Login</Button>
      </Card>
    </main>
  );
}
