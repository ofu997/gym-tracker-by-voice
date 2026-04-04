# Accessibility

Build accessibly from the start — retrofitting is significantly harder. This doc defines the standards and commitments for the web app (MVP) and mobile (V1+).

---

## Target Standard

**WCAG 2.1 AA** — the broadly accepted baseline for web accessibility and the target for most legal compliance requirements (ADA, EN 301 549).

---

## Web App (MVP)

### Interaction

**Voice input is inherently accessible** for users with motor impairments — it removes the need to type or navigate menus. This is a core product value, not just a feature.

**All functionality must also be keyboard-accessible.** Voice input is the preferred path, but users who cannot or prefer not to use voice must be able to do everything with a keyboard alone:
- Tab order follows a logical reading flow
- All interactive elements are reachable via Tab
- No keyboard traps
- Focus is visible at all times (do not suppress the focus ring)

**No functionality requires a mouse or touch gesture alone.** Every action available by click or swipe must also be available via keyboard.

### Visual

- **Color contrast:** minimum 4.5:1 for body text, 3:1 for large text and UI components (WCAG AA)
- **Color is never the sole indicator** of meaning — icons, labels, or patterns must accompany color-coded information (e.g. progression charts, drift indicators)
- **Text resize:** UI must remain functional when browser text size is increased up to 200%
- **No content flashes** more than 3 times per second (seizure safety)

### Content

- All images and icons have descriptive `alt` text or `aria-label`
- Form inputs have associated `<label>` elements — no placeholder-only labeling
- Error messages identify the field in error and describe what's wrong in plain language
- Page has a meaningful `<title>` that updates on navigation
- Headings follow a logical hierarchy (`h1` → `h2` → `h3`) — not used for styling

### Semantic HTML

- Use semantic elements (`<nav>`, `<main>`, `<section>`, `<button>`, `<input>`) rather than `<div>` for everything
- Interactive elements that are not natively focusable (custom components) must have appropriate ARIA roles and attributes
- Charts (progression graphs, digest reports) must have a text alternative — either a data table or a descriptive summary — for screen reader users

### Voice Input Disclosure

The browser voice input permission prompt is browser-native and accessible. The app's own UI around it must:
- Clearly label the microphone button
- Indicate recording state visually **and** with an `aria-live` region (so screen readers announce when recording starts and stops)
- Provide a text input fallback on the same screen — voice is never the only option

---

## Mobile App — Expo (V1+)

- Follow platform accessibility guidelines: iOS Human Interface Guidelines (accessibility) and Android Accessibility Guidelines
- Use React Native's built-in accessibility props: `accessible`, `accessibilityLabel`, `accessibilityRole`, `accessibilityHint`
- Support Dynamic Type (iOS) and font scaling (Android) — no fixed font sizes
- Minimum touch target size: 44×44pt (iOS) / 48×48dp (Android)
- Test with VoiceOver (iOS) and TalkBack (Android) before each release

---

## Testing

Accessibility is verified as part of the pre-merge checklist (see `/hacky-hours checklist`). Minimum checks before any UI task is called done:

- [ ] Keyboard navigation works for all new interactions
- [ ] Color contrast passes for any new UI elements (use a contrast checker)
- [ ] New form inputs have labels
- [ ] New images/icons have alt text or aria-labels
- [ ] New dynamic content has appropriate `aria-live` regions if it updates without a page reload

**Recommended tools:**
- axe DevTools (browser extension) — automated WCAG checks
- Chrome Lighthouse — accessibility audit
- Keyboard-only manual test — tab through every new interaction

---

## Known Constraints

- **Progression charts** — data visualization is inherently visual. Every chart must have a text alternative (table or summary) for screen reader users. This applies from the first chart shipped.
- **Web Speech API** — not universally supported. The app must always provide a text input alternative. Never gate any functionality on voice being available.
- **Browser-dependent voice support** — screen reader users on some browsers may have conflicts between the screen reader and the Web Speech API. Test with NVDA + Chrome and VoiceOver + Safari.
