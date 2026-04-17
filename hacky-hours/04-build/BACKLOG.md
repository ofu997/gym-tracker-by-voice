# Backlog

Tasks queued for the current milestone. Items are removed when their PR is merged.
Completed work belongs in CHANGELOG.md, not here.

---

## Current Milestone — MVP: "Log it and see it"

**Outcome:** A user can log a workout by voice or text, have it structured automatically, and see their history.

### Foundation

- [x] Scaffold project — Vite + React + TypeScript, ESLint, Prettier, folder structure
- [x] Local data store — IndexedDB schema and data access layer (User, Exercise, Plan, Workout, PlanExercise, PlanTarget, Session, Set, DigestReport)
- [ ] Google OAuth2 sign-in — auth flow, User record creation, secure token handling

### Backend

- [ ] LLM proxy — serverless function (Vercel/Cloudflare), prompt design, structured JSON response schema

### Core logging flow

- [ ] Text logging — text note → LLM parse → preview with inline editing → save
- [ ] Voice input — Web Speech API → text → handoff to existing parse/save flow
- [ ] Exercise canonicalization — match input name against library (canonical + aliases), create on miss

### Edge cases

- [ ] Incomplete record handling — null fields on partial parse, flag session for later completion
- [ ] History-informed defaults — infer missing fields (session_type, date, weight unit) from prior sessions before nulling

### History views

- [ ] Session history view — list logged sessions (date, type, set count)
- [ ] Exercise history view — set history per exercise

### Quality

- [ ] Accessibility pass — WCAG 2.1 AA audit, keyboard navigation, text alternatives
