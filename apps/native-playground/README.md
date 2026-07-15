# Intelli Native Playground

Expo app that demos `@intelli/ui-native` components inside the monorepo.

**SDK:** Expo 56 (React Native 0.85) — chosen so the App Store / Play Store **Expo Go** app can open the project via QR. Expo SDK 57’s Expo Go build is not always available on the stores yet.

## Run

From the monorepo root:

```bash
pnpm install
pnpm native
```

Or from this directory:

```bash
pnpm dev
```

Then:

1. Make sure phone and computer are on the **same Wi‑Fi**
2. Open **Expo Go** (updated) and scan the QR code
3. Or press `i` / `a` / `w` for simulator / emulator / web

If Expo Go still refuses the project, clear cache and restart:

```bash
pnpm --filter native-playground exec expo start --clear
```

## Troubleshooting “Something went wrong”

| Cause | Fix |
|--------|-----|
| Expo Go SDK ≠ project SDK | Use Expo Go that supports **SDK 56**, or update Expo Go |
| Stale Metro cache | `expo start --clear` |
| Wrong LAN / firewall | Same Wi‑Fi; try tunnel: `expo start --tunnel` |
| Outdated deps | From app dir: `npx expo install --fix` then reinstall from monorepo root |

## Monorepo notes

- Workspace package: `@intelli/ui-native` (`packages/ui-native`)
- Metro watches the monorepo root so library edits hot-reload
- `babel.config.js` uses `babel-preset-expo` (required)
- Optional glass blur: `expo-blur`
- Safe area: `react-native-safe-area-context`
- Web: `react-native-web` + `react-dom` + `@expo/metro-runtime`

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` / `start` | Expo dev server |
| `pnpm ios` | Open iOS |
| `pnpm android` | Open Android |
| `pnpm web` | Open web |
| `pnpm check-types` | TypeScript check |
