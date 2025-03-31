'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createDebate, updateDebate, getDebateById, getUserDebateCount, getUserCredits, decreaseUserCredits } from '@/lib/db/queries';
import { db } from '@/lib/db';
import { Conversation } from '@/lib/conversations';
import { debates } from '@/lib/db/schema';
import type { NewDebate } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateDebateAnalysis } from '@/lib/gemini';

/**
 * Save a completed debate to the database
 */
export async function saveDebate(debateData: {
  topic: string;
  stance: string;
  duration: number;
  inputTokens: number;
  outputTokens: number;
  transcript: Conversation[];
}): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const newDebate: NewDebate = {
    userId: user.id,
    topic: debateData.topic,
    stance: debateData.stance,
    duration: debateData.duration,
    inputTokens: debateData.inputTokens,
    outputTokens: debateData.outputTokens,
    transcript: debateData.transcript
  };
  
  const debateId = await createDebate(newDebate);
  revalidatePath('/app');
  
  return debateId;
}

/**
 * Generate and save analysis for a debate
 */
export async function generateDebateSummary(debateId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const debate = await getDebateById(debateId);
  if (!debate) {
    throw new Error('Debate not found');
  }

  const analysis = await generateDebateAnalysis(
    debate.topic,
    debate.stance,
    debate.duration,
    debate.transcript as Array<{ role: string; text: string; id: string }>
  );

  await updateDebate(debateId, { analysis });
  
  revalidatePath(`/app/debate/${debateId}`);
}

/**
 * Delete a debate
 */
export async function deleteDebate(debateId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  await db.delete(debates).where(eq(debates.id, debateId));
  
  revalidatePath('/app');
  redirect('/app');
}

/**
 * Check user's remaining credits
 */
export async function checkDebateCredits(): Promise<number> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  return getUserCredits(user.id);
}

/**
 * Decrease user's credits when starting a debate
 */
export async function useDebateCredit(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  await decreaseUserCredits(user.id);
} 