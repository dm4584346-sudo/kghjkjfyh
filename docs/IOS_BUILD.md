# iOS build, signing and GitHub integration

This guide applies to the existing DOTA PRO LAB Expo project. It does not replace the app or its SQLite database.

## Audit snapshot (27 November 2026)

- Expo SDK: `~58.0.26`
- React Native: `0.88.1`
- React: `19.3.0`
- TypeScript: `~5.9.2`
- Expo Router: `~58.0.32`, entry point `expo-router/entry`
- SQLite: `expo-sqlite ~58.0.18`, database provider and ordered migrations v1–v4 retained
- iOS bundle identifier: `com.dotaprolab.mobile`
- Network: OpenDota requests use HTTPS; Gemini remains an optional HTTPS proxy URL only
- Secret scan: no hard-coded API token, private key, Apple certificate or password found in source/configuration. `.env` files are ignored; `.env.example` contains only an empty variable.
- Native permissions: no camera, microphone, contacts, location or tracking permission is requested by the app. Network access is used for optional OpenDota/Gemini-proxy features.
- Safe areas: reusable screens already use `react-native-safe-area-context`; the tab bar now accounts for the iPhone bottom inset.
- SQLite: database name and migration initialization are unchanged. `expo-sqlite` persists the local database across app restarts.

The package manifest versions align with Expo SDK 58's React Native 0.88 / React 19.3 matrix. `expo-splash-screen ~58.0.15` and `expo-dev-client ~58.0.21` are added for native splash and development builds. This static audit is not a successful native compile or physical-device test: dependency installation and EAS signing require your own connected accounts and build environment.

## Local setup

Requirements: Node.js `22.13.x` or newer in the Node 22 line, npm, Git. For a local native build, Expo SDK 58 requires the Xcode toolchain documented for SDK 58 (currently Xcode 26.4+ and iOS deployment target 16.4+). A Mac with Xcode is optional if using EAS cloud builds; EAS performs the native iOS build in the cloud.

```bash
npm install
npx expo install --fix
npx expo install --check
npx expo-doctor
npm run typecheck
npx expo start
```

For a development client build, the project includes `expo-dev-client`:

```bash
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform ios --profile development
```

## Link this project to EAS once

1. Create/sign in to an Expo account.
2. From this project root, run `npx eas-cli@latest login`.
3. Run `npx eas-cli@latest init` and select/create the DOTA PRO LAB EAS project.
4. EAS writes `extra.eas.projectId` into app config. Commit that project ID; it is an identifier, not a secret.
5. Run `npx eas-cli@latest build:configure` only if you want EAS to re-check configuration. The supplied `eas.json` is already configured.

Do not invent a project ID or paste a placeholder. No EAS project ID is embedded yet because the owner must create/link the project under their own Expo account.

## Build profiles

- `development`: development client, internal distribution. Requires a registered iPhone for direct device install.
- `development-simulator`: iOS Simulator build; cannot be installed on a physical iPhone.
- `preview`: internal Ad Hoc iOS distribution, intended for registered test devices. This is the profile to use for a directly installable test IPA.
- `production`: App Store Connect distribution. Use for TestFlight/App Store processing; it is not an Ad Hoc sideload build.

Commands:

```bash
npx eas-cli@latest build --platform ios --profile development
npx eas-cli@latest build --platform ios --profile development-simulator
npx eas-cli@latest build --platform ios --profile preview
npx eas-cli@latest build --platform ios --profile production
```

A successful iOS EAS build produces an actual `.ipa` artifact. This repository does not contain a fake or renamed IPA. The artifact is downloaded from the build page/link returned by EAS.

## Apple signing and installing on iPhone

For EAS cloud signing and distributing an Ad Hoc IPA, an Apple Developer Program team, valid signing credentials and a registered device are required. EAS can create/manage the distribution certificate and provisioning profile after you sign in to the correct Apple team:

```bash
npx eas-cli@latest credentials --platform ios
npx eas-cli@latest device:create
npx eas-cli@latest build --platform ios --profile preview
```

Register the iPhone's UDID through the EAS device-registration flow before building the Ad Hoc profile. Download the resulting `.ipa` from the EAS build page and install using the EAS installation link / Apple Configurator / an appropriate Apple device-management workflow. The device must be included in the Ad Hoc provisioning profile. A production App Store IPA is installed through TestFlight or the App Store, not by directly opening the IPA.

Apple states that Developer Program enrollment requires the legal age of majority in the enrollee's region; the annual program membership fee is USD 99 (local pricing may differ). If the developer is not legally old enough to enroll, an eligible parent/guardian or organization must be the actual account holder and accept Apple's agreements. Do not misstate age or use another person's credentials without their involvement and authorization. A free Apple developer account can be used for Xcode device testing, but does not provide the same Ad Hoc/TestFlight distribution entitlements.

Official Apple references:
- Program enrollment and age/fee: https://developer.apple.com/help/account/membership/program-enrollment/
- Register devices: https://developer.apple.com/help/account/devices/devices-overview
- Ad Hoc provisioning: https://developer.apple.com/help/account/provisioning-profiles/create-an-ad-hoc-provisioning-profile

## GitHub

Create a private or public repository, then from the project root:

```bash
git init
git add .
git commit -m "Prepare DOTA PRO LAB for iOS EAS builds"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/dota-pro-lab.git
git push -u origin main
```

Replace the remote with the repository URL you created. `.gitignore` excludes dependencies, native generated directories, local environment files, certificates, provisioning profiles and IPA/build artifacts. Never commit `.env`, `.p8`, `.p12`, `.mobileprovision`, `.cer`, `.pem`, `.key` or Apple passwords.

## GitHub Actions automation

Workflow: `.github/workflows/ios-eas-build.yml`

1. Link the repository to the EAS project first (`eas init`) and commit the resulting `extra.eas.projectId`.
2. Create an Expo access token in your Expo account.
3. In GitHub repository **Settings → Secrets and variables → Actions**, create secret `EXPO_TOKEN`.
4. Push to `main` or run **Actions → iOS EAS Build → Run workflow** and choose `development`, `preview` or `production`.
5. The workflow installs packages, runs TypeScript, `expo install --check`, Expo Doctor, then runs EAS Build and waits for completion. Build output and its EAS artifact URL are recorded in the workflow summary; the log is uploaded as an artifact.

The YAML contains no credentials. `EXPO_TOKEN` is read only from GitHub Secrets. Apple credentials should be stored/managed by EAS Credentials, not committed to GitHub. For protected production releases, consider requiring manual approval through a GitHub Environment.

## Troubleshooting

- `EAS project not configured`: run `eas init`, then commit the generated `extra.eas.projectId`.
- Missing `EXPO_TOKEN` in Actions: add the GitHub Actions secret exactly with that name.
- Signing/provisioning error: inspect `eas credentials --platform ios`, confirm the Apple team and register the target iPhone for Ad Hoc builds.
- iOS device cannot install preview build: check that the device UDID is present in the provisioning profile; rebuild after adding it.
- `expo install --check` reports mismatches: run `npx expo install --fix`, review the diff, then rerun checks.
- SQLite data: keep the database name `dota-pro-lab.db` and never delete migration history. Existing local data remains on-device when updating the app with the same bundle identifier and compatible signing identity; uninstalling the app may remove its sandbox data.

## Test status

The supplied ZIP was audited statically. No native iOS build was run in this environment, no Apple credentials were available, and no physical iPhone was connected. Before release, run the validation commands above and complete a preview build on a registered iPhone, then verify onboarding, tabs, profile, local training, coach, analytics and database persistence on device.
