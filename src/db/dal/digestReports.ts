import { getDb } from '../client'
import type { DigestReport } from '../../types'

export async function getDigestReportsByUser(userId: string): Promise<DigestReport[]> {
  const reports = await (await getDb()).getAllFromIndex('digestReports', 'byUserId', userId)
  return reports.sort((a, b) => (a.periodStart < b.periodStart ? 1 : -1))
}

export async function upsertDigestReport(report: DigestReport): Promise<void> {
  await (await getDb()).put('digestReports', report)
}

export async function deleteDigestReport(id: string): Promise<void> {
  await (await getDb()).delete('digestReports', id)
}
