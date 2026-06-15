import { createContext } from "react"
import type { User } from "@/types"

interface Context {
  user: User | undefined
  setUser: (user: User | undefined) => void
}

export const UserContext = createContext<Context>({user: undefined, setUser: () => {}})