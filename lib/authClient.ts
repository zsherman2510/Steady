import { expoClient } from '@better-auth/expo/client';
import { convexClient } from '@convex-dev/better-auth/client/plugins';
import * as SecureStore from 'expo-secure-store';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_CONVEX_SITE_URL ?? '',
  plugins: [
    convexClient(),
    expoClient({
      scheme: 'steady',
      storagePrefix: 'steady',
      storage: SecureStore,
    }),
  ],
});
