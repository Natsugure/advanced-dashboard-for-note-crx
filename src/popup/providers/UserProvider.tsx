import { useState } from "react"
import { UserContext } from "../contexts/userContext"
import type { User } from "@/types"

interface Props {
  children: React.ReactNode
}

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User | undefined>(undefined)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
