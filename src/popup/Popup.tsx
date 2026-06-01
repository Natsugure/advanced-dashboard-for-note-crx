import { ClerkProvider, Show, useAuth } from '@clerk/chrome-extension'
import { useState } from 'react'
import { LoginPage } from './LoginPage'
import { MainPage } from './MainPage'
import { SettingsPage } from './SettingsPage'
import { Header } from './components/Header'

type Page = "main" | "settings"

function PopupContent() {
  const [page, setPage] = useState<Page>("main")
  const { isLoaded } = useAuth()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Show when={"signed-out"}>
        <LoginPage />
      </Show>
      <Show when={"signed-in"}>
        <Header />
        {page === "main" && <MainPage />}
        {page === "settings" && <SettingsPage />}
      </Show>
    </>
  )
}

export function Popup() {
  const PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY

  if (!PUBLISHABLE_KEY) {
    throw new Error('Please add the VITE_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env.development file')
  } 

  return (
    <>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <PopupContent />
      </ClerkProvider>
    </>
  )
}
