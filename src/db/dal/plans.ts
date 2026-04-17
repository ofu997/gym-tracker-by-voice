import { getDb } from '../client'
import type { Plan } from '../../types'

export async function getPlan(id: string): Promise<Plan | undefined> {
  return (await getDb()).get('plans', id)
}

export async function getPlansByUser(userId: string): Promise<Plan[]> {
  return (await getDb()).getAllFromIndex('plans', 'byUserId', userId)
}

export async function getActivePlan(userId: string): Promise<Plan | undefined> {
  const plans = await getPlansByUser(userId)
  return plans.find((p) => p.isActive)
}

export async function upsertPlan(plan: Plan): Promise<void> {
  const db = await getDb()
  if (plan.isActive) {
    const existing = await getPlansByUser(plan.userId)
    const tx = db.transaction('plans', 'readwrite')
    await Promise.all([
      ...existing
        .filter((p) => p.id !== plan.id && p.isActive)
        .map((p) => tx.store.put({ ...p, isActive: false })),
      tx.store.put(plan),
      tx.done,
    ])
  } else {
    await db.put('plans', plan)
  }
}
