"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, MapPin, Truck, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCartStore } from "@/store/cartStore"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import ApiClient from "@/utils/apiCalling"
import { STORE_ID } from "@/data/Consts"
import { useUserStore } from "@/store/userStore"

// Enhanced validation schema with better error messages
const shippingSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name should only contain letters"),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name should only contain letters"),
  email: z.string()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
  address: z.string()
    .min(10, "Please provide a detailed address")
    .max(200, "Address must be less than 200 characters"),
  city: z.string()
    .min(2, "City name must be at least 2 characters")
    .max(50, "City name must be less than 50 characters"),
  state: z.string()
    .min(2, "State name must be at least 2 characters")
    .max(50, "State name must be less than 50 characters"),
  pincode: z.string()
    .min(6, "Pincode must be exactly 6 digits")
    .max(6, "Pincode must be exactly 6 digits")
    .regex(/^[0-9]{6}$/, "Please enter a valid 6-digit pincode"),
})

type ShippingForm = z.infer<typeof shippingSchema>

// Types for better error handling
interface PaymentError {
  type: 'network' | 'payment' | 'validation' | 'server' | 'user_cancelled'
  message: string
  details?: string
}

interface OrderStatus {
  status: 'idle' | 'creating_order' | 'processing_payment' | 'completed' | 'failed'
  orderId?: string
  error?: PaymentError
}

// Environment configuration
const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_2TD6bdPgMvp803"

