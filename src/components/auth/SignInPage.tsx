import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../context/AuthContext'

export default function SignInPage() {
  const { signInWithGoogle } = useAuth()

  return (
    <main
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '25vh' }}
    >
      <h1>Gym Tracker</h1>
      <p>Sign in to get started.</p>
      <GoogleLogin
        onSuccess={(response) => {
          if (response.credential) {
            signInWithGoogle(response.credential)
          }
        }}
        onError={() => console.error('Google sign-in failed')}
        useOneTap
      />
      <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#666', maxWidth: '320px', textAlign: 'center' }}>
        We use Google Sign-In for identity only. Your email and name are never stored.{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
          Google Privacy Policy
        </a>
      </p>
    </main>
  )
}
