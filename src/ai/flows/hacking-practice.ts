'use server';

/**
 * @fileOverview A Genkit flow to provide hacking practice scenarios and guidance.
 *
 * - generatePracticeScenario - A function that generates a hacking practice scenario.
 * - GeneratePracticeScenarioInput - The input type for the generatePracticeScenario function.
 * - GeneratePracticeScenarioOutput - The return type for the generatePracticeScenario function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GeneratePracticeScenarioInputSchema = z.object({
  skillLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe('The skill level of the user.'),
  topic: z.string().describe('The specific hacking topic to practice (e.g., SQL injection, XSS).'),
});
export type GeneratePracticeScenarioInput = z.infer<typeof GeneratePracticeScenarioInputSchema>;

const GeneratePracticeScenarioOutputSchema = z.object({
  scenarioDescription: z.string().describe('A detailed description of the hacking practice scenario.'),
  hints: z.array(z.string()).describe('Hints to guide the user through the practice.'),
  solution: z.string().describe('The solution to the hacking practice scenario.'),
});
export type GeneratePracticeScenarioOutput = z.infer<typeof GeneratePracticeScenarioOutputSchema>;

export async function generatePracticeScenario(
  input: GeneratePracticeScenarioInput
): Promise<GeneratePracticeScenarioOutput> {
  return generatePracticeScenarioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'hackingPracticePrompt',
  input: {
    schema: z.object({
      skillLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe('The skill level of the user.'),
      topic: z.string().describe('The specific hacking topic to practice (e.g., SQL injection, XSS).'),
    }),
  },
  output: {
    schema: z.object({
      scenarioDescription: z.string().describe('A detailed description of the hacking practice scenario.'),
      hints: z.array(z.string()).describe('Hints to guide the user through the practice.'),
      solution: z.string().describe('The solution to the hacking practice scenario.'),
    }),
  },
  prompt: `You are an AI-powered hacking practice scenario generator. You provide users with realistic hacking scenarios, hints, and solutions.

Generate a scenario for a user with skill level: {{{skillLevel}}} practicing the topic: {{{topic}}}.

The scenario description should be engaging and detailed, providing enough context for the user to understand the challenge.

Provide a set of hints to guide the user through the practice without giving away the solution directly.

Finally, provide the full solution to the scenario.`,
});

const generatePracticeScenarioFlow = ai.defineFlow<
  typeof GeneratePracticeScenarioInputSchema,
  typeof GeneratePracticeScenarioOutputSchema
>({
  name: 'generatePracticeScenarioFlow',
  inputSchema: GeneratePracticeScenarioInputSchema,
  outputSchema: GeneratePracticeScenarioOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});

    