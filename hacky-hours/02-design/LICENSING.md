# Licensing

---

## Chosen License

**MIT License**

Open source. Free to use, modify, and distribute. No charge for the software.

**Rationale:** personal and community project, no commercial IP to protect. MIT is the most permissive and widely understood open source license — compatible with virtually all dependencies and imposes no obligations on users or contributors beyond attribution.

A `LICENSE` file must exist at the project root before the first release. See `/hacky-hours audit` — it checks for this.

---

## What MIT Means for Dependencies

MIT is permissive — it is compatible with most open source licenses. The constraint to watch for is **copyleft licenses** (GPL, AGPL), which require derivative works to be released under the same license. Including a GPL dependency in an MIT project forces the whole project to GPL.

**Compatible with MIT (safe to use):**
- MIT
- Apache 2.0
- BSD (2-clause, 3-clause)
- ISC

**Incompatible or requires review:**
- GPL v2 / v3 — copyleft, forces GPL on the whole project
- AGPL — like GPL but also applies to network use (SaaS)
- LGPL — copyleft but with a linking exception; generally safe for dynamic linking, review carefully

**Rule:** before adding any dependency, check its license. If it is GPL or AGPL, do not add it without a deliberate decision and a note in this doc.

---

## Known Dependencies and License Status

Dependencies are added here as they are chosen during development. Not all dependencies are known at design time — this table grows during the build phase.

| Dependency | License | Compatible? | Notes |
|------------|---------|-------------|-------|
| React | MIT | ✅ | |
| Vite | MIT | ✅ | |
| TypeScript | Apache 2.0 | ✅ | |
| Expo (V1+) | MIT | ✅ | Mobile app |
| Anthropic SDK | MIT | ✅ | If Anthropic chosen as LLM provider |
| OpenAI SDK | Apache 2.0 | ✅ | If OpenAI chosen as LLM provider |
| Web Speech API | Browser built-in | N/A | No library license; governed by browser vendor terms |

*Add rows here as dependencies are introduced. Check license before adding — do not add GPL or AGPL dependencies without a deliberate decision.*

---

## LLM Provider Terms

Using a cloud LLM API (OpenAI or Anthropic) involves agreeing to the provider's API terms of service, separate from our open source license. Key considerations:

- **Training on API data:** both OpenAI and Anthropic state they do not use API request data to train models by default (as of their current terms). Confirm this holds at build time — terms change.
- **Output ownership:** both providers' terms grant the user ownership of outputs generated via the API.
- **MIT compatibility:** our license covers our code, not the LLM provider's model or service. These are independent.

---

## Contributor License

By contributing to this project, contributors agree that their contributions are licensed under the same MIT license. No CLA (Contributor License Agreement) is required for MVP — this is standard for MIT projects.
