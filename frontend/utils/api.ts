// utils/api.ts

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

async function apiRequest(path: string, opts: RequestInit = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    credentials: "include", // ✅ send cookies/JWT
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    console.error("Invalid JSON from server:", text);
  }

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  }

  return data;
}

export const authAPI = {
  // ✅ Fixed user login endpoint
  async login(email: string, password: string) {
    return apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  // ✅ Optional: user registration
  async register(name: string, email: string, password: string) {
    return apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  // ✅ Get current user
  async getMe(token?: string | null) {
    // If token is provided, use it directly. Otherwise try to get from localStorage
    let authToken = token;
    if (!authToken && typeof window !== "undefined") {
      authToken = localStorage.getItem("token");
    }
    
    if (!authToken) {
      throw new Error("No authentication token available");
    }
    
    return apiRequest("/api/auth/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${authToken}`,
      },
    });
  },

  async getOrders() {
    return apiRequest("/api/admin/orders", { method: "GET" })
  },
};

