import { ref, computed } from 'vue';
import { debugLogger } from '../lib/debugLogger.js';

export function useSimpleMode(instructionsContent) {
	const _apiKey = null /* mock-only */
	const _claude = _apiKey && _apiKey !== 'your_api_key_here'
		? null
		: null;

	const simpleEditor = ref(null);
	const simpleIsDirty = ref(false);
	const isUpdatingFromSimple = ref(false);

	function parseSimpleFromInstructions(html) {
		if (!html) return '';
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		const items = [];
		for (const p of doc.querySelectorAll('p')) {
			const strong = p.querySelector('strong');
			if (!strong) continue;
			strong.remove();
			const description = p.innerHTML.replace(/^\s*—\s*/, '').trim();
			if (description) items.push(description);
		}
		if (!items.length) return '';
		return `<ol>${items.map(content => `<li>${content}</li>`).join('')}</ol>`;
	}

	const simpleContent = computed(() => parseSimpleFromInstructions(instructionsContent.value));

	function dismissSimpleBanner() {
		simpleIsDirty.value = false;
	}

	async function generateAdvancedFromSimple() {
		const el = simpleEditor.value;
		if (!el) return;
		const listItems = Array.from(el.querySelectorAll('li'))
			.map(li => li.textContent.trim())
			.filter(Boolean);
		if (!listItems.length) return;

		if (_claude) {
			try {
				const res = await _claude.messages.create({
					model: 'claude-haiku-4-5-20251001',
					max_tokens: 800,
					system: `Convert a numbered list of skill step titles into detailed HTML instructions for a customer service AI skill.
Return ONLY HTML paragraphs in this exact format:
<p><strong>Step Title</strong> — One sentence describing what the agent does, mentioning any <span class="connection-badge">ToolName</span> integrations.</p>
Rules: Keep all provided step titles exactly as written. Include 1–2 connection-badge references per relevant step. Return ONLY the HTML paragraphs, no preamble.`,
					messages: [{ role: 'user', content: `Steps:\n${listItems.map((s, i) => `${i + 1}. ${s}`).join('\n')}` }],
				});
				instructionsContent.value = res.content[0]?.text?.trim() || instructionsContent.value;
			} catch (err) {
				debugLogger.error('[useSimpleMode] generateAdvancedFromSimple failed:', err);
				instructionsContent.value = listItems.map(title =>
					`<p><strong>${title}</strong> — Complete this step according to the skill configuration.</p>`
				).join('\n');
			}
		} else {
			instructionsContent.value = listItems.map(title =>
				`<p><strong>${title}</strong> — Complete this step according to the skill configuration.</p>`
			).join('\n');
		}
	}

	return { simpleEditor, simpleIsDirty, isUpdatingFromSimple, simpleContent, generateAdvancedFromSimple, dismissSimpleBanner };
}
