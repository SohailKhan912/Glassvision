export interface Order {
  orderId: string
  items: any[]
  subtotal: number
  gst: number
  shipping: number
  total: number
  customerInfo: { name: string; email: string; phone?: string }
  razorpayOrderId?: string
  shippingAddress?: any
  status: string
  createdAt: Date
  updatedAt: Date
}