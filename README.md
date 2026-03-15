# Steady

Steady is a mobile app concept for people who stutter to practice real-world speaking with less pressure.

## Stack
- Expo / React Native
- Convex
- Better Auth integrated with Convex

## Included
- Calm premium dark theme
- Welcome / onboarding screen
- Email/password authentication with Better Auth + Convex
- Home dashboard placeholder
- Scenario library placeholder
- Rewrite-my-sentence placeholder
- AI practice placeholder
- Daily challenge placeholder
- Progress placeholder
- Convex schema and auth backend scaffolding

## Run
```bash
npm install
npx convex dev
npx expo start
```

## Environment
```bash
cp .env.example .env.local
```

Set:
- `EXPO_PUBLIC_CONVEX_URL`
- `EXPO_PUBLIC_CONVEX_SITE_URL`
- `CONVEX_DEPLOYMENT` if you want the Convex CLI to skip interactive project configuration

Set server-side admin accounts in Convex:
```bash
npx convex env set ADMIN_EMAILS "admin@example.com"
```

## Auth model
- Expo client sessions are stored with `expo-secure-store`
- Better Auth handles authentication
- Convex enforces authorization in backend functions
- App profile data is scoped to the authenticated user

## GitHub
```bash
git remote add origin https://github.com/zsherman2510/Steady.git
git branch -M main
git push -u origin main
```
