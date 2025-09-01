"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, Truck, CreditCard, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useOrderStore } from "@/store/orderStore"
import { useCartStore } from "@/store/cartStore"

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string

  const { currentOrder, loading, error, fetchOrderDetails } = useOrderStore()
  const { clearCart } = useCartStore()

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId)
      // Clear cart after successful order
      clearCart()
    }
  }, [orderId, fetchOrderDetails, clearCart])

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !currentOrder) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The order you're looking for doesn't exist."}</p>
          <Button onClick={() => router.push("/")} className="bg-amber-700 hover:bg-amber-800">
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">Thank you for your purchase. Your order has been successfully placed.</p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <span>Order #{currentOrder.order_number}</span>
            <span>•</span>
            <span>{new Date(currentOrder.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Status</span>
                  <Badge className={getStatusColor(currentOrder.status)}>
                    {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-amber-700" />
                    <span className="text-sm font-medium">Order Placed</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Shipped</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Delivered</span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  {currentOrder.status === "confirmed" && "Your order is being prepared for shipment."}
                  {currentOrder.status === "processing" && "Your order is currently being processed."}
                  {currentOrder.status === "shipped" && "Your order has been shipped and is on its way."}
                  {currentOrder.status === "delivered" && "Your order has been delivered successfully."}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentOrder.items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{currentOrder.shipping_address.full_name}</p>
                  <p>{currentOrder.shipping_address.address_line_1}</p>
                  {currentOrder.shipping_address.address_line_2 && (
                    <p>{currentOrder.shipping_address.address_line_2}</p>
                  )}
                  <p>
                    {currentOrder.shipping_address.city}, {currentOrder.shipping_address.state}{" "}
                    {currentOrder.shipping_address.postal_code}
                  </p>
                  <p>{currentOrder.shipping_address.phone}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{currentOrder.subtotal.toLocaleString()}</span>
                  </div>
                  {currentOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{currentOrder.discount_amount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{currentOrder.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Payment Status</span>
                    <Badge className={getPaymentStatusColor(currentOrder.payment_status)}>
                      {currentOrder.payment_status.charAt(0).toUpperCase() + currentOrder.payment_status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span>Payment Method: Card</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Link href={`/orders/${currentOrder._id}`}>
                  <Button className="w-full bg-amber-700 hover:bg-amber-800">View Order Details</Button>
                </Link>
                <Link href="/orders">
                  <Button
                    variant="outline"
                    className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
                  >
                    View All Orders
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full bg-transparent">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Estimated Delivery */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Estimated delivery: 3-5 business days</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
