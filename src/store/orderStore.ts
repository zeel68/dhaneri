import { create } from "zustand"
import { persist } from "zustand/middleware"
import { orderApi } from "@/lib/api"
import type { Order } from "@/lib/types"

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }

  fetchOrders: (page?: number) => Promise<void>
  fetchOrderDetails: (orderId: string) => Promise<void>
  createOrder: (orderData: any) => Promise<string | null>
  cancelOrder: (orderId: string, reason?: string) => Promise<boolean>
  trackOrder: (orderNumber: string) => Promise<any>
  requestReturn: (orderId: string, data: any) => Promise<boolean>
  clearError: () => void
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,
      loading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },

      fetchOrders: async (page = 1) => {
        set({ loading: true, error: null })
        try {
          const response = await orderApi.getOrders(page, get().pagination.limit)

          if (response.success) {
            set({
              orders: response.data.orders || [],
              pagination: response.data.pagination || get().pagination,
              loading: false,
            })
          } else {
            set({
              error: response.error?.message || "Failed to fetch orders",
              loading: false,
            })
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch orders",
            loading: false,
          })
        }
      },

      fetchOrderDetails: async (orderId: string) => {
        set({ loading: true, error: null })
        try {
          const response = await orderApi.getOrderDetails(orderId)

          if (response.success) {
            set({
              currentOrder: response.data.order,
              loading: false,
            })
          } else {
            set({
              error: response.error?.message || "Failed to fetch order details",
              loading: false,
            })
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch order details",
            loading: false,
          })
        }
      },

      createOrder: async (orderData: any) => {
        set({ loading: true, error: null })
        try {
          const response = await orderApi.createOrder(orderData)

          if (response.success) {
            set({ loading: false })
            // Refresh orders list
            await get().fetchOrders()
            return response.data.order_id
          } else {
            set({
              error: response.error?.message || "Failed to create order",
              loading: false,
            })
            return null
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to create order",
            loading: false,
          })
          return null
        }
      },

      cancelOrder: async (orderId: string, reason?: string) => {
        set({ loading: true, error: null })
        try {
          const response = await orderApi.cancelOrder(orderId, reason)

          if (response.success) {
            set({ loading: false })
            // Refresh orders list
            await get().fetchOrders()
            return true
          } else {
            set({
              error: response.error?.message || "Failed to cancel order",
              loading: false,
            })
            return false
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to cancel order",
            loading: false,
          })
          return false
        }
      },

      trackOrder: async (orderNumber: string) => {
        set({ loading: true, error: null })
        try {
          const response = await orderApi.trackOrder(orderNumber)

          if (response.success) {
            set({ loading: false })
            return response.data
          } else {
            set({
              error: response.error?.message || "Order not found",
              loading: false,
            })
            return null
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to track order",
            loading: false,
          })
          return null
        }
      },

      requestReturn: async (orderId: string, data: any) => {
        set({ loading: true, error: null })
        try {
          const response = await orderApi.requestReturn(orderId, data)

          if (response.success) {
            set({ loading: false })
            // Refresh order details
            await get().fetchOrderDetails(orderId)
            return true
          } else {
            set({
              error: response.error?.message || "Failed to request return",
              loading: false,
            })
            return false
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to request return",
            loading: false,
          })
          return false
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "order-store",
      partialize: (state) => ({
        orders: state.orders,
        pagination: state.pagination,
      }),
    },
  ),
)
