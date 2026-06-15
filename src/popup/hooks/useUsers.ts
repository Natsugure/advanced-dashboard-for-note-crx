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

  const createUser = async (id: number, nickname: string, urlname: string) => {
    const { data, error } = await api.POST("/api/users", {
      body: {
        noteUserId: id,
        noteNickName: nickname,
        noteUrlName: urlname
      }
    })

    if (error) {
      throw new Error(error)
    }

    return data
  }

  const updateUser = async (lastNoteCalculatedAt: string) => {
    const { data, error } = await api.PUT("/api/me/user", {
      body: {
        lastNoteCalculatedAt
      }
    })

    if (error) {
      throw new Error(error)
    }

    return data
  }

  return { fetchUser, createUser, updateUser }
}