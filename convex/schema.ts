import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  profiles: defineTable({
    authUserId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    primaryGoal: v.optional(v.string()),
    speakingSituations: v.array(v.string()),
    confidenceLevel: v.optional(v.number()),
    selectedPlan: v.optional(v.union(v.literal('yearly'), v.literal('weekly'))),
    onboardingCompleted: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_auth_user_id', ['authUserId']),
  scenarios: defineTable({
    title: v.string(),
    category: v.string(),
    prompt: v.string(),
  }),
  practiceSessions: defineTable({
    authUserId: v.string(),
    scenarioId: v.optional(v.id('scenarios')),
    mode: v.string(),
    notes: v.optional(v.string()),
    confidenceBefore: v.optional(v.number()),
    confidenceAfter: v.optional(v.number()),
    createdAt: v.number(),
  }).index('by_auth_user_id', ['authUserId']),
  dailyChallenges: defineTable({
    title: v.string(),
    description: v.string(),
    difficulty: v.string(),
  }),
});
