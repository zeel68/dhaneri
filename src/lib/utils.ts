import { STORE_ID } from "@/data/Consts";
import ApiClient from "@/utils/apiCalling";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const startSession = async () => {
  console.log("Starting the session");

  const apiClient = new ApiClient();
  const res = await apiClient.post(`storefront/store/${STORE_ID}}/session`, {})
  if (!res.success) {
    return res.error
  }
}