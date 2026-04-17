import { getDb } from '../db/client'
import { getUser, upsertUser } from '../db'
import type { User } from '../types'

const SESSION_KEY = 'gym_tracker_user_id'

function decodeJwtPayload(token: string): Record<string, unknown> {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
  return JSON.parse(json)
}

export async function handleGoogleCredential(credential: string): Promise<User> {
  const payload = decodeJwtPayload(credential)
  const oauthId = payload['sub'] as string

  const existingId = sessionStorage.getItem(SESSION_KEY)
  if (existingId) {
    const existing = await getUser(existingId)
    if (existing && existing.oauthId === oauthId) return existing
  }

  const existingUsers = await findUserByOAuthId('google', oauthId)
  if (existingUsers) {
    sessionStorage.setItem(SESSION_KEY, existingUsers.id)
    return existingUsers
  }

  const user: User = {
    id: crypto.randomUUID(),
    oauthProvider: 'google',
    oauthId,
    createdAt: new Date().toISOString(),
  }
  await upsertUser(user)
  sessionStorage.setItem(SESSION_KEY, user.id)
  return user
}

async function findUserByOAuthId(
  provider: User['oauthProvider'],
  oauthId: string
): Promise<User | undefined> {
  // IndexedDB has no cross-field index here; full scan on users store is acceptable
  // since a device will only ever have one or two user records
  const db = await getDb()
  const all = await db.getAll('users')
  return all.find((u) => u.oauthProvider === provider && u.oauthId === oauthId)
}

export async function restoreSession(): Promise<User | undefined> {
  const userId = sessionStorage.getItem(SESSION_KEY)
  if (!userId) return undefined
  return getUser(userId)
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
}
