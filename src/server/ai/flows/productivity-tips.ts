'use server';

/**
 * @fileOverview AI-driven daily inspiration for developers.
 *
 * - getProductivityTip - A function that provides a daily shlok and motivational quote.
 * - DailyDevotionOutput - The return type for the getProductivityTip function.
 */

import { ai } from '@/server/ai/genkit';
import { z } from 'genkit';

// Schema for the general daily tip
const DailyDevotionOutputSchema = z.object({
  sanskritShlok: z
    .string()
    .describe('A shlok from the Bhagavad Gita in Devanagari script.'),
  transliteratedShlok: z
    .string()
    .describe('The transliteration of the shlok in English characters.'),
  meaning: z.string().describe('The meaning of the shlok.'),
  motivation: z
    .string()
    .describe('A motivational quote for a developer for the day.'),
});
export type DailyDevotionOutput = z.infer<typeof DailyDevotionOutputSchema>;

// --- Flows ---

export async function getProductivityTip(): Promise<DailyDevotionOutput> {
  return productivityTipsFlow();
}

const dailyPrompt = ai.definePrompt({
  name: 'dailyDeveloperMotivationPrompt',
  output: { schema: DailyDevotionOutputSchema },
  prompt: `You are a wise spiritual guide who is also a senior software developer.
Your task is to provide a daily source of inspiration for a developer.
Provide one shlok (verse) from the Bhagavad Gita.
The shlok should be provided in two formats: one in the original Sanskrit with Devanagari script, and one as an English transliteration.
Then, provide its meaning in a simple, easy-to-understand way.
Finally, provide a short, powerful motivational quote for a developer that connects to the theme of the shlok.
Ensure the shlok is different each day.
`,
});

const productivityTipsFlow = ai.defineFlow(
  {
    name: 'productivityTipsFlow',
    outputSchema: DailyDevotionOutputSchema,
  },
  async () => {
    const { output } = await dailyPrompt({});
    return output!;
  }
);
