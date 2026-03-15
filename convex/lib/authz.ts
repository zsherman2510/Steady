import { ConvexError } from 'convex/values';
import { authComponent } from '../auth';
import type { MutationCtx, QueryCtx } from '../_generated/server';

type Ctx = QueryCtx | MutationCtx;
type UserRole = 'user' | 'admin';

export function resolveUserRole(user: { email?: string | null; role?: string | null }) {
  const configuredAdmins = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((value: string) => value.trim().toLowerCase())
    .filter(Boolean);

  if (user.email && configuredAdmins.includes(user.email.toLowerCase())) {
    return 'admin' as const;
  }

  return (user.role ?? 'user') as UserRole;
}

export async function requireAuthUser(ctx: Ctx) {
  return await authComponent.getAuthUser(ctx);
}

export async function requireRole(ctx: Ctx, roles: UserRole[]) {
  const user = await requireAuthUser(ctx);
  const role = resolveUserRole(user as { email?: string | null; role?: string | null });

  if (!roles.includes(role)) {
    throw new ConvexError('Forbidden');
  }

  return user;
}

export async function getProfileByAuthUserId(ctx: Ctx, authUserId: string) {
  return await ctx.db
    .query('profiles')
    .withIndex('by_auth_user_id', (query) => query.eq('authUserId', authUserId))
    .unique();
}