export default function CheckoutPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [orderStatus, setOrderStatus] = useState<OrderStatus>({ status: 'idle' })
  const [retryCount, setRetryCount] = useState(0)
  const { items, subtotal, discount, total, fetchCart, clearCart } = useCartStore()
  const { user } = useUserStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch
  } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: user?.phone_number || "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  })

  // Auto-populate user data when available
  useEffect(() => {
    if (user) {
      setValue('email', user.email || '')
      setValue('phone', user.phone_number || '')
      setValue('firstName', user.name?.split(' ')[0] || '')
      setValue('lastName', user.name?.split(' ').slice(1).join(' ') || '')
    }
  }, [user, setValue])

  // Fetch cart if empty
  useEffect(() => {
    if (items.length === 0) {
      fetchCart()
    }
  }, [fetchCart, items.length])

  // Clear error after 10 seconds
  useEffect(() => {
    if (orderStatus.error) {
      const timer = setTimeout(() => {
        setOrderStatus(prev => ({ ...prev, error: undefined }))
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [orderStatus.error])

  const setError = useCallback((error: PaymentError) => {
    setOrderStatus(prev => ({
      ...prev,
      status: 'failed',
      error
    }))
  }, [])

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }, [])

  const createOrder = async (formData: ShippingForm) => {
    try {
      const apiClient = new ApiClient({
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })

      if (!user?.id) {
        throw new Error("Please log in to continue")
      }

      const shipping_address = {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: "India"
      }

      const result = await apiClient.post(`/storefront/store/${STORE_ID}/orders`, {
        shipping_address,
        billing_address: shipping_address, // Use same as shipping
        payment_method: paymentMethod,
        notes: "",
        use_cart: false,
        items,
        customer_info: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        }
      }) as any
      console.log(result);

      if (!result.success) {
        throw new Error(result.data.message || "Failed to create order")
      }

      return result.data
    } catch (error: any) {
      console.error('Order creation failed:', error)
      throw error
    }
  }

  const handlePaymentSuccess = async (response: any, orderId: string, payment_id: string) => {
    try {
      // Verify payment on backend
      const apiClient = new ApiClient({
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })

      const res = await apiClient.post(`/storefront/store/${STORE_ID}/payment/callback`, {
        payment_id: payment_id,
        razorpay_payment_id: response.razorpay_payment_id,
        status: "completed",
        transaction_id: response.razorpay_order_id,
        gateway_response: response.razorpay_signature,
      })
      if (res.success) {
        // Clear cart and redirect
        clearCart()
        setOrderStatus({ status: 'completed', orderId })

        // Small delay for UX
        setTimeout(() => {
          console.log(res);

          // router.push(`/order-confirmation/${orderId}`)
        }, 1500)
      } else {
        console.log(res);

      }

    } catch (error: any) {
      console.error('Payment verification failed:', error)
      setError({
        type: 'server',
        message: 'Payment successful but verification failed',
        details: 'Your payment was processed but we couldn\'t verify it. Please contact support.'
      })
    }
  }

  const handlePaymentFailure = (error: any) => {
    console.error('Payment failed:', error)

    let errorMessage = 'Payment failed. Please try again.'
    let errorType: PaymentError['type'] = 'payment'

    switch (error.code) {
      case 'BAD_REQUEST_ERROR':
        errorMessage = 'Invalid payment request. Please check your details.'
        break
      case 'GATEWAY_ERROR':
        errorMessage = 'Payment gateway error. Please try again.'
        break
      case 'NETWORK_ERROR':
        errorMessage = 'Network error. Please check your connection and try again.'
        errorType = 'network'
        break
      case 'SERVER_ERROR':
        errorMessage = 'Server error. Please try again later.'
        errorType = 'server'
        break
      default:
        if (error.description?.includes('cancelled')) {
          errorMessage = 'Payment was cancelled by user.'
          errorType = 'user_cancelled'
        }
    }

    setError({
      type: errorType,
      message: errorMessage,
      details: error.description
    })
  }

  const processPayment = async (orderData: any, formData: ShippingForm) => {
    try {
      setOrderStatus({ status: 'processing_payment' })

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error("Payment gateway failed to load. Please check your internet connection.")
      }
      const apiClient = new ApiClient({
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })

      const res = await apiClient.post(`/storefront/store/${STORE_ID}/payment/initialize`, {
        order_id: orderData.order.id,
        payment_method: "razorpay",
      })

      console.log(res.data.data.payment_id);

      if (res.success) {
        const options = {
          key: RAZORPAY_KEY,
          amount: orderData.order.total * 100,
          currency: "INR",
          name: "Dhaneri Store",
          description: `Order Data`,
          order_id: orderData.razorpay_order_id,
          handler: (response: any) => handlePaymentSuccess(response, orderData._id, res.data.data.payment_id),
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#dc2626", // red-600
          },
          modal: {
            ondismiss: () => {
              setError({
                type: 'user_cancelled',
                message: 'Payment was cancelled',
                details: 'You closed the payment window. Your order is still pending.'
              })
            }
          },
          retry: {
            enabled: true,
            max_count: 3
          },
          // Enhanced error handling
          error: handlePaymentFailure,
        }

        const paymentObject = new window.Razorpay(options)

        // Handle payment modal errors
        paymentObject.on('payment.failed', handlePaymentFailure)

        paymentObject.open()
      } else {
        throw new Error("Payment error")

      }
    } catch (error: any) {
      console.error('Payment processing failed:', error)
      setError({
        type: 'payment',
        message: error.message || 'Failed to process payment',
        details: 'There was an error setting up the payment. Please try again.'
      })
    }
  }

  const processCODOrder = async (formData: ShippingForm) => {
    try {
      setOrderStatus({ status: 'creating_order' })
      const orderData = await createOrder(formData)
      // await handlePaymentSuccess(orderData)
      // For COD, mark as completed immediately
      clearCart()
      setOrderStatus({ status: 'completed', orderId: orderData._id })

      setTimeout(() => {
        router.push(`/order-confirmation/${orderData._id}`)
      }, 1500)
    } catch (error: any) {
      console.error('COD order failed:', error)
      setError({
        type: 'server',
        message: error.message || 'Failed to place order',
        details: 'There was an error creating your order. Please try again.'
      })
    }
  }

  const onSubmit = async (formData: ShippingForm) => {
    try {
      setOrderStatus({ status: 'creating_order' })
      setRetryCount(0)

      if (paymentMethod === "cod") {
        await processCODOrder(formData)
      } else {
        const orderData = await createOrder(formData)
        console.log(orderData.data);

        await processPayment(orderData.data, formData)
      }
    } catch (error: any) {
      console.error('Order submission failed:', error)
      setError({
        type: 'server',
        message: error.message || 'Failed to process order',
        details: 'Please check your details and try again.'
      })
    }
  }

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1)
      setOrderStatus({ status: 'idle' })
    } else {
      setError({
        type: 'server',
        message: 'Maximum retry attempts reached',
        details: 'Please refresh the page or contact support for assistance.'
      })
    }
  }

  const getStatusIcon = () => {
    switch (orderStatus.status) {
      case 'creating_order':
        return <Clock className="animate-spin h-5 w-5 text-blue-500" />
      case 'processing_payment':
        return <CreditCard className="animate-pulse h-5 w-5 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusMessage = () => {
    switch (orderStatus.status) {
      case 'creating_order':
        return 'Creating your order...'
      case 'processing_payment':
        return 'Processing payment...'
      case 'completed':
        return 'Order placed successfully!'
      case 'failed':
        return orderStatus.error?.message || 'Something went wrong'
      default:
        return null
    }
  }

  // Empty cart check
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-lg rounded-xl">
          <CardHeader className="bg-red-50 rounded-t-xl">
            <CardTitle className="text-center text-red-700 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 mr-2" />
              Empty Cart
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-slate-600">Your cart is empty. Discover our products and add some items to continue.</p>
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-red-600 hover:bg-red-700 rounded-lg py-3"
            >
              Explore Products
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isProcessing = ['creating_order', 'processing_payment'].includes(orderStatus.status)
  const isCompleted = orderStatus.status === 'completed'

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/cart")}
            className="text-slate-700 hover:text-slate-900 font-medium"
            disabled={isProcessing}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return to Cart
          </Button>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <div className="text-sm font-semibold text-slate-600 bg-white px-4 py-2 rounded-full shadow-sm">
              {getStatusMessage() || 'Secure & Fast Checkout'}
            </div>
          </div>
        </div>

        {/* Global Error Alert */}
        {orderStatus.error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold">{orderStatus.error.message}</div>
              {orderStatus.error.details && (
                <div className="text-sm mt-1 text-red-600/80">{orderStatus.error.details}</div>
              )}
              {orderStatus.error.type !== 'user_cancelled' && retryCount < 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-red-300 text-red-600 hover:bg-red-100"
                  onClick={handleRetry}
                >
                  Try Again ({3 - retryCount} attempts left)
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {isCompleted && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="font-semibold">Order placed successfully!</div>
              <div className="text-sm mt-1">Redirecting to order confirmation...</div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content - Form */}
          <div className="lg:col-span-3 space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Shipping Card */}
              <Card className="overflow-hidden shadow-lg rounded-xl border-slate-200">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 py-5 px-6">
                  <CardTitle className="flex items-center text-2xl font-bold text-slate-800">
                    <MapPin className="w-6 h-6 mr-3 text-red-600" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        placeholder="Enter first name"
                        className={`rounded-lg border-slate-300 focus:border-red-500 ${errors.firstName ? 'border-red-300 bg-red-50' : ''
                          }`}
                        disabled={isProcessing}
                      />
                      {errors.firstName && (
                        <Alert variant="destructive" className="mt-1 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{errors.firstName.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-semibold text-slate-700">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        placeholder="Enter last name"
                        className={`rounded-lg border-slate-300 focus:border-red-500 ${errors.lastName ? 'border-red-300 bg-red-50' : ''
                          }`}
                        disabled={isProcessing}
                      />
                      {errors.lastName && (
                        <Alert variant="destructive" className="mt-1 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{errors.lastName.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="Enter email"
                        className={`rounded-lg border-slate-300 focus:border-red-500 ${errors.email ? 'border-red-300 bg-red-50' : ''
                          }`}
                        disabled={isProcessing}
                      />
                      {errors.email && (
                        <Alert variant="destructive" className="mt-1 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{errors.email.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        placeholder="Enter phone number"
                        className={`rounded-lg border-slate-300 focus:border-red-500 ${errors.phone ? 'border-red-300 bg-red-50' : ''
                          }`}
                        disabled={isProcessing}
                      />
                      {errors.phone && (
                        <Alert variant="destructive" className="mt-1 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{errors.phone.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="address" className="text-sm font-semibold text-slate-700">
                        Street Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="address"
                        {...register("address")}
                        placeholder="Enter full address with landmark"
                        className={`rounded-lg border-slate-300 focus:border-red-500 ${errors.address ? 'border-red-300 bg-red-50' : ''
                          }`}
                        disabled={isProcessing}
                      />
                      {errors.address && (
                        <Alert variant="destructive" className="mt-1 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{errors.address.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-semibold text-slate-700">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        {...register("city")}
                        placeholder="Enter city"
                        className={`rounded-lg border-slate-300 focus:border-red-500 ${errors.city ? 'border-red-300 bg-red-50' : ''
                          }`}
                        disabled={isProcessing}
                      />
                      {errors.city && (
                        <Alert variant="destructive" className="mt-1 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{errors.city.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-semibold text-slate-700">
                        State <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="state"
                        {...register("state")}
                        placeholder="Enter state"
                        className={`rounded-lg border-slate-300 focus:border-red-500 ${errors.state ? 'border-red-300 bg-red-50' : ''
                          }`}
                        disabled={isProcessing}
                      />
                      {errors.state && (
                        <Alert variant="destructive" className="mt-1 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{errors.state.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Pincode */}
                    <div className="space-y-2">
                      <Label htmlFor="pincode" className="text-sm font-semibold text-slate-700">
                        Pincode <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="pincode"
                        {...register("pincode")}
                        placeholder="Enter 6-digit pincode"
                        maxLength={6}
                        className={`rounded-lg border-slate-300 focus:border-red-500 ${errors.pincode ? 'border-red-300 bg-red-50' : ''
                          }`}
                        disabled={isProcessing}
                      />
                      {errors.pincode && (
                        <Alert variant="destructive" className="mt-1 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{errors.pincode.message}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Card */}
              <Card className="overflow-hidden shadow-lg rounded-xl border-slate-200">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 py-5 px-6">
                  <CardTitle className="flex items-center text-2xl font-bold text-slate-800">
                    <CreditCard className="w-6 h-6 mr-3 text-red-600" />
                    Payment Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    disabled={isProcessing}
                  >
                    {[
                      {
                        value: "card",
                        label: "Pay Now",
                        description: "Credit/Debit Card, UPI, Net Banking",
                        icon: <CreditCard className="w-5 h-5" />
                      },
                      {
                        value: "cod",
                        label: "Cash on Delivery",
                        description: "Pay when you receive your order",
                        icon: <Truck className="w-5 h-5" />
                      }
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${paymentMethod === option.value
                          ? "border-red-600 bg-red-50 shadow-md"
                          : "border-slate-300 hover:border-red-500 hover:shadow"
                          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <RadioGroupItem
                          value={option.value}
                          className="text-red-600 border-slate-400 mt-1"
                          disabled={isProcessing}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {option.icon}
                            <span className="font-semibold text-slate-700">
                              {option.label}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isProcessing || !isValid || isCompleted}
                className={`w-full font-bold py-6 rounded-lg shadow-lg text-lg transition-all duration-200 ${isCompleted
                  ? 'bg-green-600 hover:bg-green-600'
                  : 'bg-red-600 hover:bg-red-700'
                  } text-white`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {orderStatus.status === 'creating_order' ? 'Creating Order...' : 'Processing Payment...'}
                  </span>
                ) : isCompleted ? (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    Order Placed Successfully!
                  </span>
                ) : (
                  <>
                    {paymentMethod === 'cod' ? 'Place Order' : 'Complete Purchase'} • ₹{total.toLocaleString()}
                    <Truck className="w-5 h-5 ml-3" />
                  </>
                )}
              </Button>

              {/* Form validation summary */}
              {Object.keys(errors).length > 0 && !isProcessing && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please fix the errors above to continue with your order.
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24 overflow-hidden shadow-lg rounded-xl border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 py-5 px-6">
                <CardTitle className="text-2xl font-bold text-slate-800">Your Order</CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white space-y-6">
                {/* Items List */}
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {items.map((item: any) => (
                    <div key={item._id} className="flex items-start space-x-4 p-3 border border-slate-100 rounded-lg">
                      <div className="relative">
                        <img
                          src={item.product_id.images?.[0] || 'https://placehold.co/80x80?text=Product'}
                          alt={item.product_id.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-sm"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/80x80?text=Product'
                          }}
                        />
                        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 line-clamp-2 mb-2">{item.product_id.name}</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-2">
                          {item.variant_id?.color && (
                            <p>Color: {item.variant_id.color}</p>
                          )}
                          {item.size_id?.size && (
                            <p>Size: {item.size_id.size}</p>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-slate-600">₹{item.product_id.price.toLocaleString()} each</p>
                          <p className="font-bold text-slate-900">₹{(item.product_id.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="border-slate-200" />

                {/* Pricing Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount Applied</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Fee</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Taxes</span>
                    <span>Included</span>
                  </div>
                  <Separator className="my-2 border-slate-200" />
                  <div className="flex justify-between font-bold text-lg text-slate-900">
                    <span>Grand Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  {paymentMethod === 'cod' && (
                    <p className="text-xs text-slate-500 mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                      <strong>Cash on Delivery:</strong> Please keep exact change ready. Our delivery partner will collect ₹{total.toLocaleString()} when your order arrives.
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold rounded-lg py-3 transition-all duration-200"
                    onClick={() => router.push("/cart")}
                    disabled={isProcessing}
                  >
                    Modify Cart
                  </Button>

                  {/* Security badges */}
                  <div className="flex items-center justify-center space-x-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>SSL Secured</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Safe Payment</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info Cards */}
            <div className="mt-6 space-y-4">
              {/* Delivery Info */}
              <Card className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Truck className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">Free Delivery</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Expected delivery in 3-5 business days. You'll receive tracking information via email.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Return Policy */}
              <Card className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <ArrowLeft className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">Easy Returns</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        7-day return policy. Items must be unused and in original packaging.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Support */}
              <Card className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">Need Help?</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Contact our support team at support@dhaneri.com or call 1800-XXX-XXXX
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}