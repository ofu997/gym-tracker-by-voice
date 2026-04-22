import { useState, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider, useAuth } from './context/AuthContext'
import SignInPage from './components/auth/SignInPage'
import LogWorkout from './components/workout/LogWorkout'
import SessionHistory from './components/history/SessionHistory'
import ExerciseHistory from './components/history/ExerciseHistory'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

type Tab = 'log' | 'sessions' | 'exercises'

const TAB_LABELS: Record<Tab, string> = {
  log: 'Log',
  sessions: 'Sessions',
  exercises: 'Exercises',
}

function AppShell() {
  const { user, loading, signOut } = useAuth()
  const [tab, setTab] = useState<Tab>('log')

  useEffect(() => {
    document.title = `${TAB_LABELS[tab]} — Gym Tracker`
  }, [tab])

  if (loading) return null
  if (!user) return <SignInPage />

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid #eee' }}>
        <span style={{ fontWeight: 700 }}>Gym Tracker</span>
        <button onClick={signOut} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>Sign out</button>
      </header>

      <nav aria-label="Main navigation" style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            aria-current={tab === t ? 'page' : undefined}
            style={{
              flex: 1, padding: '0.75rem', background: 'none', border: 'none',
              borderBottom: `2px solid ${tab === t ? '#1a73e8' : 'transparent'}`,
              color: tab === t ? '#1a73e8' : '#444',
              fontWeight: tab === t ? 600 : 400,
              cursor: 'pointer', fontSize: '0.95rem',
            }}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </nav>

      <main>
        {tab === 'log' && <LogWorkout />}
        {tab === 'sessions' && <SessionHistory />}
        {tab === 'exercises' && <ExerciseHistory />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}
