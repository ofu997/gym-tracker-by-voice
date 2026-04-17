import { getDb } from '../client'
import type { PlanExercise } from '../../types'

export async function getPlanExercise(id: string): Promise<PlanExercise | undefined> {
  return (await getDb()).get('planExercises', id)
}

export async function getPlanExercisesByWorkout(workoutId: string): Promise<PlanExercise[]> {
  return (await getDb()).getAllFromIndex('planExercises', 'byWorkoutId', workoutId)
}

export async function upsertPlanExercise(planExercise: PlanExercise): Promise<void> {
  await (await getDb()).put('planExercises', planExercise)
}

export async function deletePlanExercise(id: string): Promise<void> {
  await (await getDb()).delete('planExercises', id)
}

export async function advancePlanExerciseTarget(id: string): Promise<void> {
  const db = await getDb()
  const pe = await db.get('planExercises', id)
  if (!pe) return
  await db.put('planExercises', {
    ...pe,
    currentTargetIndex: pe.currentTargetIndex + 1,
    updatedAt: new Date().toISOString(),
  })
}
