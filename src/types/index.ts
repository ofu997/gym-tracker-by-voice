export type OAuthProvider = 'google' | 'microsoft'
export type WeightUnit = 'lbs' | 'kg'
export type IncrementType = 'weight' | 'reps' | 'sets' | 'volume'
export type IncrementFrequency = 'per_session' | 'per_week'

export interface User {
  id: string
  oauthProvider: OAuthProvider
  oauthId: string
  createdAt: string
}

export interface Exercise {
  id: string
  userId: string
  canonicalName: string
  aliases: string[]
  createdAt: string
  updatedAt: string
}

export interface Plan {
  id: string
  userId: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Workout {
  id: string
  planId: string
  name: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface PlanExercise {
  id: string
  workoutId: string
  exerciseId: string
  startingWeight: number | null
  startingWeightUnit: WeightUnit
  startingReps: number | null
  startingSets: number | null
  incrementType: IncrementType | null
  incrementValue: number | null
  incrementUnit: string | null
  incrementFrequency: IncrementFrequency | null
  currentTargetIndex: number
  notes: string
  createdAt: string
  updatedAt: string
}

export interface PlanTarget {
  id: string
  planExerciseId: string
  sequenceNumber: number
  targetWeight: number | null
  targetWeightUnit: WeightUnit
  targetReps: number | null
  targetSets: number | null
  notes: string
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  userId: string
  workoutId: string
  healthState: string
  notes: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface Set {
  id: string
  sessionId: string
  exerciseId: string
  setNumber: number
  weight: number | null
  weightUnit: WeightUnit
  reps: number | null
  notes: string
  createdAt: string
  updatedAt: string
}

export interface DigestReport {
  id: string
  userId: string
  periodStart: string
  periodEnd: string
  content: string
  generatedAt: string
  createdAt: string
}
