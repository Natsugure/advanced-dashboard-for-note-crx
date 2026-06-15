import { useState } from "react"
import { PageContext, type Page } from "../contexts/pageContext"

interface Props {
  children: React.ReactNode
}

export function PageProvider({ children }: Props) {
  const [page, setPage] = useState<Page>("main")

  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>
  )
}
