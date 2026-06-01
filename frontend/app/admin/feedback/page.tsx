"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminNav } from "@/components/admin-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MessageSquare, RefreshCw, Search } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { format } from "date-fns"

type FeedbackItem = {
  _id?: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  subject?: string
  message: string
  createdAt?: string
}

export default function AdminFeedbackPage() {
  const router = useRouter()
  const { isAdmin, loading: authLoading } = useAuth()

  const [items, setItems] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!authLoading) {
      if (!isAdmin) {
        router.push("/admin/login")
        return
      }
      fetchFeedback()
    }
  }, [isAdmin, authLoading, router])

  async function fetchFeedback() {
    try {
      setLoading(true)
      const res = await fetch("/api/feedback")
      const data = await res.json()
      if (!res.ok || !data?.success) throw new Error("Failed to fetch feedback")
      setItems(Array.isArray(data.items) ? data.items : [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const q = search.toLowerCase()
    return items.filter((it) => {
      const name = `${it.firstName || ""} ${it.lastName || ""}`.toLowerCase()
      return (
        name.includes(q) ||
        (it.email || "").toLowerCase().includes(q) ||
        (it.phone || "").toLowerCase().includes(q) ||
        (it.subject || "").toLowerCase().includes(q) ||
        (it.message || "").toLowerCase().includes(q)
      )
    })
  }, [items, search])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminNav />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Feedback</h1>
              <p className="text-muted-foreground">View messages submitted from the contact form</p>
            </div>
            <Button variant="outline" onClick={fetchFeedback} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle>Recent Feedback</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, subject, message"
                    className="pl-10 w-[340px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">From</th>
                      <th className="text-left py-3 px-4 font-semibold">Contact</th>
                      <th className="text-left py-3 px-4 font-semibold">Subject</th>
                      <th className="text-left py-3 px-4 font-semibold">Message</th>
                      <th className="text-left py-3 px-4 font-semibold">Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td className="py-6 px-4 text-center text-muted-foreground" colSpan={5}>
                          Loading...
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td className="py-6 px-4 text-center text-muted-foreground" colSpan={5}>
                          No feedback found
                        </td>
                      </tr>
                    ) : (
                      filtered.map((fb) => (
                        <tr key={(fb as any)._id || `${fb.email}-${fb.createdAt}`} className="border-b border-border hover:bg-muted/50 transition">
                          <td className="py-3 px-4">
                            <div className="font-medium">{fb.firstName} {fb.lastName}</div>
                            <div className="text-xs text-muted-foreground">{String((fb as any)._id || "").toString().slice(-6) ? `#${String((fb as any)._id || "").toString().slice(-6)}` : ""}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                <span>{fb.email}</span>
                              </div>
                              {fb.phone ? (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Phone className="w-4 h-4" />
                                  <span>{fb.phone}</span>
                                </div>
                              ) : null}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{fb.subject || "(No subject)"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 max-w-[420px]">
                            <div className="line-clamp-3 text-muted-foreground">{fb.message}</div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="secondary">
                              {fb.createdAt ? format(new Date(fb.createdAt), "MMM d, yyyy h:mm a") : ""}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}