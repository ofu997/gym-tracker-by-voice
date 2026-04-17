import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider, useAuth } from './context/AuthContext'
import SignInPage from './components/auth/SignInPage'
import LogWorkout from './components/workout/LogWorkout'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

function AppShell() {
  const { user, loading, signOut } = useAuth()

  if (loading) return null
  if (!user) return <SignInPage />

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid #eee' }}>
        <span style={{ fontWeight: 700 }}>Gym Tracker</span>
        <button onClick={signOut} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>Sign out</button>
      </header>
      <main>
        <LogWorkout />
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
