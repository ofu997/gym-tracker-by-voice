import { getDb } from '../client'
import type { User } from '../../types'

export async function getUser(id: string): Promise<User | undefined> {
  return (await getDb()).get('users', id)
}

export async function upsertUser(user: User): Promise<void> {
  await (await getDb()).put('users', user)
}
