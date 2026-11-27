# DOTA PRO LAB — iOS preparation status

## Audit of the supplied Phase 3 archive

| Area | Finding |
|---|---|
| Expo | `~58.0.26` (SDK 58) |
| React Native / React | `0.88.1` / `19.3.0` |
| TypeScript | `~5.9.2` |
| Navigation | Expo Router `~58.0.32`, `expo-router/entry` |
| Local persistence | `expo-sqlite ~58.0.18`, existing migration sequence v1–v4 retained |
| iOS bundle ID | `com.dotaprolab.mobile` |
| Safe areas | Existing `SafeAreaView` wrapper; tab bar adjusted for bottom inset |
| Network | OpenDota uses HTTPS; optional Gemini is a proxy URL, no client-side Gemini secret |
| Permissions | No app-level camera, microphone, contacts, location or tracking permissions configured |
| Android-only blockers | None identified in the dependency manifest or app source |
| Secret scan | No hard-coded API keys/certificates/passwords identified; `.env` ignored |

## Changes in this preparation

- iOS icon and splash assets created.
- `app.json` includes iOS bundle identifier, build number, dark appearance, portrait orientation, splash plugin and runtime version policy.
- `expo-splash-screen ~58.0.15` and `expo-dev-client ~58.0.21` added, matching SDK 58 documentation.
- `eas.json` defines development, simulator, preview and production profiles.
- GitHub Actions workflow validates TypeScript/dependencies and starts/waits for EAS iOS builds.
- `.gitignore`, `.nvmrc`, README, CHANGELOG and `docs/IOS_BUILD.md` updated.

## Not completed / requires owner accounts

- `eas init` must be run by the project owner to generate and attach a real `extra.eas.projectId`.
- EAS account login and Expo access token are required for remote builds and GitHub Actions.
- Apple Developer team/signing credentials are required for Ad Hoc IPA and App Store distribution. The target iPhone must be registered for Ad Hoc installation.
- Dependency install, `tsc --noEmit`, Expo Doctor, native iOS compilation and physical iPhone testing were not executed in this environment. Run the commands in `docs/IOS_BUILD.md` on a machine with npm registry access.
- No `.ipa` is claimed or included.
