import { getDb } from './client'
import { deleteSetsBySession } from './dal/sets'

const RETENTION_DAYS = 90

function cutoffDate(): string {
  const d = new Date()
  d.setDate(d.getDate() - RETENTION_DAYS)
  return d.toISOString()
}

export async function evictOldRecords(userId: string): Promise<void> {
  const cutoff = cutoffDate()
  const db = await getDb()

  const oldSessions = (await db.getAllFromIndex('sessions', 'byUserId', userId)).filter(
    (s) => s.date < cutoff
  )

  await Promise.all(oldSessions.map((s) => deleteSetsBySession(s.id)))

  const sessionTx = db.transaction('sessions', 'readwrite')
  await Promise.all([
    ...oldSessions.map((s) => sessionTx.store.delete(s.id)),
    sessionTx.done,
  ])

  const oldReports = (await db.getAllFromIndex('digestReports', 'byUserId', userId)).filter(
    (r) => r.periodStart < cutoff
  )

  const reportTx = db.transaction('digestReports', 'readwrite')
  await Promise.all([
    ...oldReports.map((r) => reportTx.store.delete(r.id)),
    reportTx.done,
  ])
}
