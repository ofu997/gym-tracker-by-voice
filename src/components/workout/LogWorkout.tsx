import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { parseWorkoutNote } from '../../services/llm'
import { saveWorkoutSession } from '../../services/workout'
import WorkoutInput from './WorkoutInput'
import WorkoutPreview from './WorkoutPreview'
import type { ParsedWorkout } from '../../services/llm'

type Phase = 'input' | 'parsing' | 'preview' | 'saving' | 'saved'

interface Props {
  onSaved?: () => void
}

export default function LogWorkout({ onSaved }: Props) {
  const { user } = useAuth()
  const [phase, setPhase] = useState<Phase>('input')
  const [originalNote, setOriginalNote] = useState('')
  const [parsed, setParsed] = useState<ParsedWorkout | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleParse(text: string) {
    setError(null)
    setOriginalNote(text)
    setPhase('parsing')
    try {
      const result = await parseWorkoutNote(text)
      setParsed(result)
      setPhase('preview')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
      setPhase('input')
    }
  }

  async function handleConfirm() {
    if (!parsed || !user) return
    setPhase('saving')
    try {
      await saveWorkoutSession(user.id, parsed, originalNote)
      setPhase('saved')
      onSaved?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save. Try again.')
      setPhase('preview')
    }
  }

  function handleCancel() {
    setPhase('input')
    setParsed(null)
  }

  if (phase === 'saved') {
    return (
      <div role="status" style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ fontSize: '1.25rem' }}>✓ Workout saved</p>
        <button
          onClick={() => { setPhase('input'); setParsed(null); setOriginalNote('') }}
          style={{ marginTop: '1rem', padding: '0.5rem 1.25rem', fontSize: '1rem', borderRadius: '6px', cursor: 'pointer' }}
        >
          Log another
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2 style={{ margin: 0 }}>Log workout</h2>

      {error && (
        <div role="alert" style={{ background: '#fde8e8', border: '1px solid #e53935', borderRadius: '6px', padding: '0.75rem', fontSize: '0.9rem', color: '#c62828' }}>
          {error}
        </div>
      )}

      {(phase === 'input' || phase === 'parsing') && (
        <WorkoutInput onSubmit={handleParse} disabled={phase === 'parsing'} />
      )}

      {(phase === 'preview' || phase === 'saving') && parsed && (
        <WorkoutPreview
          workout={parsed}
          onChange={setParsed}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          saving={phase === 'saving'}
        />
      )}
    </div>
  )
}
