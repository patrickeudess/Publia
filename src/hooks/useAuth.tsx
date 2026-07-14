import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { demoStore } from '../lib/demo'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { AppUser } from '../types'

type AuthContextValue = {
  user: AppUser | null
  loading: boolean
  demoMode: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (fullName: string, email: string, password: string) => Promise<{ needsConfirmation: boolean }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)
const mapUser = (user: User): AppUser => ({ id: user.id, email: user.email ?? '', fullName: String(user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Utilisateur') })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) { setUser(demoStore.getSession()); setLoading(false); return }
    supabase.auth.getUser().then(({ data }) => { setUser(data.user ? mapUser(data.user) : null); setLoading(false) })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ? mapUser(session.user) : null))
    return () => data.subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user, loading, demoMode: !isSupabaseConfigured,
    async signIn(email, password) {
      if (!supabase) { setUser(demoStore.signIn()); return }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setUser(data.user ? mapUser(data.user) : null)
    },
    async signUp(fullName, email, password) {
      if (!supabase) { setUser(demoStore.signIn()); return { needsConfirmation: false } }
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/dashboard` } })
      if (error) throw error
      if (data.session && data.user) setUser(mapUser(data.user))
      return { needsConfirmation: !data.session }
    },
    async signOut() { if (supabase) await supabase.auth.signOut(); else demoStore.signOut(); setUser(null) },
    async resetPassword(email) {
      if (!supabase) return
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe` })
      if (error) throw error
    },
    async updatePassword(password) {
      if (!supabase) return
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
    }
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return context
}