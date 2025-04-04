import { cache } from "react";
import { db } from "./index";

import { eq, desc, sql } from "drizzle-orm";
import { Debate, debates, NewDebate, Profile, profiles } from "./schema";

/**
 * Get a user profile by ID
 */
export const getUserProfile = cache(
  async (userId: string): Promise<Profile | undefined> => {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId));

    return profile;
  }
);

/**
 * Create or update a user profile
 */
export async function upsertProfile(profile: {
  id: string;
  email?: string | null;
  username?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
}): Promise<void> {
  await db
    .insert(profiles)
    .values({
      id: profile.id,
      email: profile.email || null,
      username: profile.username || null,
      fullName: profile.fullName || null,
      avatarUrl: profile.avatarUrl || null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: {
        email: profile.email || null,
        username: profile.username || null,
        fullName: profile.fullName || null,
        avatarUrl: profile.avatarUrl || null,
        updatedAt: new Date(),
      },
    });
}

/**
 * Get all debates for a user
 */
export const getUserDebates = cache(
  async (userId: string): Promise<Debate[]> => {
    return db
      .select()
      .from(debates)
      .where(eq(debates.userId, userId))
      .orderBy(desc(debates.createdAt));
  }
);

/**
 * Get a specific debate by ID
 */
export const getDebateById = cache(
  async (debateId: string): Promise<Debate | undefined> => {
    const [debate] = await db
      .select()
      .from(debates)
      .where(eq(debates.id, debateId));

    return debate;
  }
);

/**
 * Create a new debate record
 */
export async function createDebate(debate: NewDebate): Promise<string> {
  const [result] = await db
    .insert(debates)
    .values(debate)
    .returning({ id: debates.id });

  return result.id;
}

/**
 * Update an existing debate record
 */
export async function updateDebate(
  debateId: string,
  data: Partial<Omit<NewDebate, "id" | "userId">>
): Promise<void> {
  await db.update(debates).set(data).where(eq(debates.id, debateId));
}

/**
 * Get the count of debates for a user
 */
export const getUserDebateCount = cache(
  async (userId: string): Promise<number> => {
    const result = await db
      .select({ count: sql`count(*)` })
      .from(debates)
      .where(eq(debates.userId, userId));

    return Number(result[0].count);
  }
);

/**
 * Get user's remaining credits
 */
export const getUserCredits = cache(async (userId: string): Promise<number> => {
  const [user] = await db
    .select({ credits: profiles.credits })
    .from(profiles)
    .where(eq(profiles.id, userId));

  return user?.credits ?? 0;
});

/**
 * Decrease user's credits by 1
 */
export const decreaseUserCredits = async (userId: string): Promise<void> => {
  await db
    .update(profiles)
    .set({
      credits: sql`${profiles.credits} - 1`,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, userId));
};
