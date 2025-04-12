// noinspection JSUnusedLocalSymbols
'use server';
/**
 * @fileOverview A flow to summarize articles or research papers using AI.
 *
 * - summarizeArticle - A function that summarizes the given article.
 * - SummarizeArticleInput - The input type for the summarizeArticle function.
 * - SummarizeArticleOutput - The return type for the summarizeArticle function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeArticleInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The content of the article to be summarized.'),
});
export type SummarizeArticleInput = z.infer<typeof SummarizeArticleInputSchema>;

const SummarizeArticleOutputSchema = z.object({
  summary: z.string().describe('The summarized content of the article.'),
});
export type SummarizeArticleOutput = z.infer<typeof SummarizeArticleOutputSchema>;

export async function summarizeArticle(input: SummarizeArticleInput): Promise<SummarizeArticleOutput> {
  return summarizeArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeArticlePrompt',
  input: {
    schema: z.object({
      articleContent: z
        .string()
        .describe('The content of the article to be summarized.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('The summarized content of the article.'),
    }),
  },
  prompt: `Summarize the following article in a concise manner:\n\n{{{articleContent}}}`,
});

const summarizeArticleFlow = ai.defineFlow<
  typeof SummarizeArticleInputSchema,
  typeof SummarizeArticleOutputSchema
>({
  name: 'summarizeArticleFlow',
  inputSchema: SummarizeArticleInputSchema,
  outputSchema: SummarizeArticleOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
