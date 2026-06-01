"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let res: Response | null = null;
      try {
        res = await fetch(`/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch {}
      if (!res || !res.ok) {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
        res = await fetch(`${API_BASE}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Registration failed" }));
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await res.json();

      setSuccess("Registration successful! Redirecting to login...");
      // Always go to login after register (no auto-login)
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: any) {
      console.error("Registration Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="bg-white shadow-lg p-6 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
        {success && (
          <p className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">
            {success}
          </p>
        )}
        {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            autoComplete="new-name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            autoComplete="new-email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </form>
    </main>
  );
}
