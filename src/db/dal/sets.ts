import { getDb } from '../client'
import type { WorkoutSet, WeightUnit } from '../../types'

export async function getSetsBySession(sessionId: string): Promise<WorkoutSet[]> {
  const sets = await (await getDb()).getAllFromIndex('sets', 'bySessionId', sessionId)
  return sets.sort((a, b) => a.setNumber - b.setNumber)
}

export async function getSetsByExercise(exerciseId: string): Promise<WorkoutSet[]> {
  return (await getDb()).getAllFromIndex('sets', 'byExerciseId', exerciseId)
}

export async function upsertSet(set: WorkoutSet): Promise<void> {
  await (await getDb()).put('sets', set)
}

export async function deleteSet(id: string): Promise<void> {
  await (await getDb()).delete('sets', id)
}

export async function getPreferredWeightUnit(userId: string): Promise<WeightUnit> {
  const db = await getDb()
  const sessions = await db.getAllFromIndex('sessions', 'byUserId', userId)
  const recent = sessions.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 10)
  const counts: Record<WeightUnit, number> = { lbs: 0, kg: 0 }
  for (const session of recent) {
    const sets = await db.getAllFromIndex('sets', 'bySessionId', session.id)
    for (const s of sets) counts[s.weightUnit]++
  }
  return counts.kg > counts.lbs ? 'kg' : 'lbs'
}

export async function deleteSetsBySession(sessionId: string): Promise<void> {
  const db = await getDb()
  const sets = await db.getAllFromIndex('sets', 'bySessionId', sessionId)
  const tx = db.transaction('sets', 'readwrite')
  await Promise.all([...sets.map((s) => tx.store.delete(s.id)), tx.done])
}
