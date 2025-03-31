'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createDebate, updateDebate, getDebateById } from "@/lib/db/queries"
import { db } from "@/lib/db"
import { debates } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { generateDebateAnalysis } from "@/lib/gemini"
import { Conversation } from "@/lib/conversations"
import type { NewDebate } from '@/lib/db/schema'

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
  
  const [debate] = await db.insert(debates).values(newDebate).returning();
  revalidatePath('/app');
  
  return debate.id;
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