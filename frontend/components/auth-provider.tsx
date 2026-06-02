"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authAPI } from "@/utils/api"

interface User {
  _id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  function loadFromStorage() {
    try {
      if (typeof window === "undefined") return
     const storedToken = localStorage.getItem("adminToken")
const storedUser = localStorage.getItem("admin")
console.log("AUTH DEBUG");
console.log("storedToken =", storedToken);
console.log("storedUser =", storedUser);

if (storedToken && storedUser) {
  setToken(storedToken)
  setUser(JSON.parse(storedUser))
} else {
  setToken(null)
  setUser(null)
}
    } catch (err) {
      console.log("Error reading auth from storage:", err)
    }
  }

  useEffect(() => {
    // Only run on client side, not during build
    if (typeof window === "undefined") {
      setLoading(false)
      return
    }

    try {
      loadFromStorage()
    } finally {
      setLoading(false)
    }

    const onStorage = () => loadFromStorage()
    const onAuthChanged = () => loadFromStorage()
    window.addEventListener("storage", onStorage)
    window.addEventListener("auth-changed", onAuthChanged as any)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("auth-changed", onAuthChanged as any)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password)
    if (typeof window !== "undefined") {
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user || response))
      if ((response.user || response)?.role === "admin") {
        localStorage.setItem("adminToken", response.token)
        localStorage.setItem("admin", JSON.stringify(response.user || response))
      }
      try { window.dispatchEvent(new Event("auth-changed")) } catch {}
    }
    setToken(response.token)
    setUser(response.user || response)
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("adminToken")
      localStorage.removeItem("admin")
      try { window.dispatchEvent(new Event("auth-changed")) } catch {}
    }
    setToken(null)
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

