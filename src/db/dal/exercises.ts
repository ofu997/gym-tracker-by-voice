import { getDb } from '../client'
import type { Exercise } from '../../types'

export async function getExercise(id: string): Promise<Exercise | undefined> {
  return (await getDb()).get('exercises', id)
}

export async function getExercisesByUser(userId: string): Promise<Exercise[]> {
  return (await getDb()).getAllFromIndex('exercises', 'byUserId', userId)
}

export async function upsertExercise(exercise: Exercise): Promise<void> {
  await (await getDb()).put('exercises', exercise)
}

export async function deleteExercise(id: string): Promise<void> {
  await (await getDb()).delete('exercises', id)
}

export async function findExerciseByName(
  userId: string,
  name: string
): Promise<Exercise | undefined> {
  const exercises = await getExercisesByUser(userId)
  const lower = name.toLowerCase()
  return exercises.find(
    (e) =>
      e.canonicalName.toLowerCase() === lower ||
      e.aliases.some((a) => a.toLowerCase() === lower)
  )
}
