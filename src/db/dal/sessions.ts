import { getDb } from '../client'
import type { Session } from '../../types'

export async function getSession(id: string): Promise<Session | undefined> {
  return (await getDb()).get('sessions', id)
}

export async function getSessionsByUser(userId: string): Promise<Session[]> {
  const sessions = await (await getDb()).getAllFromIndex('sessions', 'byUserId', userId)
  return sessions.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getSessionsByWorkout(workoutId: string): Promise<Session[]> {
  const sessions = await (await getDb()).getAllFromIndex('sessions', 'byWorkoutId', workoutId)
  return sessions.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function upsertSession(session: Session): Promise<void> {
  await (await getDb()).put('sessions', session)
}

export async function deleteSession(id: string): Promise<void> {
  await (await getDb()).delete('sessions', id)
}
