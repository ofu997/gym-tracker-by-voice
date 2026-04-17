import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase } from 'idb'
import type {
  User,
  Exercise,
  Plan,
  Workout,
  PlanExercise,
  PlanTarget,
  Session,
  WorkoutSet,
  DigestReport,
} from '../types'

interface GymTrackerDB extends DBSchema {
  users: {
    key: string
    value: User
  }
  exercises: {
    key: string
    value: Exercise
    indexes: { byUserId: string }
  }
  plans: {
    key: string
    value: Plan
    indexes: { byUserId: string }
  }
  workouts: {
    key: string
    value: Workout
    indexes: { byPlanId: string }
  }
  planExercises: {
    key: string
    value: PlanExercise
    indexes: { byWorkoutId: string; byExerciseId: string }
  }
  planTargets: {
    key: string
    value: PlanTarget
    indexes: { byPlanExerciseId: string }
  }
  sessions: {
    key: string
    value: Session
    indexes: { byUserId: string; byWorkoutId: string; byDate: string }
  }
  sets: {
    key: string
    value: WorkoutSet
    indexes: { bySessionId: string; byExerciseId: string }
  }
  digestReports: {
    key: string
    value: DigestReport
    indexes: { byUserId: string; byPeriodStart: string }
  }
}

const DB_NAME = 'gym-tracker'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<GymTrackerDB>> | null = null

export function getDb(): Promise<IDBPDatabase<GymTrackerDB>> {
  if (!dbPromise) {
    dbPromise = openDB<GymTrackerDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('users', { keyPath: 'id' })

        const exercises = db.createObjectStore('exercises', { keyPath: 'id' })
        exercises.createIndex('byUserId', 'userId')

        const plans = db.createObjectStore('plans', { keyPath: 'id' })
        plans.createIndex('byUserId', 'userId')

        const workouts = db.createObjectStore('workouts', { keyPath: 'id' })
        workouts.createIndex('byPlanId', 'planId')

        const planExercises = db.createObjectStore('planExercises', { keyPath: 'id' })
        planExercises.createIndex('byWorkoutId', 'workoutId')
        planExercises.createIndex('byExerciseId', 'exerciseId')

        const planTargets = db.createObjectStore('planTargets', { keyPath: 'id' })
        planTargets.createIndex('byPlanExerciseId', 'planExerciseId')

        const sessions = db.createObjectStore('sessions', { keyPath: 'id' })
        sessions.createIndex('byUserId', 'userId')
        sessions.createIndex('byWorkoutId', 'workoutId')
        sessions.createIndex('byDate', 'date')

        const sets = db.createObjectStore('sets', { keyPath: 'id' })
        sets.createIndex('bySessionId', 'sessionId')
        sets.createIndex('byExerciseId', 'exerciseId')

        const digestReports = db.createObjectStore('digestReports', { keyPath: 'id' })
        digestReports.createIndex('byUserId', 'userId')
        digestReports.createIndex('byPeriodStart', 'periodStart')
      },
    })
  }
  return dbPromise
}
