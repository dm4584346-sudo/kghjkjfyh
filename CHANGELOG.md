# Changelog

## iOS Build & GitHub preparation — 27 November 2026

- Continued the existing Phase 1–3 project; retained Expo Router screens, training modules, OpenDota integration and SQLite migration history v1–v4.
- Added native app icon and splash artwork under `assets/`.
- Configured iOS bundle ID `com.dotaprolab.mobile`, display name, portrait orientation, dark appearance, build number and app-version runtime policy.
- Added SDK 58-compatible `expo-splash-screen` and `expo-dev-client` dependencies and config plugins.
- Added EAS profiles for development device, iOS simulator, Ad Hoc preview and App Store production builds.
- Added GitHub Actions workflow with TypeScript, Expo dependency, Expo Doctor and EAS build stages. EAS token is read from GitHub Secrets.
- Hardened the existing bottom tab bar to respect iPhone safe-area insets.
- Added `.gitignore`, `.nvmrc`, iOS/EAS/GitHub setup guide and updated README.
- No API keys, Apple certificates, provisioning profiles, or credentials are included.

### Validation boundary

Static configuration and source audits were performed. A native EAS build and physical iPhone test were not performed because no Expo/Apple credentials or connected iPhone were available. No IPA is included in this archive.

## Phase 3 — Pro Analytics

- OpenDota profile linking, match history, game constants cache, performance analysis, hero mastery, MMR tracking and recommendations.
- SQLite migration v4 with account-scoped match identity.

## Phase 2 — Training System

- Offline Situational Engine, AI Coach fallback, Error Repetition, Item Builder, Draft Trainer and training dashboard.

## Phase 1 — Foundation

- Expo Router app shell, local SQLite database, onboarding, profile, hero pool, schedule and progress foundation.
