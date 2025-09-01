"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useOrderStore } from "@/store/orderStore"
import { useAuthStore } from "@/store/authStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Package, Truck, CheckCircle, Clock, ArrowLeft, MapPin, CreditCard, Phone, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function OrderDetailsPage() {
  const params = useParams()
  const orderId = params.id as string
  const { user } = useAuthStore()
  const { orders, loading, fetchOrderById } = useOrderStore()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (user && orderId) {
      const existingOrder = orders.find((o) => o.id === orderId)
      if (existingOrder) {
        setOrder(existingOrder)
      } else {
        fetchOrderById(orderId).then(setOrder)
      }
    }
  }, [user, orderId, orders, fetchOrderById])

  const getStatusProgress = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return 25
      case "processing":
        return 50
      case "shipped":
        return 75
      case "delivered":
        return 100
      default:
        return 0
    }
  }

  const getStatusIcon = (status: string, isActive: boolean) => {
    const iconClass = `h-5 w-5 ${isActive ? "text-amber-600" : "text-gray-400"}`
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className={iconClass} />
      case "processing":
        return <Package className={iconClass} />
      case "shipped":
        return <Truck className={iconClass} />
      case "delivered":
        return <CheckCircle className={iconClass} />
      default:
        return <Clock className={iconClass} />
    }
  }

  const orderStatuses = [
    { key: "pending", label: "Order Placed" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
  ]

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view order details.</p>
          <Link href="/login">
            <Button className="bg-amber-600 hover:bg-amber-700">Login to View Order</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/orders">
          <Button variant="ghost" className="mb-4 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
            <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <Badge className="bg-amber-100 text-amber-800 text-lg px-4 py-2">{order.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Progress value={getStatusProgress(order.status)} className="h-2" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {orderStatuses.map((status, index) => {
                  const isActive = getStatusProgress(order.status) >= (index + 1) * 25
                  return (
                    <div key={status.key} className="text-center">
                      <div className={`mx-auto mb-2 p-2 rounded-full ${isActive ? "bg-amber-100" : "bg-gray-100"}`}>
                        {getStatusIcon(status.key, isActive)}
                      </div>
                      <p className={`text-sm ${isActive ? "text-amber-600 font-medium" : "text-gray-500"}`}>
                        {status.label}
                      </p>
                    </div>
                  )
                })}
              </div>
              {order.trackingNumber && (
                <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2">Tracking Information</h4>
                  <p className="text-amber-700">Tracking Number: {order.trackingNumber}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 border rounded-lg">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg?height=64&width=64"}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      {item.variant && <p className="text-sm text-gray-600">Variant: {item.variant}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="flex items-center gap-1 mt-2">
                    <Phone className="h-3 w-3" />
                    {order.shippingAddress.phone}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="font-medium">{order.paymentMethod.type}</p>
                {order.paymentMethod.last4 && <p>**** **** **** {order.paymentMethod.last4}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Have questions about your order? Contact our support team.</p>
              <Button variant="outline" className="w-full flex items-center gap-2 bg-transparent">
                <Mail className="h-4 w-4" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
