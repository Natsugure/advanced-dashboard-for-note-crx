import { useApiClient } from "./useApiClient"

export function useUser() {
  const api = useApiClient()

  const fetchUser = async () => {
    const { data, error } = await api.GET("/api/me/user")
    if (error) {
      throw new Error(error)
    }
    
    return data
  }

  return { fetchUser }
}