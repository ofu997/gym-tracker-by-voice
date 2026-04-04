# User Journeys

Maps how a user moves through the product for each core flow. Focuses on experience, not implementation. See BUSINESS_LOGIC.md for parsing and progression rules.

---

## 1. Onboarding

First time the user opens the app.

```mermaid
flowchart TD
    OPEN[User opens app]
    SIGNIN[Sign in with Google or Microsoft]
    EMPTY[Empty state\nNo sessions, no plan]
    PROMPT[App prompts:\n'Log your first workout\nor set up a plan']
    CHOICE{User chooses}
    LOG[→ Journey 2, 3, or 4]
    PLAN[→ Journey 5]

    OPEN --> SIGNIN
    SIGNIN --> EMPTY
    EMPTY --> PROMPT
    PROMPT --> CHOICE
    CHOICE -->|Log a workout| LOG
    CHOICE -->|Set up a plan| PLAN
```

**Notes:**
- No profile setup required — display name pulled from OAuth token, never stored
- No onboarding wizard or tutorial — the app explains itself through the empty state prompt
- User can skip both and just explore

---

## 2. Log a Workout — Voice

The primary input flow.

```mermaid
flowchart TD
    TAP[User taps voice input]
    RECORD[App records voice\nWeb Speech API]
    TRANSCRIBE[Transcribed to text\non-device]
    PARSE[LLM parses transcription\ninto structured data]
    CANON[Exercise canonicalization\nagainst user library]
    INFER{Missing fields?}
    HISTORY{History exists?}
    FILL[Fill from history\nflag as inferred]
    GAP[Save with null fields\nflag as incomplete]
    PREVIEW[App shows parsed result\nfor user review]
    CONFIRM{User confirms?}
    SAVE[Save to local store]
    EDIT[User edits inline]

    TAP --> RECORD
    RECORD --> TRANSCRIBE
    TRANSCRIBE --> PARSE
    PARSE --> CANON
    CANON --> INFER
    INFER -->|Yes| HISTORY
    INFER -->|No| PREVIEW
    HISTORY -->|Yes| FILL
    HISTORY -->|No| GAP
    FILL --> PREVIEW
    GAP --> PREVIEW
    PREVIEW --> CONFIRM
    CONFIRM -->|Yes| SAVE
    CONFIRM -->|No - edit| EDIT
    EDIT --> SAVE
```

**Notes:**
- Audio is never saved — discarded after transcription
- The parsed preview shows exactly what will be stored before the user confirms
- Inferred fields are visually distinguished from stated fields so the user knows what the app guessed
- Incomplete records (null fields) can be filled in later from the session view

---

## 3. Log a Workout — Text Note

For users who prefer typing or are in a quiet environment.

```mermaid
flowchart TD
    TAP[User taps text input]
    TYPE[User types note\ne.g. 'bench 3x8 185, squats felt heavy']
    PARSE[LLM parses text\ninto structured data]
    CANON[Exercise canonicalization]
    INFER{Missing fields?}
    HISTORY{History exists?}
    FILL[Fill from history\nflag as inferred]
    GAP[Save with null fields\nflag as incomplete]
    PREVIEW[App shows parsed result\nfor user review]
    CONFIRM{User confirms?}
    SAVE[Save to local store]
    EDIT[User edits inline]

    TAP --> TYPE
    TYPE --> PARSE
    PARSE --> CANON
    CANON --> INFER
    INFER -->|Yes| HISTORY
    INFER -->|No| PREVIEW
    HISTORY -->|Yes| FILL
    HISTORY -->|No| GAP
    FILL --> PREVIEW
    GAP --> PREVIEW
    PREVIEW --> CONFIRM
    CONFIRM -->|Yes| SAVE
    CONFIRM -->|No - edit| EDIT
    EDIT --> SAVE
```

**Notes:**
- Same parsing pipeline as voice — only the input method differs
- Supports casual natural language: "same as last time but added 5lbs", "did my usual push day, felt tired"
- The original text note is saved in `session.notes` for reference

---

## 4. Log a Workout — Conversation

For when the user wants to talk through a session or has a voice memo from days ago.

```mermaid
flowchart TD
    START[User opens conversation input]
    MSG1[User sends first message\nvoice or text]
    RESPOND[App responds with\nclarifying questions or summary]
    CONTINUE{More to add?}
    MSG2[User continues]
    SYNTHESIZE[App synthesizes full session\nfrom conversation history]
    PREVIEW[App shows parsed result\nfor user review]
    CONFIRM{User confirms?}
    SAVE[Save to local store]
    EDIT[User edits inline]

    START --> MSG1
    MSG1 --> RESPOND
    RESPOND --> CONTINUE
    CONTINUE -->|Yes| MSG2
    MSG2 --> RESPOND
    CONTINUE -->|No| SYNTHESIZE
    SYNTHESIZE --> PREVIEW
    PREVIEW --> CONFIRM
    CONFIRM -->|Yes| SAVE
    CONFIRM -->|No - edit| EDIT
    EDIT --> SAVE
```

