"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Trash2, ArrowLeft, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useWishlistStore } from "@/store/wishlistStore"
import { useCartStore } from "@/store/cartStore"
import { useAuthStore } from "@/store/authStore"

export default function WishlistPage() {
  const router = useRouter()
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const { items, loading, error, fetchWishlist, removeFromWishlist, clearWishlist, clearError } = useWishlistStore()

  const { addToCart, loading: cartLoading } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    fetchWishlist()
  }, [isAuthenticated, fetchWishlist, router])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  const handleRemoveItem = async (productId: string) => {
    await removeFromWishlist(productId)
    setSelectedItems((prev) => prev.filter((id) => id !== productId))
  }

  const handleAddToCart = async (productId: string) => {
    const success = await addToCart(productId, 1)
    if (success) {
      // Optionally remove from wishlist after adding to cart
      await removeFromWishlist(productId)
    }
  }

  const handleClearWishlist = async () => {
    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
      await clearWishlist()
      setSelectedItems([])
    }
  }

  const handleSelectItem = (productId: string) => {
    setSelectedItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((item) => item.product_id))
    }
  }

  const handleAddSelectedToCart = async () => {
    for (const productId of selectedItems) {
      await addToCart(productId, 1)
      await removeFromWishlist(productId)
    }
    setSelectedItems([])
  }

  const handleRemoveSelected = async () => {
    if (window.confirm(`Remove ${selectedItems.length} items from wishlist?`)) {
      for (const productId of selectedItems) {
        await removeFromWishlist(productId)
      }
      setSelectedItems([])
    }
  }

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save items you love by clicking the heart icon. They'll appear here for easy access later.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white px-8 py-3"
              >
                Start Shopping
              </Button>
              <div className="text-sm text-gray-500">
                <Link href="/cart" className="text-amber-700 hover:text-amber-800 font-medium">
                  Check your cart
                </Link>{" "}
                for items ready to purchase
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()} className="text-gray-600 hover:text-gray-900 p-0">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600">{items.length} items saved</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {selectedItems.length > 0 && (
              <>
                <Button
                  onClick={handleAddSelectedToCart}
                  disabled={cartLoading}
                  className="bg-amber-700 hover:bg-amber-800 text-white"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add Selected to Cart ({selectedItems.length})
                </Button>
                <Button
                  onClick={handleRemoveSelected}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Selected
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={handleClearWishlist}
              className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              disabled={loading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Bulk Actions */}
        {items.length > 0 && (
          <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.length === items.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm font-medium">
                  {selectedItems.length === items.length ? "Deselect All" : "Select All"}
                </span>
              </label>
              {selectedItems.length > 0 && (
                <span className="text-sm text-gray-600">{selectedItems.length} items selected</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                <option>Recently Added</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Name A-Z</option>
              </select>
            </div>
          </div>
        )}

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card key={item._id} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg?height=300&width=300"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.product_id)}
                        onChange={() => handleSelectItem(item.product_id)}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 bg-white/80"
                      />
                    </label>
                  </div>

                  {/* Stock Status */}
                  <div className="absolute top-2 right-2">
                    <Badge
                      className={`${
                        item.inStock ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                      } text-white text-xs`}
                    >
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleAddToCart(item.product_id)}
                        disabled={!item.inStock || cartLoading}
                        size="sm"
                        className="bg-white text-gray-900 hover:bg-gray-100"
                      >
                        <ShoppingBag className="w-4 h-4 mr-1" />
                        Add to Cart
                      </Button>

                      <Link href={`/product/${item.slug}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white border-white text-gray-900 hover:bg-gray-100"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-amber-700 transition-colors">
                        {item.name}
                      </h3>
                    </Link>

                    <button
                      onClick={() => handleRemoveItem(item.product_id)}
                      className="text-red-500 hover:text-red-700 p-1 ml-2"
                      title="Remove from wishlist"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleAddToCart(item.product_id)}
                      disabled={!item.inStock || cartLoading}
                      className="flex-1 bg-amber-700 hover:bg-amber-800 text-white"
                      size="sm"
                    >
                      <ShoppingBag className="w-4 h-4 mr-1" />
                      {cartLoading ? "Adding..." : "Add to Cart"}
                    </Button>

                    <Button
                      onClick={() => handleRemoveItem(item.product_id)}
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recently Viewed or Recommendations */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You might also like</h2>
            <p className="text-gray-600">Based on items in your wishlist</p>
          </div>

          <div className="text-center">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
            >
              Explore More Products
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
