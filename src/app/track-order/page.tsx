"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Package } from "lucide-react"
import { useOrderStore } from "@/store/orderStore"

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const [error, setError] = useState("")
  const { trackOrderGuest } = useOrderStore()

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim() || !email.trim()) {
      setError("Please enter both order number and email address")
      return
    }

    setLoading(true)
    setError("")

    try {
      const result = await trackOrderGuest(orderNumber.trim(), email.trim())
      if (result) {
        setOrder(result)
      } else {
        setError("Order not found. Please check your order number and email address.")
      }
    } catch (err) {
      setError("Unable to track order. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Package className="h-16 w-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order details to track your package</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div>
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  type="text"
                  placeholder="Enter your order number"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Tracking Order...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Track Order
                  </>
                )}
              </Button>
            </form>

            {order && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="font-semibold text-green-800 mb-2">Order Found!</h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p>
                    <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Total:</strong> ${order.total.toFixed(2)}
                  </p>
                  {order.trackingNumber && (
                    <p>
                      <strong>Tracking Number:</strong> {order.trackingNumber}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <Button onClick={() => (window.location.href = `/orders/${order.id}`)} variant="outline" size="sm">
                    View Full Details
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Have an account?{" "}
            <a href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
              Sign in
            </a>{" "}
            to view all your orders
          </p>
        </div>
      </div>
    </div>
  )
}
