"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, RefreshCw, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

interface OrdersTableProps {
  limit?: number
}

export function OrdersTable({ limit = 10 }: OrdersTableProps) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [limit])

  async function fetchOrders() {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/orders")
      const data = await response.json()

      if (data.success) {
        setOrders(data.orders.slice(0, limit))
        console.log(`[v0] Loaded ${data.orders.length} orders from database`)
      }
    } catch (error) {
      console.error("[v0] Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      processing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      shipped: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        console.log(`[v0] Updated order ${orderId} to ${newStatus}`)
        fetchOrders() // Refresh the list
      }
    } catch (error) {
      console.error("[v0] Error updating order:", error)
    }
  }

  const filtered = orders
    .filter((o) => {
      const s = search.trim().toLowerCase()
      if (!s) return true
      return (
        (o.orderId || "").toLowerCase().includes(s) ||
        (o.customerInfo?.email || "").toLowerCase().includes(s) ||
        (o.customerInfo?.name || "").toLowerCase().includes(s)
      )
    })
    .filter((o) => (status ? (o.status || "").toLowerCase() === status : true))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No orders found</p>
        <p className="text-xs text-muted-foreground mt-2">Orders will appear here once customers place them</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            placeholder="Search by ID, name, or email"
            className="pl-9 w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={status || undefined} onValueChange={(v) => setStatus(v || null)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => fetchOrders()} className="gap-1">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold">Name</th>
            <th className="text-left py-3 px-4 font-semibold">Email</th>
            <th className="text-left py-3 px-4 font-semibold">Phone</th>
            <th className="text-left py-3 px-4 font-semibold">Amount</th>
            <th className="text-left py-3 px-4 font-semibold">Status</th>
            <th className="text-left py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((order, idx) => {
            const name = order.customerInfo?.name || order.name || "";
            const email = order.customerInfo?.email || order.email || "";
            const phone = order.customerInfo?.phone || order.phone || "";
            const amount = order.total ?? order.amount;
            const id = order.orderId || order._id || `${email}-${idx}`;

            return (
              <tr key={id} className="border-b border-border hover:bg-muted/50 transition">
                <td className="py-3 px-4 font-medium">{name}</td>
                <td className="py-3 px-4 text-muted-foreground">{email}</td>
                <td className="py-3 px-4 text-muted-foreground">{phone}</td>
                <td className="py-3 px-4 font-semibold">{amount ? `₹${Number(amount).toLocaleString()}` : "—"}</td>
                <td className="py-3 px-4">
                  <Badge className={getStatusColor(order.status)}>
                    {(order.status || "pending").toString().charAt(0).toUpperCase() + (order.status || "pending").toString().slice(1)}
                  </Badge>
                </td>
                <td className="py-3 px-4 flex gap-2">
                  {order.orderId && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1"
                      onClick={() => window.open(`/order-confirmation?orderId=${order.orderId}`, "_blank")}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  )}
                  <Select onValueChange={(v) => updateOrderStatus(order.orderId || order._id, v)}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
    </div>
  )
}

const Package = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
)
