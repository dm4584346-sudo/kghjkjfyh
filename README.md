# DOTA PRO LAB — iOS-ready project (Phase 1–3)

**Personal Esports Training Academy** — existing local-first Dota 2 training and performance app, now prepared for iOS builds through Expo Application Services (EAS). Existing Phase 1–3 screens, training modules, analytics and SQLite migrations are retained.

## iOS / GitHub quick start

- Bundle identifier: `com.dotaprolab.mobile`
- App display name: `DOTA PRO LAB`
- Expo SDK 58 / React Native 0.88.1 / React 19.3 / TypeScript 5.9
- EAS profiles: `development`, `development-simulator`, `preview` (Ad Hoc IPA), `production` (App Store Connect)
- Native icon and splash assets: `assets/icon.png`, `assets/splash.png`
- GitHub Actions: `.github/workflows/ios-eas-build.yml` (requires the `EXPO_TOKEN` GitHub Secret and a linked EAS project)

Read **[docs/IOS_BUILD.md](docs/IOS_BUILD.md)** before the first build. The project has been prepared for EAS, but no real `.ipa` is included: creating a signed IPA requires an Expo account, a linked EAS project and Apple signing credentials.

```bash
npm install
npx expo install --fix
npx expo install --check
npx expo-doctor
npm run typecheck
npx expo start
```

To create a device-installable Ad Hoc IPA after registering your iPhone and configuring Apple signing:

```bash
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest build --platform ios --profile preview
```

For TestFlight/App Store distribution, use `--profile production`. An App Store production build is not directly sideloaded as an Ad Hoc app.

---

## Technology

- React Native 0.88 / Expo SDK 58
- TypeScript 5.9, Expo Router
- Expo SQLite with ordered migrations v1 → v2 → v3 → v4
- React Native SVG and Lucide icons
- OpenDota public REST API (optional network integration)
- No mandatory server, API key, subscription or account registration

## Requirements and launch

- Node.js 22.13+ and npm 10+
- An Expo Go client compatible with this project's SDK, or a development build
- Xcode on macOS for an iOS Simulator / native iOS build

```bash
npm install
npx expo install --fix
npm start
```

Run static type checking:

```bash
npm run typecheck
```

Check Expo dependency compatibility:

```bash
npx expo install --check
```

The ZIP deliberately excludes `node_modules`, local `.env`, build output and caches. Install dependencies on a machine with npm registry access. For a physical iPhone, use an SDK-compatible Expo Go client or build a development client following Expo's current instructions.

## Phase 1 — Foundation (retained)

- First-run onboarding and editable player profile.
- Home dashboard with current/target MMR, training summary and progress.
- Five-tab navigation: Home, Training, AI Coach, Analytics and Profile.
- Hero Pool, including Chaos Knight / Offlane and Skywrath Mage / Soft Support; no fabricated match metrics.
- Schedule with editable blocks, completion history, breaks and rest days.
- Dark esports design system and reusable UI components.
- Original SQLite migration v1 and local persistence.

## Phase 2 — Training System (retained)

### Local AI Coach and Situational Engine

- Curated offline situations with game minute, hero, role, allies/enemies, items, level, map state and objective.
- Position 3 / Position 4 plus additional Position 5 scenarios.
- Beginner, Intermediate, Advanced and Immortal-level exercise labels. These are scenario difficulty labels, not a rank certification.
- Multiple plausible decisions, trade-offs, feedback and a 10-point training rubric covering decision quality, context, risk, timing, teamwork and reasoning.
- Local coaching fallback works without network or AI credentials. Optional Gemini integration is isolated behind the HTTPS proxy boundary in `src/features/training/coachProvider.ts`; the app never contains a Gemini secret.

### Error repetition

- Lower-scoring exercises are saved in `ErrorReviewQueue`.
- Review intervals expand after successful attempts and shorten after failed attempts.
- Variants change parts of the context to avoid memorizing one static answer.

### Item Builder, Draft Trainer and Training Dashboard

- Item Builder records hero, position, draft context, current minute, owned items, available gold and selected purchase reasoning.
- Draft Trainer records position, allies/enemies, hero choice and written win condition.
- Training Dashboard displays actual scored situation attempts and review queue status.
- Item/Draft sessions are counted as practice coverage but are not assigned artificial scores.
- Item Builder reasoning prompts remain qualitative. When OpenDota item constants have been refreshed in Pro Analytics, the selected item can also show its cached catalog cost/description and sync timestamp; these constants may be stale and are not a patch-correctness guarantee. In-game tooltips and Valve patch notes remain authoritative.

