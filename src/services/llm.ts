export interface ParsedSet {
  setNumber: number
  weight: number | null
  weightUnit: 'lbs' | 'kg' | null
  reps: number | null
  notes: string | null
}

export interface ParsedExercise {
  name: string
  sets: ParsedSet[]
}

export interface ParsedWorkout {
  date: string
  sessionType: string | null
  healthState: string | null
  exercises: ParsedExercise[]
  isComplete: boolean
}

export async function parseWorkoutNote(text: string): Promise<ParsedWorkout> {
  const response = await fetch('/api/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error((err as { error?: string }).error ?? 'Parse request failed')
  }

  return response.json() as Promise<ParsedWorkout>
}
