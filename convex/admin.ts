import { query } from './_generated/server';
import { requireRole } from './lib/authz';

export const listProfiles = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, ['admin']);

    return await ctx.db.query('profiles').collect();
  },
});