## Phase 3 — Pro Analytics

### OpenDota connection

Open **Analytics → PRO ANALYTICS** to connect a public player profile.

Accepted input:
- 32-bit Steam account ID
- 17-digit SteamID64
- Public Steam profile URL (`/profiles/...`)
- Vanity profile URL (`/id/...`) or player name (resolved through OpenDota search)

The app does not request Steam credentials or Steam Guard codes. It imports the latest 30 available player match rows, the player's hero history and profile metadata. Match details are fetched only when the user opens a match. Data is cached in local SQLite and remains available offline. Search, connect, refresh and game-data refresh are user-initiated.

Current public API endpoints:
- `GET /search?q=...`
- `GET /players/{account_id}`
- `GET /players/{account_id}/matches?limit=30&offset=0`
- `GET /players/{account_id}/heroes`
- `GET /matches/{match_id}`
- `GET /heroes`, `GET /constants/items`, optional `GET /constants/hero_abilities`

OpenDota's current documentation describes 50,000 free calls/month and 60 requests/minute. This is a service policy, not a guarantee that the same free allowance or availability will remain forever. A profile sync uses three API calls; opening a previously unparsed match and refreshing constants adds more calls. See [docs/OPENDOTA.md](docs/OPENDOTA.md) for endpoints, quotas, failure cases and interpretation caveats.

### Replay Analyzer and personal performance

- Match list and per-match available stats: win/loss, duration, K/D/A, GPM, XPM, last hits, denies, net worth, level, hero damage, tower damage, items, and teamfight/lane metrics when returned by OpenDota.
- Period filters: 7 days, 30 days and all imported data.
- Summary includes win rate, GPM, XPM, deaths, KDA and last hits/minute.
- Hero summaries use the OpenDota player-hero endpoint for recorded match/win totals, while average KDA/GPM/XPM/deaths are calculated only from the currently selected imported match window. The UI labels these two samples separately.
- Role summaries are shown for Offlane, Soft Support and Hard Support when sample exists.
- Player-slot role mapping is an estimate, not confirmed lane assignment. User-facing labels disclose this.
- Match analysis never uses KDA alone as a judgment of performance.

This module is a parsed-stat inspector, **not** a video replay player or a full event-by-event replay timeline. Some matches may not be parsed or may return incomplete details. Missing values remain blank instead of being inferred.

### Hero mastery

- Imported per-hero recorded match/win totals appear for heroes in the player's OpenDota history; recent-window KDA/GPM/XPM/deaths remain limited to the locally imported match sample.
- Chaos Knight and Skywrath Mage remain visible as Phase 1 hero-pool placeholders when no match data exists; they display `—` rather than fake zero results.
- Practice tiers describe sample volume only; they are not a professional skill certificate.

### MMR Tracker

- Player can manually enter current MMR, goal and optional match result/delta.
- Preset goals: 3000, 3500 and 4000; custom whole-number goals are accepted.
- Historical chart uses manually entered snapshots and explicitly entered rating changes.
- A win/loss without a supplied MMR delta does not change the tracked rating.
- OpenDota's `mmr_estimate` is displayed only as a model estimate, never as official Steam MMR.

### Personal recommendations and Pro Schedule 2.0

- Recommendations are derived from real scored Situation Trainer attempts and sufficiently sized imported match samples.
- Match death counts can trigger a cautious review prompt only; the interface explains that deaths alone do not establish poor positioning.
- Item Builder and Draft Trainer coverage is measured, but ungraded sessions are not converted into invented weakness scores.
- Recommendations can be added to the existing training schedule subject to the daily training-minute target.
- Fatigue is user-selected for the current local day: Fresh, Normal, Tired (shorter plan) or Rest. A rest day prevents new recommendation blocks from being added; yesterday’s selection does not carry over. The recovery marker never deletes existing schedule blocks; switching back to a training readiness level removes only the app-generated marker. Suggested blocks are placed into a free time gap and must fit the remaining daily training-minute target.

### Game data and visual-situation contracts

- Hero/item/ability constants can be downloaded from OpenDota and cached in SQLite for offline lookup. Cached hero metadata enriches Hero Mastery, and cached item name/cost/description data is shown in Item Builder when available.
- Build's Valve patch reference is 7.42a (24 November 2026), verified 27 November 2026. It is a dated reference, not an auto-detected live patch feed. Check [docs/OPENDOTA.md](docs/OPENDOTA.md) and the official Valve news before making balance-dependent decisions.
- `src/features/visual-situations/contracts.ts` defines future-ready normalized map positions, units, health/mana, inventory, objectives and movement/action targets. It is a type contract only; the current textual Situation Trainer remains unchanged.

