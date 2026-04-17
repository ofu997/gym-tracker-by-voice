import { getDb } from '../client'
import type { PlanTarget } from '../../types'

export async function getPlanTargetsByExercise(planExerciseId: string): Promise<PlanTarget[]> {
  const targets = await (
    await getDb()
  ).getAllFromIndex('planTargets', 'byPlanExerciseId', planExerciseId)
  return targets.sort((a, b) => a.sequenceNumber - b.sequenceNumber)
}

export async function getCurrentTarget(
  planExerciseId: string,
  currentIndex: number
): Promise<PlanTarget | undefined> {
  const targets = await getPlanTargetsByExercise(planExerciseId)
  return targets.find((t) => t.sequenceNumber === currentIndex)
}

export async function upsertPlanTarget(target: PlanTarget): Promise<void> {
  await (await getDb()).put('planTargets', target)
}

export async function deletePlanTarget(id: string): Promise<void> {
  await (await getDb()).delete('planTargets', id)
}
