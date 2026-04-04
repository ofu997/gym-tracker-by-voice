# Ideation

Free-writing space — no rules. Dump everything here: rough ideas, questions, inspiration, problems you've experienced, people you've imagined using this, half-baked features, anything.

Nothing here needs to be polished. That's what PRODUCT_OVERVIEW.md is for.

---

## The user

Someone who is busy day to day, has worked out or is about to work out. They don't want to context-switch into an app mid-workout — no typing, no navigating menus, no filling out forms. They want to stay focused on the workout and capture it conversationally and organically. The app should figure it out.

The problem with existing trackers: they make *you* do the structured data entry. This flips it — you talk, the app structures it.

## The core frustration

Wasting time on phone apps. Not wanting one more app to interact with extensively. The goal: say what the workout was, let the app figure out the details.

## Input modalities (all valid, all first-class)

- Quick text note (like a text message to the app)
- Voice dictation
- Short back-and-forth conversation with the app
- Save a voice note in the moment → ask the app to synthesize it days later

The key insight: **capture now, process later is fine.** The user shouldn't have to structure the data at capture time. A "sticky note" model — drop a note so you don't have to think about it again, and the app figures it out when you're ready.

Not: 10-15 minutes logging every activity extensively after each session.
Yes: a quick voice or text drop, async processing, structured output the app builds for you.

## Success in one year

- Used personally every week
- Adopted by others on their own devices
- Works across iOS, Android, and web
- Email as another input channel (send workout notes → app consumes and logs them)
- Account-based, not device-based — workouts live in the cloud, accessible anywhere
- No phone required to store workouts; any device or browser gets you in

## Progression tracking

Not just logging — also observing trends over time and being alerted when progress happens. Example: track bicep curls and see weight, reps, and sets increase over weeks/months. The app should surface that progression without the user having to go dig for it.

- Workout plans with defined exercises
- Progression metrics tracked per exercise (weight, reps, sets)
- Periodic digest / report (e.g. weekly) — not real-time push notifications
- Report surfaces progression: what improved, by how much, over what period
- Ability to compare past vs. current performance

## Constraints & Values

**License:** MIT — open source, not charging for it.

**Privacy:** Minimize data collection aggressively. Voice/text input may pass through LLMs or device assistants for transcription, but we don't store raw audio or health data. Be completely transparent with users about which third-party tools are used and point them to *those* services' privacy policies. We don't want to be on the hook for their data practices, and we don't want users to be surprised.

**Infrastructure:** On-device and local-first as much as possible. Minimal backend — small surface area for security and privacy reasons. If we have accounts/cloud sync, keep it as simple as possible.