**Notes:**
- The LLM accumulates context across the full conversation before writing to the store — nothing is saved mid-conversation
- Supports past-dated sessions: "this was from Tuesday" → `session.date` set accordingly
- Useful for processing saved voice memos: user pastes or dictates a note from days ago and the app synthesizes it

---

## 5. Create a Workout Plan

```mermaid
flowchart TD
    START[User opens Plan section]
    CHOOSE{Input tier}
    NARRATIVE[User describes goal\nin natural language]
    RULE[User states a rule\ne.g. +5lbs per session]
    MANUAL[User fills in\neach target manually]
    LLM_N[LLM infers starting point\nfrom history, generates\nPlanTarget sequence]
    LLM_R[App generates uniform\nPlanTarget sequence\nfrom rule]
    PREVIEW[App shows plan summary\nfor user review]
    CONFIRM{User confirms?}
    ADJUST[User adjusts]
    SAVE[Save plan\nset as active]
    DEACTIVATE[Previous plan\ndeactivated if exists]

    START --> CHOOSE
    CHOOSE -->|Narrative| NARRATIVE
    CHOOSE -->|Rule-based| RULE
    CHOOSE -->|Manual| MANUAL
    NARRATIVE --> LLM_N
    RULE --> LLM_R
    MANUAL --> PREVIEW
    LLM_N --> PREVIEW
    LLM_R --> PREVIEW
    PREVIEW --> CONFIRM
    CONFIRM -->|Yes| SAVE
    CONFIRM -->|No - adjust| ADJUST
    ADJUST --> PREVIEW
    SAVE --> DEACTIVATE
```

**Notes:**
- LLM always shows the translated plan before saving — user confirms before anything is written
- Previous active plan is deactivated (not deleted) when a new one is saved
- Manual tier allows any progression pattern, including non-uniform sequences (deload weeks, periodization blocks)

---

## 6. View Weekly Digest

```mermaid
flowchart TD
    OPEN[User opens Digest section]
    LATEST[App shows most recent digest\nor generates one if none exists]
    READ[User reads report]
    HISTORY[User can scroll back\nthrough past digests]
    DRIFT{Drift detected\nin report?}
    SUGGESTION[Report includes\nLLM suggestion]
    ACTION{User acts on suggestion?}
    MODIFY[User opens plan\nto adjust]
    DISMISS[User dismisses]

    OPEN --> LATEST
    LATEST --> READ
    READ --> HISTORY
    READ --> DRIFT
    DRIFT -->|Yes| SUGGESTION
    DRIFT -->|No| done1[ ]
    SUGGESTION --> ACTION
    ACTION -->|Yes| MODIFY
    ACTION -->|No| DISMISS
```

**Notes:**
- Digest is generated on demand — user pulls it when they want it, not pushed automatically (MVP)
- Past digests are stored and accessible in reverse chronological order
- Drift suggestions are advisory — tapping one opens the plan editor, nothing changes automatically

---

## 7. Review Exercise Progression

```mermaid
flowchart TD
    OPEN[User opens an exercise\nfrom their library]
    VIEW[App shows progression chart\nweight and volume over time]
    PLAN{Active plan includes\nthis exercise?}
    OVERLAY[Chart overlays actual\nvs. planned trajectory]
    HISTORY[Chart shows actuals only]
    SETS[User can view individual\nset history below chart]

    OPEN --> VIEW
    VIEW --> PLAN
    PLAN -->|Yes| OVERLAY
    PLAN -->|No| HISTORY
    OVERLAY --> SETS
    HISTORY --> SETS
```

**Notes:**
- Primary view is the progression chart — weight or volume over time, user can toggle
- If the exercise is in the active plan, the planned trajectory is shown as a reference line
- Individual set rows below the chart let the user see exact logged values

---

## 8. Manage Exercise Library

```mermaid
flowchart TD
    OPEN[User opens Exercise Library]
    LIST[App shows all exercises\nwith set counts and last logged date]
    CHOOSE{Action}
    RENAME[User renames canonical name]
    MERGE[User selects two exercises\nto merge]
    MERGE_CONFIRM[App shows what will happen:\nall sets moved, old name becomes alias]
    CONFIRM{Confirm merge?}
    DO_MERGE[Sets moved\nold exercise deleted\nname added as alias]
    SAVE_RENAME[Canonical name updated]

    OPEN --> LIST
    LIST --> CHOOSE
    CHOOSE -->|Rename| RENAME
    CHOOSE -->|Merge| MERGE
    RENAME --> SAVE_RENAME
    MERGE --> MERGE_CONFIRM
    MERGE_CONFIRM --> CONFIRM
    CONFIRM -->|Yes| DO_MERGE
    CONFIRM -->|No| LIST
```

**Notes:**
- Library grows automatically as the user logs — no manual entry required
- Merge is the main maintenance action: consolidates duplicates that arose from variant naming
- Renaming only changes the canonical name — all aliases and set history are preserved
- Exercises cannot be deleted if they have associated sets (to preserve history)
