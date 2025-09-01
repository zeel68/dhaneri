import { create } from "zustand"
import { persist } from "zustand/middleware"
import { wishlistApi } from "@/lib/api"

interface WishlistItem {
  _id: string
  product_id: string
  name: string
  price: number
  image: string
  slug: string
  inStock: boolean
  added_at: string
}

interface WishlistState {
  items: WishlistItem[]
  loading: boolean
  error: string | null

  fetchWishlist: () => Promise<void>
  addToWishlist: (productId: string) => Promise<boolean>
  removeFromWishlist: (productId: string) => Promise<boolean>
  clearWishlist: () => Promise<boolean>
  isInWishlist: (productId: string) => boolean
  clearError: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,

      fetchWishlist: async () => {
        set({ loading: true, error: null })
        try {
          const response = await wishlistApi.getWishlist()

          if (response.success) {
            set({
              items: response.data.wishlist?.items || [],
              loading: false,
            })
          } else {
            set({
              error: response.error?.message || "Failed to fetch wishlist",
              loading: false,
            })
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch wishlist",
            loading: false,
          })
        }
      },

      addToWishlist: async (productId: string) => {
        set({ loading: true, error: null })
        try {
          const response = await wishlistApi.addToWishlist(productId)

          if (response.success) {
            await get().fetchWishlist()
            return true
          } else {
            set({
              error: response.error?.message || "Failed to add to wishlist",
              loading: false,
            })
            return false
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to add to wishlist",
            loading: false,
          })
          return false
        }
      },

      removeFromWishlist: async (productId: string) => {
        set({ loading: true, error: null })
        try {
          const response = await wishlistApi.removeFromWishlist(productId)

          if (response.success) {
            await get().fetchWishlist()
            return true
          } else {
            set({
              error: response.error?.message || "Failed to remove from wishlist",
              loading: false,
            })
            return false
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to remove from wishlist",
            loading: false,
          })
          return false
        }
      },

      clearWishlist: async () => {
        set({ loading: true, error: null })
        try {
          const response = await wishlistApi.clearWishlist()

          if (response.success) {
            set({
              items: [],
              loading: false,
            })
            return true
          } else {
            set({
              error: response.error?.message || "Failed to clear wishlist",
              loading: false,
            })
            return false
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to clear wishlist",
            loading: false,
          })
          return false
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.product_id === productId)
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "wishlist-store",
      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
)
