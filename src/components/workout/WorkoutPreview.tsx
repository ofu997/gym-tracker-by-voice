import type { ParsedWorkout, ParsedExercise, ParsedSet } from '../../services/llm'

interface Props {
  workout: ParsedWorkout
  onChange: (updated: ParsedWorkout) => void
  onConfirm: () => void
  onCancel: () => void
  saving: boolean
}

export default function WorkoutPreview({ workout, onChange, onConfirm, onCancel, saving }: Props) {
  function updateField<K extends keyof ParsedWorkout>(key: K, value: ParsedWorkout[K]) {
    onChange({ ...workout, [key]: value })
  }

  function updateExercise(index: number, updated: ParsedExercise) {
    const exercises = workout.exercises.map((e, i) => (i === index ? updated : e))
    onChange({ ...workout, exercises })
  }

  function updateSet(exIndex: number, setIndex: number, updated: ParsedSet) {
    const exercise = workout.exercises[exIndex]
    const sets = exercise.sets.map((s, i) => (i === setIndex ? updated : s))
    updateExercise(exIndex, { ...exercise, sets })
  }

  function addSet(exIndex: number) {
    const exercise = workout.exercises[exIndex]
    const last = exercise.sets[exercise.sets.length - 1]
    const newSet: ParsedSet = {
      setNumber: exercise.sets.length + 1,
      weight: last?.weight ?? null,
      weightUnit: last?.weightUnit ?? 'lbs',
      reps: last?.reps ?? null,
      notes: null,
    }
    updateExercise(exIndex, { ...exercise, sets: [...exercise.sets, newSet] })
  }

  function removeSet(exIndex: number, setIndex: number) {
    const exercise = workout.exercises[exIndex]
    const sets = exercise.sets
      .filter((_, i) => i !== setIndex)
      .map((s, i) => ({ ...s, setNumber: i + 1 }))
    updateExercise(exIndex, { ...exercise, sets })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {!workout.isComplete && (
        <div role="alert" style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '6px', padding: '0.75rem', fontSize: '0.9rem' }}>
          ⚠ Some fields couldn't be parsed. Review and fill in anything missing before saving.
        </div>
      )}

      <fieldset style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '0.75rem' }}>
        <legend style={{ fontWeight: 600, padding: '0 0.25rem' }}>Session details</legend>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.9rem' }}>
            Date
            <input
              type="date"
              value={workout.date}
              onChange={(e) => updateField('date', e.target.value)}
              style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.9rem' }}>
            Type
            <input
              type="text"
              value={workout.sessionType ?? ''}
              onChange={(e) => updateField('sessionType', e.target.value || null)}
              placeholder="e.g. push day"
              style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.9rem', gridColumn: '1 / -1' }}>
            How did you feel?
            <input
              type="text"
              value={workout.healthState ?? ''}
              onChange={(e) => updateField('healthState', e.target.value || null)}
              placeholder="e.g. felt strong, shoulder was tight"
              style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </label>
        </div>
      </fieldset>

      {workout.exercises.map((exercise, exIndex) => (
        <fieldset key={exIndex} style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '0.75rem' }}>
          <legend style={{ padding: '0 0.25rem' }}>
            <input
              type="text"
              value={exercise.name}
              onChange={(e) => updateExercise(exIndex, { ...exercise, name: e.target.value })}
              style={{ fontWeight: 600, fontSize: '1rem', border: 'none', borderBottom: '1px solid #aaa', background: 'transparent', padding: '0.1rem 0.25rem' }}
              aria-label={`Exercise ${exIndex + 1} name`}
            />
          </legend>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#666' }}>
                <th style={{ padding: '0.25rem', fontWeight: 500 }}>Set</th>
                <th style={{ padding: '0.25rem', fontWeight: 500 }}>Weight</th>
                <th style={{ padding: '0.25rem', fontWeight: 500 }}>Unit</th>
                <th style={{ padding: '0.25rem', fontWeight: 500 }}>Reps</th>
                <th style={{ padding: '0.25rem', fontWeight: 500 }}></th>
              </tr>
            </thead>
            <tbody>
              {exercise.sets.map((set, setIndex) => (
                <tr key={setIndex}>
                  <td style={{ padding: '0.25rem', color: '#999' }}>{set.setNumber}</td>
                  <td style={{ padding: '0.25rem' }}>
                    <input
                      type="number"
                      value={set.weight ?? ''}
                      onChange={(e) => updateSet(exIndex, setIndex, { ...set, weight: e.target.value ? Number(e.target.value) : null })}
                      placeholder="—"
                      style={{ width: '5rem', padding: '0.3rem', borderRadius: '4px', border: `1px solid ${set.weight === null ? '#ffc107' : '#ccc'}` }}
                      aria-label={`Set ${set.setNumber} weight`}
                    />
                  </td>
                  <td style={{ padding: '0.25rem' }}>
                    <select
                      value={set.weightUnit ?? 'lbs'}
                      onChange={(e) => updateSet(exIndex, setIndex, { ...set, weightUnit: e.target.value as 'lbs' | 'kg' })}
                      style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ccc' }}
                      aria-label={`Set ${set.setNumber} weight unit`}
                    >
                      <option value="lbs">lbs</option>
                      <option value="kg">kg</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.25rem' }}>
                    <input
                      type="number"
                      value={set.reps ?? ''}
                      onChange={(e) => updateSet(exIndex, setIndex, { ...set, reps: e.target.value ? Number(e.target.value) : null })}
                      placeholder="—"
                      style={{ width: '4rem', padding: '0.3rem', borderRadius: '4px', border: `1px solid ${set.reps === null ? '#ffc107' : '#ccc'}` }}
                      aria-label={`Set ${set.setNumber} reps`}
                    />
                  </td>
                  <td style={{ padding: '0.25rem' }}>
                    {exercise.sets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSet(exIndex, setIndex)}
                        aria-label={`Remove set ${set.setNumber}`}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '1rem' }}
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="button"
            onClick={() => addSet(exIndex)}
            style={{ marginTop: '0.5rem', background: 'none', border: '1px dashed #aaa', borderRadius: '4px', padding: '0.3rem 0.75rem', cursor: 'pointer', color: '#666', fontSize: '0.85rem' }}
          >
            + Add set
          </button>
        </fieldset>
      ))}

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={onConfirm}
          disabled={saving}
          style={{ padding: '0.6rem 1.5rem', fontSize: '1rem', borderRadius: '6px', cursor: 'pointer', background: '#1a73e8', color: '#fff', border: 'none' }}
        >
          {saving ? 'Saving…' : 'Save workout'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          style={{ padding: '0.6rem 1rem', fontSize: '1rem', borderRadius: '6px', cursor: 'pointer', background: 'none', border: '1px solid #ccc' }}
        >
          Edit note
        </button>
      </div>
    </div>
  )
}
