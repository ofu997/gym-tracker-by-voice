# Product Overview

---

## Who

Busy people who work out and want to log their sessions without interrupting them. They're frustrated by traditional tracking apps that require structured data entry mid-workout — filling out forms, navigating menus, selecting exercise types. They want to stay in the workout, not in the app.

## What

A workout tracker that accepts unstructured input — voice notes, text messages, short conversations, even emails — and figures out the structure for you. The user drops a quick note ("just did 3 sets of bench, felt strong, 185lbs") and the app parses it into a structured log. Capture now, process later is explicitly supported: a voice note saved in the moment can be handed to the app days later.

Beyond logging, the app tracks progression over time. A user can define workout plans, and the app observes how their weight, reps, and sets change across sessions. It surfaces that progress on a digest cadence — a weekly report, not real-time push notifications — so the user doesn't have to go digging for it. The value isn't just "logged it," it's "you're getting stronger, here's the evidence."

Input modalities (all first-class):
- Quick text note (like texting the app)
- Voice dictation
- Short back-and-forth conversation
- Saved voice memo, processed later
- Email sent to the app

## Where

Cross-platform: iOS, Android, and web. Account-based — workouts live in the cloud, not on a single device. Any browser or app gets you your full history.

## When

Personal use target: weekly, ongoing. Public adoption target: working across others' devices within one year of starting.

## Why

Existing workout trackers make the user do the data structuring. That's a context switch that breaks workout focus and costs 10–15 minutes of post-workout admin. This product inverts it: the user captures naturally, the app does the work. The goal is zero friction between finishing a set and having it logged.

---

## Constraints & Values

### Licensing Intent

MIT License. Open source. Not planning to charge for it.

### Privacy Stance

Minimize data collection aggressively — especially health and personal data. Voice and text input may route through third-party tools (LLMs, device speech-to-text) for transcription and parsing, but raw audio and sensitive data are not stored by this app. 

Responsibilities:
- Be fully transparent with users about every third-party tool used in the pipeline
- Link to those services' own privacy policies — the user's relationship with their data practices is with them, not us
- Do not store raw audio files
- Do not store health data beyond what the user explicitly provides as workout notes
- Design decisions should keep us off the hook for third-party data practices

### Infrastructure Preference

Local and on-device first. Minimal backend — small attack surface for security and privacy reasons. If cloud accounts/sync are needed, keep the backend as simple as possible. Avoid services that expand our data exposure or operational complexity unnecessarily.
