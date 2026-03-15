import { expo } from '@better-auth/expo';
import { createClient } from '@convex-dev/better-auth';
import type { GenericCtx } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { betterAuth } from 'better-auth';
import { components } from './_generated/api';
import type { DataModel } from './_generated/dataModel';
import authConfig from './auth.config';

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth({
    baseURL: process.env.CONVEX_SITE_URL ?? '',
    basePath: '/api/auth',
    database: authComponent.adapter(ctx),
    trustedOrigins: ['steady://'],
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      minPasswordLength: 10,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24,
    },
    user: {
      additionalFields: {
        role: {
          type: ['user', 'admin'],
          required: false,
          defaultValue: 'user',
          input: false,
        },
      },
    },
    plugins: [expo(), convex({ authConfig })],
  });

export const { getAuthUser } = authComponent.clientApi();
