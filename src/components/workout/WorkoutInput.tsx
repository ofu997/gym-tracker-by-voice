import { useState } from 'react'
import VoiceButton from './VoiceButton'

interface Props {
  onSubmit: (text: string) => void
  disabled: boolean
}

export default function WorkoutInput({ onSubmit, disabled }: Props) {
  const [text, setText] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (text.trim()) onSubmit(text.trim())
  }

  function handleTranscript(transcript: string) {
    setText(transcript)
    onSubmit(transcript)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <label htmlFor="workout-note" style={{ fontWeight: 600 }}>
        What did you do?
      </label>
      <textarea
        id="workout-note"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        rows={5}
        placeholder="e.g. bench press 3x8 185lbs, squats 4x5 225, felt strong"
        style={{ padding: '0.75rem', fontSize: '1rem', resize: 'vertical', borderRadius: '6px', border: '1px solid #ccc' }}
        aria-label="Workout note"
      />
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          style={{ padding: '0.5rem 1.25rem', fontSize: '1rem', borderRadius: '6px', cursor: 'pointer' }}
        >
          {disabled ? 'Parsing…' : 'Parse workout'}
        </button>
        <VoiceButton onTranscript={handleTranscript} disabled={disabled} />
      </div>
    </form>
  )
}
