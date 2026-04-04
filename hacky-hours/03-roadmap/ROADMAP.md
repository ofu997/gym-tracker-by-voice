# Roadmap

Milestones are outcome-based — they describe what a user can do, not what was built.

---

## MVP — "Log it and see it"

**Outcome:** A user can log a workout by voice or text, have it structured automatically, and see their history.

This milestone proves the core value proposition: frictionless capture, zero data-entry friction. Everything in V1 depends on having real logged data to work with — so this comes first.

### Features

**Foundation**
- React (Vite) web app, TypeScript, local storage (IndexedDB)
- LLM proxy (stateless serverless function, API key held server-side)
- Google OAuth2 sign-in

**Logging**
- Log workout via text note → LLM parse → preview → save
- Log workout via voice → Web Speech API → LLM parse → preview → save
- Infer missing fields from history; fall back to incomplete record with null fields
- Parsed result preview with inline editing before saving
- Incomplete record flagging — user can complete later

**Exercise library**
- Personal library built automatically from logs
- Exercise canonicalization (canonical name + aliases, semantic matching)
- New exercises created on the fly when no match found

**History**
- View logged sessions and set history per exercise

**Accessibility**
- WCAG 2.1 AA throughout
- Full keyboard navigation
- Text input fallback always present alongside voice input
- Chart/data text alternatives (for any data displays added)

---

## V1 — "Track it and improve"

**Outcome:** A user can define a workout plan, track progression against it, and receive a weekly digest that tells them whether they're improving or drifting.

Roll straight into this from MVP if logging is working well — the split is conceptual, not a mandatory pause.

### Features

**Auth**
- Microsoft OAuth2 sign-in

**Input**
- Log workout via conversation (back-and-forth, async voice memo processing)

**Workout plans**
- Create plan — narrative tier (LLM translates goal to target sequence)
- Create plan — rule-based tier (+N per session/week)
- Create plan — manual tier (fully custom PlanTarget sequence)
- One active plan at a time; previous plan archived on switch
- Progression target advancement after each logged session

**Progression and reporting**
- Exercise progression charts (weight and volume over time)
- Planned trajectory overlay on chart when exercise is in active plan
- Drift detection — session-level (no sessions in 14 days) and exercise-level (plateau across 4 sessions)
- LLM-generated coaching suggestions when drift detected
- Weekly digest generated on demand
- Digest history (all past digests saved, accessible in reverse chronological order)
- Plan adherence summary in digest

**Exercise library management**
- Rename canonical exercise name
- Merge duplicate exercises (moves sets, adds old name as alias)

---

## V2+

**Outcome:** A user can access their workout history from any device and interact with the app through additional channels.

### Features

**Mobile**
- Expo mobile app (iOS and Android)
- Apple Sign-In (required by Apple once mobile ships)
- Native Speech APIs for voice input (more reliable than browser)

**Sync**
- Cloud sync via user-owned storage (Google Drive, iCloud, OneDrive)
- Cross-device access without a proprietary backend

**Additional input**
- Email ingestion (send workout notes to a dedicated address)

**Privacy**
- On-device LLM option (eliminates cloud LLM trust boundary)
- LLM provider configurability (bring your own API key)

---

## What's explicitly not on the roadmap

- Social features (sharing, comparison to other users)
- AI-generated workout plans from scratch (plans are always user-initiated)
- Auto-modification of plans (suggestions are always advisory)
- Data analytics or telemetry
- Paid tier or monetization
