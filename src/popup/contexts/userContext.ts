import { createContext } from "react"
import type { User } from "@/types"

interface Context {
  user: User | undefined
  setUser: (user: User | undefined) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export const UserContext = createContext<Context>({
  user: undefined,
  setUser: () => {},
  isLoading: true,
  setIsLoading: () => {}
})
