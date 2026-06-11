import createClient from "openapi-fetch"
import { useAuth } from "@clerk/chrome-extension"
import type { paths } from "@/types/api"

export function useApiClient() {
  const { getToken } = useAuth()
  const apiClient = createClient<paths>({
    baseUrl: process.env.VITE_API_BASE_URL
  })

  apiClient.use({
    async onRequest({ request }) {
      const token = await getToken()
      if (token) {
        request.headers.set('Authorization', `Bearer ${token}`)
      }
      return request
    }
  })

  return apiClient
}
