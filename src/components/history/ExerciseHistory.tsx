import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getExercisesByUser, getSetsByExercise, getSession } from '../../db'
import type { Exercise, WorkoutSet, Session } from '../../types'

interface SetWithSession {
  set: WorkoutSet
  session: Session | undefined
}

export default function ExerciseHistory() {
  const { user } = useAuth()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selected, setSelected] = useState<Exercise | null>(null)
  const [history, setHistory] = useState<SetWithSession[]>([])
  const [loading, setLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    getExercisesByUser(user.id).then((list) => {
      if (!cancelled) {
        setExercises(list)
        setLoading(false)
      }
    })

    return () => { cancelled = true }
  }, [user])

  async function selectExercise(exercise: Exercise) {
    setSelected(exercise)
    setHistoryLoading(true)
    const sets = await getSetsByExercise(exercise.id)
    const withSessions = await Promise.all(
      sets.map(async (set) => ({ set, session: await getSession(set.sessionId) }))
    )
    withSessions.sort((a, b) => {
      const da = a.session?.date ?? ''
      const db = b.session?.date ?? ''
      return da < db ? 1 : -1
    })
    setHistory(withSessions)
    setHistoryLoading(false)
  }

  if (loading) return <p style={{ padding: '1.5rem', color: '#666' }}>Loading…</p>

  if (exercises.length === 0) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center', color: '#666' }}>
        <p>No exercises logged yet.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2 style={{ margin: 0 }}>Exercise history</h2>

      <div>
        <label htmlFor="exercise-select" style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
          Exercise
        </label>
        <select
          id="exercise-select"
          value={selected?.id ?? ''}
          onChange={(e) => {
            const ex = exercises.find((x) => x.id === e.target.value)
            if (ex) selectExercise(ex)
          }}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', width: '100%' }}
        >
          <option value="" disabled>Select an exercise…</option>
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.canonicalName}</option>
          ))}
        </select>
      </div>

      {selected && (
        historyLoading ? (
          <p style={{ color: '#666' }}>Loading…</p>
        ) : history.length === 0 ? (
          <p style={{ color: '#666' }}>No sets logged for {selected.canonicalName}.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#666', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '0.4rem 0.5rem', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '0.4rem 0.5rem', fontWeight: 500 }}>Set</th>
                <th style={{ padding: '0.4rem 0.5rem', fontWeight: 500 }}>Weight</th>
                <th style={{ padding: '0.4rem 0.5rem', fontWeight: 500 }}>Reps</th>
              </tr>
            </thead>
            <tbody>
              {history.map(({ set, session }) => (
                <tr key={set.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '0.4rem 0.5rem', color: '#444' }}>{session?.date ?? '—'}</td>
                  <td style={{ padding: '0.4rem 0.5rem', color: '#999' }}>{set.setNumber}</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>
                    {set.weight !== null ? `${set.weight} ${set.weightUnit}` : '—'}
                  </td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>{set.reps ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  )
}
