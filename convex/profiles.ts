import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { authComponent } from './auth';
import { getProfileByAuthUserId, requireAuthUser, resolveUserRole } from './lib/authz';

export const getViewerState = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      return null;
    }

    const profile = await getProfileByAuthUserId(ctx, authUser._id);
    const role = resolveUserRole(authUser as { email?: string | null; role?: string | null });

    return {
      user: {
        id: authUser._id,
        email: authUser.email ?? '',
        name: authUser.name ?? '',
        role,
        emailVerified: Boolean(authUser.emailVerified),
      },
      profile,
      permissions: {
        canManageContent: role === 'admin',
      },
    };
  },
});

export const ensureCurrentProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await requireAuthUser(ctx);
    const existing = await getProfileByAuthUserId(ctx, authUser._id);
    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: authUser.name ?? existing.name,
        email: authUser.email ?? existing.email,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert('profiles', {
      authUserId: authUser._id,
      name: authUser.name ?? undefined,
      email: authUser.email ?? undefined,
      speakingSituations: [],
      onboardingCompleted: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const saveOnboarding = mutation({
  args: {
    selectedPlan: v.union(v.literal('yearly'), v.literal('weekly')),
    primaryGoal: v.string(),
    speakingSituations: v.array(v.string()),
    confidenceLevel: v.number(),
  },
  handler: async (ctx, args) => {
    const authUser = await requireAuthUser(ctx);
    const existing = await getProfileByAuthUserId(ctx, authUser._id);
    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: authUser.name ?? existing.name,
        email: authUser.email ?? existing.email,
        primaryGoal: args.primaryGoal,
        speakingSituations: args.speakingSituations,
        confidenceLevel: args.confidenceLevel,
        selectedPlan: args.selectedPlan,
        onboardingCompleted: true,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert('profiles', {
      authUserId: authUser._id,
      name: authUser.name ?? undefined,
      email: authUser.email ?? undefined,
      primaryGoal: args.primaryGoal,
      speakingSituations: args.speakingSituations,
      confidenceLevel: args.confidenceLevel,
      selectedPlan: args.selectedPlan,
      onboardingCompleted: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});
