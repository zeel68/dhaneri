"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowLeft, Truck, Shield, RotateCcw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cartStore"
import { useUserStore } from "@/store/userStore"
import { motion } from "framer-motion"

export default function CartPage() {
  const router = useRouter()
  const [couponCode, setCouponCode] = useState("")
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const {
    items,
    coupon,
    subtotal,
    shipping_fee,
    discount,
    total,
    loading,
    error,
    fetchCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    calculateTotals,
    clearError,
  } = useCartStore()

  const { user } = useUserStore()

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  const handleQuantityChange = async (itemId: string, newQuantity: number, variant_id: string, size_id: string) => {
    if (newQuantity < 1) return
    await updateCartItem(itemId, newQuantity, variant_id, size_id)
  }

  const handleRemoveItem = async (itemId: string, variant_id: string) => {
    await removeFromCart(itemId, variant_id)
  }

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart()
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    setIsApplyingCoupon(true)
    const success = await applyCoupon(couponCode.trim())
    if (success) {
      setCouponCode("")
    }
    setIsApplyingCoupon(false)
  }

  const handleRemoveCoupon = async () => {
    await removeCoupon()
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <motion.div
              className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ShoppingBag className="w-12 h-12 text-red-500" />
            </motion.div>
            <motion.h1
              className="text-3xl font-bold text-slate-800 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Your cart is empty
            </motion.h1>
            <motion.p
              className="text-slate-600 mb-8 max-w-md mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </motion.p>
            <motion.div
              className="space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button
                onClick={() => router.push("/")}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full"
              >
                Continue Shopping
              </Button>
              <div className="text-sm text-slate-500">
                <Link href="/wishlist" className="text-red-600 hover:text-red-700 font-medium">
                  Check your wishlist
                </Link>{" "}
                for saved items
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {/* <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-slate-600 hover:text-slate-900 p-0 flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          </div> */}
          <h1 className="text-2xl font-bold text-slate-800">Shopping Cart</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">{items.length} items</span>
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              disabled={loading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700 flex justify-between items-center">
                <span>{error}</span>
                <button onClick={clearError}>
                  <X className="w-4 h-4" />
                </button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl overflow-hidden border-slate-100 shadow-sm">
              <CardHeader className="bg-slate-50">
                <CardTitle className="text-xl font-semibold text-slate-800">Cart Items</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {items.map((item, index) => {
                  const imageSrc = item.variant_id?.images?.[0] || item.product_id.images[0] || "/placeholder.svg";

                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={imageSrc}
                            alt={item.product_id?.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800 mb-1 line-clamp-2">{item.product_id?.name}</h3>

                          {/* Variant and Size Info */}
                          <div className="text-sm text-slate-600 mb-2">
                            {item.variant_id && (
                              <span className="mr-4">Color: {item.variant_id.color}</span>
                            )}
                            {item.size_id && (
                              <span>Size: {item.size_id.size}</span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-2 border border-slate-200 rounded-lg p-1">
                                <button
                                  onClick={() => handleQuantityChange(item.product_id._id, item.quantity - 1, item.variant_id._id, item.size_id?._id)}
                                  disabled={item.quantity <= 1 || loading}
                                  className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-50 text-slate-600"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-3 py-1 min-w-[50px] text-center text-slate-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.product_id._id, item.quantity + 1, item.variant_id._id, item.size_id?._id)}
                                  disabled={loading}
                                  className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-50 text-slate-600"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => handleRemoveItem(item.product_id._id, item.variant_id._id)}
                                disabled={loading}
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="font-semibold text-slate-900">
                                ₹{(item.price_at_addition * item.quantity).toLocaleString()}
                              </div>
                              <div className="text-sm text-slate-600">₹{item.price_at_addition} each</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < items.length - 1 && <Separator className="my-4" />}
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Coupon Section */}
            <Card className="rounded-2xl overflow-hidden border-slate-100 shadow-sm">
              <CardHeader className="bg-slate-50">
                <CardTitle className="text-lg font-semibold flex items-center text-slate-800">
                  <Tag className="w-5 h-5 mr-2 text-red-600" />
                  Apply Coupon
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {coupon ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-green-500 hover:bg-green-600 text-white">{coupon.code}</Badge>
                      <span className="text-green-700 font-medium">
                        {coupon.type === "percentage" ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={handleRemoveCoupon}
                      className="text-green-700 hover:text-green-800 p-0"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || isApplyingCoupon}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isApplyingCoupon ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="rounded-2xl overflow-hidden border-slate-100 shadow-sm sticky top-4">
              <CardHeader className="bg-slate-50">
                <CardTitle className="text-xl font-semibold text-slate-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal ({items.length} items)</span>
                    <span className="font-medium">₹{subtotal || 0}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}

                  {shipping_fee > 0 ? (
                    <div className="flex justify-between">
                      <span>Shipping Fee</span>
                      <span>+₹{shipping_fee}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Shipping</span>
                      <span className="font-medium text-green-600">FREE</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold text-slate-800">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full"
                  disabled={loading}
                >
                  Proceed to Checkout
                </Button>

                <div className="text-center">
                  <Link href="/" className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Continue Shopping
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="rounded-2xl overflow-hidden border-slate-100 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-800">Free Delivery</div>
                      <div className="text-xs text-slate-600">On orders over ₹999</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-800">Secure Payment</div>
                      <div className="text-xs text-slate-600">100% protected checkout</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <RotateCcw className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-800">Easy Returns</div>
                      <div className="text-xs text-slate-600">30-day return policy</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}