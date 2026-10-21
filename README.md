# portfolio-bank

Personal project portfolio manager built with Expo Router (SDK 57), TypeScript and Plus Jakarta Sans.

## Setup

```bash
npm install
npx expo install @expo-google-fonts/plus-jakarta-sans expo-image-picker expo-sqlite @expo/vector-icons
npx expo start
```

Run `npx expo lint` and `npx tsc --noEmit` after the first start (typed routes are generated then).

## Structure

- `src/app/(tabs)` Home, Favourites, Status, Settings
- `src/app/project/[id].tsx` detail screen, `project/form.tsx` create and edit (modal)
- `src/context` projects store (persisted with `expo-sqlite/kv-store`) and theme mode
- `src/components` reusable UI (`ui.tsx`, `project-card.tsx`, `rich-text.tsx`, `live-badge.tsx`)
- `src/lib` types, storage helpers and the live URL health check
