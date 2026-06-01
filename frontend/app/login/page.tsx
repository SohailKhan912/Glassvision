"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let response: Response | null = null;
      try {
        response = await fetch(`/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
      } catch {}

      if (!response || !response.ok) {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
        response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        });
      }

      console.log("📥 Login response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Login failed" }));
        console.error("❌ Login error:", errorData);
        setError(errorData.message || "Login failed");
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("✅ Login successful:", data);

      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        try { window.dispatchEvent(new Event("auth-changed")); } catch {}
        console.log("💾 Token saved to localStorage");
        router.push("/");
      } else {
        console.error("❌ Invalid response format:", data);
        setError("Login failed - invalid response");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("❌ Login error:", err);
      setError(err.message || "Network error. Please check if backend is running.");
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        autoComplete="off"
        className="bg-white shadow-lg p-6 rounded-xl w-80 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">User Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            autoComplete="new-email"
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            autoComplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
