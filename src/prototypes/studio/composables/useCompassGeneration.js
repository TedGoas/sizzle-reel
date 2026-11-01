import { debugLogger } from '../lib/debugLogger.js';

export async function generateCompassIssues(claude, name, instructions, getMockFn) {
	if (!claude) return getMockFn();

	try {
		const response = await claude.messages.create({
			model: 'claude-haiku-4-5-20251001',
			max_tokens: 1500,
			system: `You are a technical reviewer for AI agent skill configurations. Given a skill name and its instructions, identify 3 to 6 specific, actionable issues. Focus on: missing required steps, undefined or conflicting action references, ambiguous fallback paths, incomplete configurations, or contradictory instructions.

Return a JSON array only — no markdown, no explanation. Each item must follow this exact schema:
{
  "id": number,
  "label": string,
  "details": {
    "suggestions": string[],
    "reasoning": string
  }
}`,
			messages: [
				{
					role: 'user',
					content: `Skill: ${name}\n\nInstructions:\n${instructions}`,
				},
			],
		});

		const raw = response.content.find((b) => b.type === 'text')?.text || '[]';
		const cleaned = raw
			.replace(/^```(?:json)?\s*/i, '')
			.replace(/\s*```$/, '')
			.trim();
		return JSON.parse(cleaned);
	} catch (err) {
		debugLogger.error('[useCompassGeneration] generation error:', err);
		return getMockFn();
	}
}
