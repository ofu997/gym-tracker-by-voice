import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { handleGoogleCredential, restoreSession, clearSession } from '../services/auth'
import { evictOldRecords } from '../db'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signInWithGoogle: (credential: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    restoreSession()
      .then((u) => {
        if (u) {
          setUser(u)
          evictOldRecords(u.id)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function signInWithGoogle(credential: string) {
    const u = await handleGoogleCredential(credential)
    setUser(u)
    evictOldRecords(u.id)
  }

  function signOut() {
    clearSession()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
