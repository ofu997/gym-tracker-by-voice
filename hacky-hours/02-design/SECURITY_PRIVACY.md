# Security & Privacy

This product is built around a strong privacy stance: collect as little as possible, keep it local, be transparent about every third party that touches user data. See PRODUCT_OVERVIEW.md — Constraints & Values for the founding intent.

---

## Data Inventory

What this app stores and where:

| Data | Stored? | Where | Notes |
|------|---------|-------|-------|
| OAuth identity (provider + subject ID) | Yes | Local device | No email, name, or profile data stored |
| Workout sessions | Yes | Local device | Free-form notes, session type, health state |
| Sets (exercise, weight, reps) | Yes | Local device | Atomic workout data |
| Exercise library | Yes | Local device | User's canonical names and aliases |
| Workout plans and targets | Yes | Local device | Plan configuration and progression sequence |
| Digest reports | Yes | Local device | Saved as Markdown |
| Raw audio | **No** | — | Discarded immediately after transcription |
| Voice transcriptions | **No** | — | Processed by LLM then discarded |
| Email address | **No** | — | Never requested or stored |
| Display name / profile photo | **No** | — | Fetched from OAuth token at session time only |
| Health or medical data | **No** | — | `health_state` is free-form workout context only, not medical data |

---

## Trust Boundaries

Points where user data leaves the device:

### 1. OAuth2 Authentication (Google, Microsoft)

**What crosses the boundary:** the OAuth flow redirects to Google or Microsoft. The app receives an access token and subject ID. No workout data is involved.

**What this app receives:** subject ID (used as user identifier), display name (used in UI only, never stored), OAuth token (stored in browser secure storage for session duration).

**User's relationship:** governed by Google's and Microsoft's own privacy policies. The app links to these at sign-in.

**Our responsibility:** store only the subject ID. Never store email, name, or profile data. Rotate tokens securely. Never log tokens.

---

### 2. Cloud LLM API (input parsing)

**What crosses the boundary:** when a user submits a voice or text workout note, the transcribed text is sent to a cloud LLM API (OpenAI or Anthropic) for parsing into structured data.

**What is sent:** the text of the workout note — e.g. "bench press 3 sets 8 reps 185lbs, shoulder felt tight." No user identity, no account information, no prior workout history is included in the API call.

**What is received:** structured JSON representing the parsed workout. Nothing else is stored.

**User's relationship:** the workout note text is processed under the LLM provider's API terms of service and privacy policy. The app discloses this clearly before the user submits their first note and links to the provider's privacy policy.

**Our responsibility:**
- Disclose the LLM provider in-app before first use
- Link to the provider's privacy policy
- Never include user identity or history in API calls
- Do not log API requests or responses
- Structure the LLM integration behind a swappable interface (to support on-device models in V1+)

---

### 3. Web Speech API (voice transcription)

**What crosses the boundary:** the browser's built-in Web Speech API handles voice-to-text. On most browsers this sends audio to the browser vendor's servers (Google for Chrome, Microsoft for Edge) for transcription.

**What is sent:** the audio captured during the voice input session.

**User's relationship:** governed by the browser vendor's privacy policy (Google Chrome, Microsoft Edge, etc.). The app discloses this clearly.

**Our responsibility:**
- Disclose that voice input uses the browser's built-in speech API and that audio may be processed by the browser vendor
- Link to relevant browser privacy documentation
- Never access the raw audio stream directly — use only the transcribed text result

---

## What We Are Not Responsible For

The following are governed by third-party terms and privacy policies, not ours:

- How Google handles OAuth tokens and authentication data
- How Microsoft handles OAuth tokens and authentication data
- How the LLM provider (OpenAI or Anthropic) handles API request data
- How the browser vendor handles Web Speech API audio

The app's responsibility is to **disclose** these relationships clearly and link users to the relevant policies. We do not make representations about third-party data practices.

---

## Local Storage Security

All workout data is stored in the browser's local storage layer (IndexedDB or SQLite WASM).

**Protections:**
- Data is scoped to the app's origin — other sites cannot access it
- OAuth tokens are stored in `sessionStorage` or equivalent secure browser storage, not `localStorage`
- No sensitive data is written to `localStorage` (which persists across sessions without expiry)

**Limitations:**
- Browser storage is not encrypted at rest on most platforms — a user with physical device access could read it
- This is an accepted tradeoff for MVP given the nature of the data (workout logs, not financial or medical records)
- Encryption at rest is a V1+ consideration, particularly for the mobile app where device-level encryption is more accessible

---

## Threat Model

What we are protecting against:

| Threat | Mitigation |
|--------|-----------|
| Unauthorized access to another user's data | All data is local — there is no server-side user data store in MVP |
| OAuth token theft | Tokens stored in secure browser storage; never logged or exposed in URLs |
| LLM API key exposure | API key stored in environment config, never in client-side code or committed to git |
| Third-party LLM storing sensitive data | Workout notes contain no PII; provider terms disclosed to user |
| Accidental health data collection | `health_state` field is workout context only; app never prompts for medical information |
| XSS accessing local storage | Standard React XSS mitigations; no `dangerouslySetInnerHTML` |

What we are **not** protecting against (out of scope for MVP):

- Physical device access by a malicious actor
- Browser-level vulnerabilities
- Third-party provider data breaches (disclosed, not our liability)

---

## Required User Disclosures

The following must be disclosed to the user before first use, in plain language:

1. **LLM parsing:** "When you submit a workout note, the text is sent to [Provider] to be understood and structured. [Provider]'s privacy policy applies to that data: [link]."
2. **Voice input:** "Voice input uses your browser's built-in speech recognition. Your browser may send audio to [Browser Vendor] to process it. [Browser Vendor]'s privacy policy applies: [link]."
3. **OAuth:** "Signing in with Google or Microsoft means your sign-in is handled by them. We only receive a unique ID to identify your account — we don't store your email or name."

These disclosures must be shown before the relevant feature is first used, not buried in a terms of service document.

---

## V1+ Considerations

- **On-device LLM:** eliminates the cloud LLM trust boundary entirely — workout notes never leave the device. Deferred due to WebGPU compatibility limitations (particularly iOS Safari). See ARCHITECTURE.md.
- **Encryption at rest:** relevant once the mobile app ships — iOS Keychain and Android Keystore provide device-level encryption for sensitive local data.
- **LLM provider configurability:** users may want to bring their own API key or choose their preferred provider.
