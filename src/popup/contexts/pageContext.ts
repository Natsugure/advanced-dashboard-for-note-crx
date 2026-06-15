import { createContext } from "react"

export type Page = "main" | "settings" | "initialSettings"

interface Context {
  page: Page
  setPage: (page: Page) => void
}

export const PageContext = createContext<Context>({page: "main", setPage: () => {}})