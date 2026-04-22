# Changelog

Record of completed milestones and releases.
Entries older than 3 releases should be archived to `archive/changelog/`.

---

## [v0.1.0] — 2026-04-17

### Added
- Project scaffold — Vite + React 19 + TypeScript, ESLint, Prettier
- IndexedDB data layer — full schema (User, Exercise, Plan, Workout, PlanExercise, PlanTarget, Session, WorkoutSet, DigestReport) with 90-day eviction
- Google OAuth2 sign-in — auth flow, User record creation, token in sessionStorage
- LLM proxy — Vercel Edge Function calling claude-haiku-4-5 with prompt caching and structured tool output
- Text logging — textarea note → LLM parse → inline-editable preview → save
- Voice input — Web Speech API with one-time consent disclosure, interim transcript display
- Exercise canonicalization — case-insensitive exact + alias match against user library, create on miss
- Incomplete record handling — `Session.isComplete` persisted; preview shows amber warning and highlights null fields
- History-informed defaults — weight unit inferred from most recent 10 sessions instead of hardcoded 'lbs'
- Session history view — reverse-chronological list with date, session type, set count, incomplete badge
- Exercise history view — select exercise, see all sets in reverse-chronological order
- Tab navigation — Log / Sessions / Exercises with `aria-current` and dynamic `<title>`
- Accessibility (WCAG 2.1 AA) — semantic nav, focus moved to consent dialog on open, recording state announcements via `aria-live`, `aria-busy` on save button
