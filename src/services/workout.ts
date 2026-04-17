import { upsertSession, upsertSet, findExerciseByName, upsertExercise } from '../db'
import type { Session, Exercise, WorkoutSet } from '../types'
import type { ParsedWorkout } from './llm'

export interface SavedSession {
  session: Session
  exercises: Exercise[]
  sets: WorkoutSet[]
}

export async function saveWorkoutSession(
  userId: string,
  parsed: ParsedWorkout,
  originalNote: string
): Promise<SavedSession> {
  const now = new Date().toISOString()

  const session: Session = {
    id: crypto.randomUUID(),
    userId,
    workoutId: null,
    healthState: parsed.healthState ?? '',
    notes: originalNote,
    date: parsed.date,
    createdAt: now,
    updatedAt: now,
  }

  await upsertSession(session)

  const savedExercises: Exercise[] = []
  const savedSets: WorkoutSet[] = []

  for (const parsedExercise of parsed.exercises) {
    let exercise = await findExerciseByName(userId, parsedExercise.name)

    if (!exercise) {
      exercise = {
        id: crypto.randomUUID(),
        userId,
        canonicalName: parsedExercise.name,
        aliases: [],
        createdAt: now,
        updatedAt: now,
      }
      await upsertExercise(exercise)
    }

    savedExercises.push(exercise)

    for (const parsedSet of parsedExercise.sets) {
      const set: WorkoutSet = {
        id: crypto.randomUUID(),
        sessionId: session.id,
        exerciseId: exercise.id,
        setNumber: parsedSet.setNumber,
        weight: parsedSet.weight,
        weightUnit: parsedSet.weightUnit ?? 'lbs',
        reps: parsedSet.reps,
        notes: parsedSet.notes ?? '',
        createdAt: now,
        updatedAt: now,
      }
      await upsertSet(set)
      savedSets.push(set)
    }
  }

  return { session, exercises: savedExercises, sets: savedSets }
}
