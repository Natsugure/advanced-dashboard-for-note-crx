import { Show, useAuth } from '@clerk/chrome-extension'
import { useContext, useEffect, useState } from 'react'
import { MainPage } from './pages/MainPage'
import { InitialSettingsPage } from './pages/InitialSettingsPage'
import { SettingsPage } from './pages/SettingsPage'
import { PageContext } from './contexts/pageContext'
import { UserContext } from './contexts/userContext'
import { useUser } from './hooks/useUsers'
import { ErrorOverlay } from './components/ErrorOverlay'
import { OnboardingPage } from './pages/OnboardingPage'

export function Popup() {
  const [error, setError] = useState<string | undefined>(undefined)
  const { page, setPage } = useContext(PageContext)
  const { setUser } = useContext(UserContext)
  const { isLoaded, isSignedIn } = useAuth()
  const { fetchUser } = useUser()

  useEffect(() => {
    const setUserContext = async () => {
      if (isLoaded && isSignedIn) {
        try {
          const res = await fetchUser()
          setUser(res)

          if (!res) {
            setPage("initialSettings")
          } else {
            setPage("main")
          }
        } catch(e) {
          console.error(e)
          setError("ユーザー情報の取得に失敗しました")
        }
      }
    }

    void setUserContext()
  }, [isLoaded, isSignedIn, setPage, setUser])

  return (
    <>
      <Show when={"signed-out"}>
        <OnboardingPage />
      </Show>
      <Show when={"signed-in"}>
        {error ? (
          <ErrorOverlay message={error} />
        ) : (
          <>
            {page === "initialSettings" && <InitialSettingsPage />}
            {page === "main" && <MainPage />}
            {page === "settings" && <SettingsPage />}
          </>
        )}
      </Show>
    </>
  )
}
