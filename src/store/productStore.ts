import { create } from "zustand"
import { persist } from "zustand/middleware"
import ApiClient from "@/lib/apiCalling"
import { STORE_ID } from "@/data/Consts"

interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  subcategory?: string
  inStock: boolean
  stockQuantity: number
  variants?: any[]
  reviews?: any[]
  rating?: number
  tags?: string[]
}

interface ProductFilters {
  category?: string
  priceRange?: [number, number]
  inStock?: boolean
  rating?: number
  tags?: string[]
}

interface ProductState {
  products: Product[]
  featuredProducts: Product[]
  newArrivals: Product[]
  currentProduct: Product | null
  filters: ProductFilters
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }

  fetchProducts: (page?: number, filters?: ProductFilters) => Promise<void>
  fetchFeaturedProducts: () => Promise<void>
  fetchNewArrivals: () => Promise<void>
  fetchProductBySlug: (slug: string) => Promise<void>
  searchProducts: (query: string) => Promise<void>
  setFilters: (filters: ProductFilters) => void
  clearError: () => void
}

const apiClient = new ApiClient()

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      featuredProducts: [],
      newArrivals: [],
      currentProduct: null,
      filters: {},
      loading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
      },

      fetchProducts: async (page = 1, filters = {}) => {
        set({ loading: true, error: null })
        try {
          const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: get().pagination.limit.toString(),
            ...Object.entries(filters).reduce(
              (acc, [key, value]) => {
                if (value !== undefined && value !== null) {
                  acc[key] = value.toString()
                }
                return acc
              },
              {} as Record<string, string>,
            ),
          })

          const response = (await apiClient.get(`/storefront/store/${STORE_ID}/products?${queryParams}`)) as any

          if (response.success) {
            const { products, pagination } = response.data
            set({
              products: products || [],
              pagination: pagination || get().pagination,
              loading: false,
            })
          } else {
            set({
              error: response.error?.message || "Failed to fetch products",
              loading: false,
            })
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch products",
            loading: false,
          })
        }
      },

      fetchFeaturedProducts: async () => {
        set({ loading: true, error: null })
        try {
          const response = (await apiClient.get(`/storefront/store/${STORE_ID}/products/featured`)) as any

          if (response.success) {
            set({
              featuredProducts: response.data || [],
              loading: false,
            })
          } else {
            set({
              error: response.error?.message || "Failed to fetch featured products",
              loading: false,
            })
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch featured products",
            loading: false,
          })
        }
      },

      fetchNewArrivals: async () => {
        set({ loading: true, error: null })
        try {
          const response = (await apiClient.get(`/storefront/store/${STORE_ID}/products/new-arrivals`)) as any

          if (response.success) {
            set({
              newArrivals: response.data || [],
              loading: false,
            })
          } else {
            set({
              error: response.error?.message || "Failed to fetch new arrivals",
              loading: false,
            })
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch new arrivals",
            loading: false,
          })
        }
      },

      fetchProductBySlug: async (slug: string) => {
        set({ loading: true, error: null })
        try {
          const response = (await apiClient.get(`/storefront/store/${STORE_ID}/products/${slug}`)) as any

          if (response.success) {
            set({
              currentProduct: response.data,
              loading: false,
            })
          } else {
            set({
              error: response.error?.message || "Product not found",
              loading: false,
            })
          }
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch product",
            loading: false,
          })
        }
      },

      searchProducts: async (query: string) => {
        set({ loading: true, error: null })
        try {
          const response = (await apiClient.get(
            `/storefront/store/${STORE_ID}/products/search?q=${encodeURIComponent(query)}`,
          )) as any

          if (response.success) {
            set({
              products: response.data.products || [],
              pagination: response.data.pagination || get().pagination,
              loading: false,
            })
          } else {
            set({
              error: response.error?.message || "Search failed",
              loading: false,
            })
          }
        } catch (error: any) {
          set({
            error: error.message || "Search failed",
            loading: false,
          })
        }
      },

      setFilters: (filters: ProductFilters) => {
        set({ filters })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "product-store",
      partialize: (state) => ({
        featuredProducts: state.featuredProducts,
        newArrivals: state.newArrivals,
        filters: state.filters,
      }),
    },
  ),
)
