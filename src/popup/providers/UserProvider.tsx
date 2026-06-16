import { useState } from "react"
import { UserContext } from "../contexts/userContext"
import type { User } from "@/types"

interface Props {
  children: React.ReactNode
}

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </UserContext.Provider>
  )
}
