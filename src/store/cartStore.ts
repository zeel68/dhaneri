import { create } from "zustand"
import { persist } from "zustand/middleware"

import { STORE_ID } from "@/data/Consts"
import ApiClient from "@/utils/apiCalling"
import { useUserStore } from "./userStore"

interface CartItem {
  _id: string
  product_id:
  | any
  | {
    _id: string
    name: string
    images: string[]
    price: number
    discount_price?: number
    slug: string
  }
  name: string
  price: number
  quantity: number
  image: string
  variant?: {
    size?: string
    color?: string
    [key: string]: any
  }
  price_at_addition: number
}

interface Coupon {
  _id: string
  code: string
  description: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  discount_amount: number
}

interface CartState {
  cart_id: string;
  items: CartItem[]
  coupon: Coupon | null
  subtotal: number
  shipping_fee: number
  discount: number
  total: number
  loading: boolean
  error: string | null
}

interface CartActions {
  fetchCart: () => Promise<void>
  addToCart: (productId: string, quantity?: number, variantId?: any, sizeId?: any) => Promise<boolean>
  updateCartItem: (productId: string, quantity: number, variantId?: string, sizeId?: any) => Promise<boolean>
  removeFromCart: (productId: string, variantId?: string) => Promise<boolean>
  clearCart: () => Promise<boolean>
  applyCoupon: (code: string) => Promise<boolean>
  removeCoupon: () => Promise<boolean>
  calculateTotals: () => void
  clearError: () => void
}

const initialState: CartState = {
  items: [],
  coupon: null,
  subtotal: 0,
  discount: 0,
  total: 0,
  shipping_fee: 0,
  cart_id: "",
  loading: false,
  error: null,
}


export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchCart: async () => {
        set({ loading: true, error: null })// ✅ Called inside the action

        try {
          let accessToken = localStorage.getItem("authToken");
          let session_id = localStorage.getItem("sessionId")
          const apiClient = new ApiClient({
            headers: {
              // Authorization: `Bearer ${accessToken}`,
              'x-session-id': session_id
            },
          });

          const res = await apiClient.get(`storefront/store/${STORE_ID}/cart`) as any;
          console.log(res);

          if (res.success) {
            const cart = res.data.data.cart


            set({
              cart_id: cart._id,
              items: cart.items || [],
              coupon: cart.coupon_id,
              subtotal: cart.subtotal,
              shipping_fee: cart.shipping_fee,
              discount: cart.discount_amount,
              total: cart.total,

              loading: false,
            })

          } else {
            set({
              error: res.error?.message || "Failed to fetch cart",
              loading: false,
            })
          }
        } catch (error: any) {
          set({ error: error.message, loading: false })
        }
      },

      addToCart: async (productId, quantity = 1, variantId: any, sizeId: any) => {
        set({ loading: true, error: null })
        try {
          // const { authToken, sessionId } = useUserStore(); // ✅ Called inside the action
          let accessToken = localStorage.getItem("authToken");
          let session_id = localStorage.getItem("sessionId")
          const apiClient = new ApiClient({
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'x-session-id': session_id
            },
          });
          // STORE_ID, productId, quantity, variant?.id
          const res = await apiClient.post(`/storefront/store/${STORE_ID}/cart/add`, { product_id: productId, quantity, variant_id: variantId, size_id: sizeId })
          console.log(res);

          if (res.success) {
            await get().fetchCart()
            console.log(res);

            return true
          }
          set({ error: res.error?.message || "Failed to add to cart", loading: false })
          return false
        } catch (error: any) {
          set({ error: error.message, loading: false })
          return false
        }
      },

      updateCartItem: async (productId, quantity, variantId, sizeId) => {
        set({ loading: true, error: null })
        try {
          let accessToken = localStorage.getItem("authToken");
          let session_id = localStorage.getItem("sessionId")
          const apiClient = new ApiClient({
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'x-session-id': session_id
            },
          });
          const res = await apiClient.put(`/storefront/store/${STORE_ID}/cart/update`, { product_id: productId, quantity, variant_id: variantId, size_id: sizeId })
          console.log(res);

          if (res.success) {
            await get().fetchCart()
            return true
          }
          set({ error: res.error?.message || "Failed to update cart", loading: false })
          return false
        } catch (error: any) {
          set({ error: error.message, loading: false })
          return false
        }
      },

      removeFromCart: async (productId, variantId) => {
        set({ loading: true, error: null })
        try {
          let accessToken = localStorage.getItem("authToken");
          let session_id = localStorage.getItem("sessionId")
          const apiClient = new ApiClient({
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'x-session-id': session_id
            },
          });
          const res = await apiClient.delete(`/storefront/store/${STORE_ID}/cart/remove`, { product_id: productId, variant_id: variantId })
          // const res = await cartApi.removeCartItem(STORE_ID, productId, variantId)
          console.log(res);

          if (res.success) {
            await get().fetchCart()
            return true
          }
          set({ error: res.error?.message || "Failed to remove from cart", loading: false })
          return false
        } catch (error: any) {
          set({ error: error.message, loading: false })
          return false
        }
      },

      clearCart: async () => {
        set({ loading: true, error: null })
        try {
          let accessToken = localStorage.getItem("authToken");
          let session_id = localStorage.getItem("sessionId")
          const apiClient = new ApiClient({
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'x-session-id': session_id
            },
          });
          const res = await apiClient.delete(`/storefront/store/${STORE_ID}/cart/clear`)
          // const res = await cartApi.clearCart(STORE_ID)
          if (res.success) {
            set({ ...initialState, loading: false })
            return true
          }
          set({ error: res.error?.message || "Failed to clear cart", loading: false })
          return false
        } catch (error: any) {
          set({ error: error.message, loading: false })
          return false
        }
      },

      applyCoupon: async (code) => {
        set({ loading: true, error: null })
        try {
          const sessionId = localStorage.getItem("sessionId");
          console.log(variantId, sizeId);

          const apiClient = new ApiClient({
            headers: {
              'x-session-id': "8d558caa-2279-4b9d-8634-1760c1b1abd1"
            },
          });
          const res = await apiClient.post("//storefront/store/${STORE_ID}/cart/$", { cart_id: (get().cart_id), coupon_code: code })
          if (res.success) {
            await get().fetchCart()
            return true
          }
          set({ error: res.error?.message || "Invalid coupon code", loading: false })
          return false
        } catch (error: any) {
          set({ error: error.message, loading: false })
          return false
        }
      },

      removeCoupon: async () => {
        set({ loading: true, error: null })
        try {
          const res = await cartApi.removeCoupon(STORE_ID)
          if (res.success) {
            await get().fetchCart()
            return true
          }
          set({ error: res.error?.message || "Failed to remove coupon", loading: false })
          return false
        } catch (error: any) {
          set({ error: error.message, loading: false })
          return false
        }
      },

      calculateTotals: () => {
        const state = get()
        const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

        let discount = 0
        if (state.coupon) {
          if (state.coupon.discount_type === "percentage") {
            discount = (subtotal * state.coupon.discount_value) / 100
          } else {
            discount = state.coupon.discount_value
          }
        }

        set({
          subtotal,
          discount,
          total: Math.max(0, subtotal - discount),
        })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "cart-store",
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        subtotal: state.subtotal,
        discount: state.discount,
        total: state.total,
      }),
    },
  ),
)