## Gemini architecture (optional)

The core app does not need Gemini, a key, an account or internet access. If you later operate a secure HTTPS proxy, configure `EXPO_PUBLIC_COACH_PROXY_URL` in a local `.env` file using `.env.example` as a template. The mobile app must never contain a Gemini API key or any secret in source code or `EXPO_PUBLIC_*`. The proxy is not included in this repository. Google's Gemini free tier is limited and subject to model, region, quota and policy changes; unlimited free use is not promised. Recheck official pricing before enabling the optional provider: https://ai.google.dev/gemini-api/docs/pricing

## SQLite migrations and tables

The app calls `initializeDatabase` on startup and applies ordered migrations through `PRAGMA user_version`.

| Version | Tables / changes |
|---|---|
| v1 (Phase 1) | `UserProfile`, `HeroPool`, `TrainingSchedule`, `TrainingSessions`, `MatchHistory`, `UserProgress`, `TrainingStatistics`, `Settings` |
| v2 (Phase 2) | `TrainingAttempts`, `ErrorReviewQueue`, `CoachNotes`, `DraftPractice`, `ItemPractice` |
| v3 (Phase 3) | `SteamLinks`, `OpenDotaMatches`, `MmrEntries`, `GameDataCache`, `PerformanceRecommendations`, indexes and legacy external-match de-duplication |
| v4 (Phase 3 hardening) | Rebuilds `OpenDotaMatches` with composite primary key `(match_id, account_id)` so the same public match can be cached separately for multiple linked players; preserves existing rows and recreates indexes. |

Do not delete the local SQLite database when upgrading. Migrations v1–v3 are preserved; v4 is additive and copies existing OpenDota match rows before replacing the table. Imported OpenDota rows are aggregated directly from the currently linked account; manual `MatchHistory` entries remain separate. See [docs/DATA_MODEL.md](docs/DATA_MODEL.md).

## Project structure

```text
app/
  _layout.tsx                    Root stack and SQLite provider
  onboarding/                    Phase 1 onboarding
  (tabs)/                        Home, Training, Coach, Analytics, Profile
  analytics/pro.tsx              Phase 3 Pro Analytics
  training/                      Situation Trainer, Item Builder, Draft Trainer, Dashboard
src/
  components/                    Reusable UI components
  constants/                     Design tokens
  db/                            SQLite schema migrations and repository
  features/
    extensions/                  Forward-compatible extension contracts
    game-data/                   Valve patch reference and data source catalog
    opendota/                    API client and SQLite ingestion/cache
    performance/                 Match summaries, trends and recommendations
    training/                    Scenarios, offline engine and optional coach provider
    visual-situations/           Future tactical board data contracts
  types/                          Shared domain types

docs/
  OPENDOTA.md                     API reference, quotas, endpoint map and limitations
  DATA_MODEL.md                   SQLite v1–v4 and account-scoping notes
CHANGELOG.md                      Phase history
```

## Reliability, offline behavior and known limitations

- Existing Phase 1 and Phase 2 features are retained; the OpenDota module is additive.
- Offline training, saved training history, cached OpenDota matches, constants and manual MMR tracking work locally.
- New profile/match/game-constant data requires internet and OpenDota availability.
- HTTP 404, 429, 5xx, timeout, network failure and missing/partial match data produce visible messages; cached data is not erased on request failure.
- Player role is only a slot-order estimate. Some public player profiles and matches may not be available.
- Current build imports 30 recent match rows per refresh; older match pagination is not included yet.
- Recommendations avoid interpreting unscored Item Builder / Draft Trainer activity as player weakness.
- Patch constants and cached game data may become stale; check Valve in-client information and current patch notes.
- Full TypeScript type checking, native compilation and physical iPhone validation require dependency installation and a working Expo/Xcode environment. Do not treat a static syntax check as a native runtime test.

## Useful official links

- OpenDota API reference: https://opendota.apidocumentation.com/
- OpenDota docs: https://docs.opendota.com/
- Valve Dota 2 updates: https://www.dota2.com/news
- Current build patch reference (7.42a): https://www.dota2.com/newsentry/689774670193362169
- Gemini pricing (optional): https://ai.google.dev/gemini-api/docs/pricing

### Reproducible installs

This archive does not contain a `package-lock.json` because package installation could not be completed in the preparation environment. After the first successful `npm install`, keep the generated `package-lock.json` under version control and use `npm ci` in future local/CI installs. The supplied GitHub Actions workflow currently uses `npm install` so it can bootstrap before a lockfile has been committed.
