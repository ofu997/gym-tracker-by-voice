import { getDb } from '../client'
import type { Workout } from '../../types'

export async function getWorkout(id: string): Promise<Workout | undefined> {
  return (await getDb()).get('workouts', id)
}

export async function getWorkoutsByPlan(planId: string): Promise<Workout[]> {
  const workouts = await (await getDb()).getAllFromIndex('workouts', 'byPlanId', planId)
  return workouts.sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function upsertWorkout(workout: Workout): Promise<void> {
  await (await getDb()).put('workouts', workout)
}

export async function deleteWorkout(id: string): Promise<void> {
  await (await getDb()).delete('workouts', id)
}
