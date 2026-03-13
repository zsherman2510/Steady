import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    confidenceLevel: v.optional(v.number())
  }),
  scenarios: defineTable({
    title: v.string(),
    category: v.string(),
    prompt: v.string()
  }),
  practiceSessions: defineTable({
    userId: v.id('users'),
    scenarioId: v.optional(v.id('scenarios')),
    mode: v.string(),
    notes: v.optional(v.string()),
    confidenceBefore: v.optional(v.number()),
    confidenceAfter: v.optional(v.number())
  }),
  dailyChallenges: defineTable({
    title: v.string(),
    description: v.string(),
    difficulty: v.string()
  })
});
