# Android TWA — Pratibha Khoj / Rurally Smile Foundation

Wraps the live Next.js site (`https://rurallysmile-org.vercel.app`) as a
Play Store app using Trusted Web Activity. Website updates via GitHub → Vercel
appear in the app automatically (no new AAB unless native TWA config changes).

## Defaults

| Field | Value |
| --- | --- |
| Package ID | `org.rurallysmile.app` |
| Host | `rurallysmile-org.vercel.app` |
| Start URL | `/` |
| Theme | `#0F766E` |

## Prerequisites

- JDK 17+
- Android SDK / command-line tools
- Node.js 20+
- Google Play Console account

## 1. Deploy PWA first

Set Vercel env:

```env
NEXT_PUBLIC_SITE_URL=https://rurallysmile-org.vercel.app
```

After deploy, smoke-check:

```bash
# from repo root
npm run android:verify:prod

# or against local `npm run start` in client/
npm run android:verify
```

Expected `200` URLs:

- https://rurallysmile-org.vercel.app/manifest.webmanifest
- https://rurallysmile-org.vercel.app/sw.js
- https://rurallysmile-org.vercel.app/.well-known/assetlinks.json
- https://rurallysmile-org.vercel.app/icons/icon-512.png

## 2. Generate TWA project (Bubblewrap)

From this folder:

```bash
cd android-twa
npm run init
```

When prompted, use values from `twa-manifest.json` (package `org.rurallysmile.app`,
host `rurallysmile-org.vercel.app`). Create a **new release keystore** and store
passwords in a password manager — never commit them.

Alternative non-interactive path after PWA is live:

```bash
npx @bubblewrap/cli init \
  --manifest https://rurallysmile-org.vercel.app/manifest.webmanifest \
  --directory ./generated
```

## 3. Build Play Store AAB

```bash
npm run build
```

Output is typically:

`android-twa/generated/app/build/outputs/bundle/release/app-release-bundle.aab`

## 4. Get SHA-256 and update Digital Asset Links

```bash
npm run fingerprint
```

Or:

```bash
keytool -list -v -keystore ./android.keystore -alias android
```

Copy the **SHA-256** fingerprint into:

`client/public/.well-known/assetlinks.json`

Replace `REPLACE_WITH_RELEASE_KEYSTORE_SHA256`, then commit and redeploy Vercel.

Verify:

```text
https://rurallysmile-org.vercel.app/.well-known/assetlinks.json
```

Google’s statement list tool:

https://developers.google.com/digital-asset-links/tools/generator

## 5. Play Console upload checklist

1. Create app: **Pratibha Khoj 2026** / Rurally Smile Foundation
2. Upload the signed `.aab`
3. Store listing (Hindi + English short/full description)
4. Screenshots from phone (home, registration, admit card, result)
5. Privacy policy URL: `https://rurallysmile-org.vercel.app/privacy-policy`
6. Content rating questionnaire
7. Data safety: same as website (registration PII via HTTPS); no extra native collection
8. Target audience / news apps declarations as applicable
9. Production rollout only after Asset Links verification succeeds (URL bar should be hidden in TWA)

## Security

Do **not** commit:

- `*.keystore` / `*.jks`
- keystore passwords
- `generated/` build trees with secrets

See `.gitignore` in this folder.

## Updating the website later

```text
VS Code edit → GitHub push → Vercel auto deploy → App shows new site
```

Rebuild/upload AAB only when changing package name, signing key, host, or native TWA settings.
