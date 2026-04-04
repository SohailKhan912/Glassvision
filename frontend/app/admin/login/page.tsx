"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
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

      console.log("📥 Admin login response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Login failed" }));
        console.error("❌ Admin login error:", errorData);
        setError(errorData.message || "Login failed");
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("✅ Admin login response:", data);

      if (data?.token && data?.user) {
        // Check if user is admin
        if (data.user.role !== "admin") {
          console.error("❌ Access denied - not admin:", data.user.role);
          setError("Access denied. Admin credentials required.");
          setLoading(false);
          return;
        }

        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("admin", JSON.stringify(data.user));
        // Keep main auth state in sync so providers and nav see updates immediately
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        try { window.dispatchEvent(new Event("auth-changed")); } catch {}
        console.log("💾 Admin token saved to localStorage");
        router.push("/admin/dashboard");
      } else {
        console.error("❌ Invalid response format:", data);
        setError("Login failed - invalid response");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("❌ Admin login error:", err);
      setError(err.message || "Network error. Please check if backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        autoComplete="off"
        className="bg-white shadow-md rounded-lg p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">GlassVision Admin</h2>

        {error && (
          <div className="text-red-500 bg-red-100 border border-red-300 p-2 mb-3 rounded">
            {error}
          </div>
        )}

        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2 w-full"
            autoComplete="new-email"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2 w-full"
            autoComplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded w-full hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
