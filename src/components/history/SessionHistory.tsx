import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getSessionsByUser, getSetsBySession } from '../../db'
import type { Session } from '../../types'

interface SessionRow {
  session: Session
  setCount: number
}

export default function SessionHistory() {
  const { user } = useAuth()
  const [rows, setRows] = useState<SessionRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function load() {
      const sessions = await getSessionsByUser(user!.id)
      const loaded: SessionRow[] = await Promise.all(
        sessions.map(async (session) => {
          const sets = await getSetsBySession(session.id)
          return { session, setCount: sets.length }
        })
      )
      if (!cancelled) {
        setRows(loaded)
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [user])

  if (loading) return <p style={{ padding: '1.5rem', color: '#666' }}>Loading…</p>

  if (rows.length === 0) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center', color: '#666' }}>
        <p>No sessions logged yet.</p>
        <p style={{ fontSize: '0.9rem' }}>Log a workout to see it here.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem' }}>
      <h2 style={{ margin: '0 0 1rem' }}>Session history</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {rows.map(({ session, setCount }) => (
          <li
            key={session.id}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.75rem 1rem', border: '1px solid #eee', borderRadius: '6px',
              background: session.isComplete ? '#fff' : '#fffbf0',
            }}
          >
            <div>
              <span style={{ fontWeight: 600 }}>{session.date}</span>
              {session.sessionType && (
                <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                  {session.sessionType}
                </span>
              )}
              {!session.isComplete && (
                <span
                  aria-label="Incomplete"
                  style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#b45309', background: '#fef3c7', borderRadius: '4px', padding: '0.1rem 0.4rem' }}
                >
                  incomplete
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>
              {setCount} {setCount === 1 ? 'set' : 'sets'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
