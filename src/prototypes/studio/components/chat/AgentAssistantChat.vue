<template>
	<div class="assistant-panel" :style="{ width: width + 'px' }">
		<div
			class="assistant-resize-handle"
			@mousedown.prevent="$emit('resize-start', $event)"
		></div>
		<!-- Header -->
		<div class="assistant-header">
			<div class="assistant-header-left">
				<span class="assistant-icon-ai">
					<svg
						width="20"
						height="20"
						viewBox="0 0 12 12"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<defs>
							<linearGradient
								id="aiIconGrad"
								x1="0%"
								y1="0%"
								x2="100%"
								y2="100%"
							>
								<stop offset="0%" stop-color="#9333ea" />
								<stop offset="50%" stop-color="#ec4899" />
								<stop offset="100%" stop-color="#f97316" />
							</linearGradient>
						</defs>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M9 0a.5.5 0 0 1 .5.5V1h.5a.5.5 0 1 1 0 1h-.5v.5a.5.5 0 1 1-1 0V2H8a.5.5 0 0 1 0-1h.5V.5A.5.5 0 0 1 9 0ZM2.5 2a.5.5 0 0 0-.5.5v7.614l1.492-.9a.5.5 0 0 1 .258-.071H9.5a.5.5 0 0 0 .5-.5V6.929a.5.5 0 0 1 1 0v1.714a1.5 1.5 0 0 1-1.5 1.5H3.89l-2.132 1.285A.5.5 0 0 1 1 11V2.5A1.5 1.5 0 0 1 2.5 1h3.95a.5.5 0 1 1 0 1H2.5ZM6 3a.5.5 0 0 1 .455.293l.548 1.204 1.204.548a.5.5 0 0 1 0 .91l-1.204.548-.548 1.204a.5.5 0 0 1-.91 0l-.547-1.204-1.205-.548a.5.5 0 0 1 0-.91l1.205-.548.547-1.204A.5.5 0 0 1 6 3Zm4.5 0a.5.5 0 0 1 .5.5V4h.5a.5.5 0 1 1 0 1H11v.5a.5.5 0 1 1-1 0V5h-.5a.5.5 0 0 1 0-1h.5v-.5a.5.5 0 0 1 .5-.5ZM6 4.708l-.17.374a.5.5 0 0 1-.248.248l-.373.17.373.17a.5.5 0 0 1 .248.248l.17.374.17-.374a.5.5 0 0 1 .248-.248l.374-.17-.374-.17a.5.5 0 0 1-.248-.248L6 4.708Z"
							fill="url(#aiIconGrad)"
						/>
					</svg>
				</span>
				<span class="assistant-title">Assistant</span>
			</div>
			<button class="assistant-close" @click="$emit('close')">
				<dt-icon name="close" size="300" />
			</button>
		</div>

		<!-- Messages -->
		<div
			ref="messagesEl"
			class="assistant-messages"
			:class="{ 'is-scrolling': isScrolling }"
			@scroll="onScroll"
		>
			<template v-for="(msg, i) in messages" :key="i">
				<!-- User message -->
				<div v-if="msg.role === 'user'" class="message message--user">
					<div class="message-bubble">{{ msg.content }}</div>
				</div>

				<!-- Thought indicator -->
				<button
					v-else-if="msg.role === 'thought'"
					class="thought-indicator"
					@click="msg.expanded = !msg.expanded"
				>
					<dt-icon name="ai-sparkle" size="100" />
					Thought for {{ msg.seconds }}s
					<dt-icon
						:name="msg.expanded ? 'chevron-up' : 'chevron-right'"
						size="100"
					/>
				</button>

				<!-- AI message -->
				<div v-else-if="msg.role === 'assistant'" class="message message--ai">
					<div class="message-text" v-html="renderMarkdown(msg.content)"></div>
					<template
						v-if="msg.bulletList && msg.bulletList.length && msg.content"
					>
						<ul v-if="showSummary" class="summary-list">
							<li v-for="item in msg.bulletList" :key="item">{{ item }}</li>
						</ul>
						<button class="summary-toggle" @click="showSummary = !showSummary">
							{{ showSummary ? "Hide summary" : "Show summary" }}
						</button>
					</template>
					<dt-button
						v-if="msg.showFixButton && msg.content"
						importance="outlined"
						kind="muted"
						size="sm"
						class="chat-fix-button"
						@click="triggerFixAll"
					>
						Improve skill
					</dt-button>
				</div>
			</template>

			<!-- Typing indicator -->
			<div v-if="isTyping" class="typing-indicator">
				<span></span><span></span><span></span>
			</div>
		</div>

		<!-- Input -->
		<div ref="inputAreaEl" class="assistant-input-area">
			<dt-recipe-message-input
				v-model="inputText"
				input-aria-label="Ask for changes"
				placeholder="Ask for changes"
				:show-cancel="false"
				:show-emoji-picker="false"
				:show-image-picker="false"
				:rich-text="false"
				:disable-send="!inputText.trim()"
				@text-input="inputText = $event"
				@submit="sendMessage"
			>
				<template #sendButton>
					<dt-button
						circle
						size="xs"
						importance="clear"
						:disabled="!inputText.trim()"
						@click="sendMessage"
					>
						<template #icon>
							<dt-icon name="send" size="300" />
						</template>
					</dt-button>
				</template>
			</dt-recipe-message-input>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from "vue";
import { DtIcon, DtButton, DtRecipeMessageInput } from '../ui';
import MarkdownIt from "markdown-it";
import { state } from "../../state.js";
import { useTypewriter } from "../../composables/useTypewriter.js";

// ─── Markdown renderer (Claude responses only — html disabled for safety) ──────
const md = new MarkdownIt({ html: false, linkify: false, typographer: false });
function renderMarkdown(text) {
	return md.render(text || "");
}

// ─── Claude client (browser-safe for internal prototype) ─────────────────────
const apiKey = null
const claude =
	apiKey && apiKey !== "your_api_key_here"
		? null
		: null;

// ─── Canvas tools Claude can call ────────────────────────────────────────────
const CANVAS_TOOLS = [
	{
		name: "add_skill",
		description:
			"Add a new skill node to the agent canvas. Use describe_prompt (and omit steps/action_count) when the user provides a natural-language description — the skill panel will auto-generate full instructions. Use steps when you want to provide explicit instructions immediately.",
		input_schema: {
			type: "object",
			properties: {
				name: {
					type: "string",
					description: "Short skill name (2–4 words, title case)",
				},
				description: {
					type: "string",
					description: "One-sentence description of what the skill does",
				},
				describe_prompt: {
					type: "string",
					description:
						"The user's natural-language description of the skill. When provided, the skill panel opens in describe mode and auto-generates instructions from this text. Use this instead of steps when the user has described what the skill should do.",
				},
				steps: {
					type: "array",
					description:
						"3–6 step-by-step instructions. Omit when describe_prompt is provided.",
					items: {
						type: "object",
						properties: {
							title: {
								type: "string",
								description: "Short action verb phrase (2–4 words, title case)",
							},
							detail: {
								type: "string",
								description:
									"One sentence describing what the agent does in this step. Include the names of any integrations or APIs used.",
							},
							actions: {
								type: "array",
								description:
									"Named integrations, APIs, or workflows referenced in this step",
								items: {
									type: "object",
									properties: {
										name: {
											type: "string",
											description:
												'The exact name as it appears in the detail text (e.g. "Get Account", "Refund Policy")',
										},
										type: {
											type: "string",
											enum: ["api", "workflow", "transfer"],
											description:
												"api = integration/API call, workflow = internal workflow, transfer = human transfer",
										},
									},
									required: ["name", "type"],
								},
							},
						},
						required: ["title", "detail"],
					},
				},
				action_count: {
					type: "integer",
					description:
						"Estimated number of integrations or API actions this skill needs (1–8). Omit when describe_prompt is provided.",
				},
			},
			required: ["name", "description"],
		},
	},
	{
		name: "remove_skill",
		description: "Remove an existing skill from the agent canvas.",
		input_schema: {
			type: "object",
			properties: {
				skill_id: {
					type: "string",
					description: "The id of the skill to remove",
				},
			},
			required: ["skill_id"],
		},
	},
	{
		name: "rename_agent",
		description: "Rename the AI agent.",
		input_schema: {
			type: "object",
			properties: {
				name: { type: "string", description: "The new agent name" },
			},
			required: ["name"],
		},
	},
	{
		name: "apply_skill_improvements",
		description:
			"Apply linter suggestions to improve the currently open skill's instructions. Use when the user asks to 'improve', 'fix', 'apply suggestions', or 'clean up' a skill.",
		input_schema: {
			type: "object",
			properties: {
				skill_name: {
					type: "string",
					description:
						"Name of the skill to improve (for confirmation message)",
				},
			},
			required: ["skill_name"],
		},
	},
];

const props = defineProps({
	width: { type: Number, default: 360 },
});
defineEmits(["close", "resize-start"]);

const { typewriterEffect } = useTypewriter();
const messages = ref([]);
const apiMessages = ref([]); // API-format history (user/assistant only)
const inputText = ref("");
const isTyping = ref(false);
const showSummary = ref(true);
const messagesEl = ref(null);
const inputAreaEl = ref(null);
const isScrolling = ref(false);
let scrollTimer = null;

function onScroll() {
	isScrolling.value = true;
	clearTimeout(scrollTimer);
	scrollTimer = setTimeout(() => {
		isScrolling.value = false;
	}, 1000);
}

onMounted(() => {
	// Push initial user message immediately
	messages.value.push({ role: "user", content: state.initialPrompt });
	scrollToBottom();

	// After short delay, show thought indicator
	setTimeout(() => {
		isTyping.value = true;
		const thoughtMsg = reactive({
			role: "thought",
			seconds: 0,
			expanded: false,
		});
		messages.value.push(thoughtMsg);
		scrollToBottom();

		const ticker = setInterval(() => {
			thoughtMsg.seconds++;
		}, 300);

		// Wait for all skill nodes to finish generating before showing the response,
		// so buildInitialResponse() reads the complete list. Min visual pause: 800ms.
		const showResponse = () => {
			clearInterval(ticker);
			isTyping.value = false;
			const response = buildInitialResponse();
			const aiMsg = reactive({
				role: "assistant",
				content: "",
				bulletList: response.bulletList,
			});
			messages.value.push(aiMsg);
			typewriterEffect(
				response.content,
				(t) => {
					aiMsg.content = t;
					scrollToBottom();
				},
				8,
			);
		};

		if (!state.isGeneratingNodes) {
			// Nodes already done (fast path) — short visual pause then respond
			setTimeout(showResponse, 800);
		} else {
			const stop = watch(
				() => state.isGeneratingNodes,
				(val) => {
					if (!val) {
						stop();
						setTimeout(showResponse, 300);
					}
				},
			);
		}
	}, 400);
});

function buildInitialResponse() {
	const skills = state.skillNodes;
	const name = state.selectedAgent?.name || "your agent";
	const count = skills.length;
	const content =
		count > 0
			? `All set! I've created ${name} with ${count} skill${
					count !== 1 ? "s" : ""
			  } to handle your request. Let me know if you'd like to adjust anything.`
			: `I'm setting up ${name} now. The skills will appear on the canvas shortly. Let me know if you'd like to adjust anything.`;
	return { content, bulletList: skills.map((s) => s.name).filter(Boolean) };
}

/**
 * Sends the current inputText as a user message and streams the AI response.
 *
 * @param {boolean} [noTools=false] - Passed through to callClaude/simulateFallback.
 *   - Default (false): called by the user typing in the chat input; canvas tools active.
 *   - true: called programmatically via the state.pendingChatMessage watcher (explain path);
 *     canvas tools disabled to prevent linter text from triggering canvas mutations.
 *
 * IMPORTANT: Vue template bindings (@click="sendMessage", @submit="sendMessage") pass
 * the DOM Event object as the first argument. Guard against this to prevent a truthy
 * event object from being treated as noTools=true, which would silently disable all
 * canvas tools for every user-submitted message.
 */
async function sendMessage(noTools = false) {
	// Coerce DOM Event objects (from @click/@submit template bindings) to false
	if (typeof noTools !== "boolean") noTools = false;
	const text = inputText.value.trim();
	if (!text) return;

	inputText.value = "";
	messages.value.push({ role: "user", content: text });
	apiMessages.value.push({ role: "user", content: text });
	scrollToBottom();

	isTyping.value = true;
	const thoughtMsg = reactive({ role: "thought", seconds: 0, expanded: false });
	messages.value.push(thoughtMsg);
	scrollToBottom();
	const ticker = setInterval(() => {
		thoughtMsg.seconds++;
	}, 300);

	try {
		const { responseText, action } = claude
			? await callClaude(text, noTools)
			: simulateFallback(text, noTools);

		clearInterval(ticker);
		isTyping.value = false;
		if (action && !noTools) applyCanvasAction(action);

		const aiMsg = reactive({ role: "assistant", content: "" });
		messages.value.push(aiMsg);
		typewriterEffect(
			responseText,
			(t) => {
				aiMsg.content = t;
				scrollToBottom();
			},
			8,
		);
	} catch (err) {
		clearInterval(ticker);
		isTyping.value = false;
		console.error("Claude API error:", err);

		// Graceful fallback on error
		const { responseText, action } = simulateFallback(text, noTools);
		if (action && !noTools) applyCanvasAction(action);
		const aiMsg = reactive({ role: "assistant", content: "" });
		messages.value.push(aiMsg);
		typewriterEffect(
			responseText,
			(t) => {
				aiMsg.content = t;
				scrollToBottom();
			},
			8,
		);
	}
}

/**
 * System prompt used on the explain/linter path (noTools=true).
 *
 * Intentionally omits any mention of canvas tools or canvas-edit capabilities.
 * This prompt is used when the user's message contains linter error labels —
 * text that may include action words like "Remove" or "Add" that would otherwise
 * trigger canvas mutations via simulateFallback pattern matching.
 *
 * @returns {string}
 */
function buildExplainSystemPrompt() {
	return `You are an AI assistant helping a user improve an AI agent skill configuration. The user has run a linter on their skill and wants you to explain the issues found and suggest specific fixes. Be clear and actionable — address each issue in plain language. Do NOT add, remove, or rename anything on the canvas.`;
}

/**
 * System prompt used on the standard canvas-editing path (noTools=false).
 *
 * Includes the current agent name and full skill list so Claude can reference
 * skill IDs when calling remove_skill. Guides Claude to use CANVAS_TOOLS for
 * structural changes and to respond conversationally otherwise.
 *
 * @returns {string}
 */
function buildSystemPrompt() {
	const agentName = state.selectedAgent?.name || "this agent";
	const skillsList = state.skillNodes.length
		? state.skillNodes
				.map((s) => `- ${s.name} (id: ${s.id}): ${s.description || ""}`)
				.join("\n")
		: "(no skills yet)";

	return `You are an AI assistant embedded in Dialpad's agent builder tool. You help users design and refine AI agents by modifying the canvas.

Current agent: "${agentName}"
Current skills on canvas:
${skillsList}

Guidelines:
- Keep responses short and conversational (1–2 sentences max).
- Use the provided tools when the user asks to add, remove, or rename things on the canvas.
- When the user describes a skill in natural language (e.g. "create a skill to book appointments"), use add_skill with name, description, and describe_prompt set to the user's exact wording. Do NOT include steps or action_count — the skill panel will auto-generate full instructions from the describe_prompt.
- Only include steps and action_count when you need to populate a skill immediately without a describe prompt.
- When including steps, populate ALL fields: name, description, steps (3–6 realistic steps), and action_count.
- Steps should be specific to the skill's domain. For each step, include an actions[] array listing the API/integration/workflow names used — e.g. "Get Invoice", "Apply Credit", "Send Email". These appear as inline badges in the UI.
- Use type "api" for integration calls, "workflow" for internal workflows, "transfer" for human escalation steps.
- If no tool is needed, just respond helpfully.
- Don't list the skills back unless asked — the user can see them on the canvas.
- Use apply_skill_improvements when the user asks to improve, fix, or apply linter suggestions to a skill.`;
}

/**
 * Calls the Claude API, handling the tool-use agentic loop.
 *
 * @param {string} userText - The user's message (for context — apiMessages already
 *   includes it as the latest turn before this function is called).
 * @param {boolean} [noTools=false] - When true: uses buildExplainSystemPrompt(),
 *   omits CANVAS_TOOLS entirely (not set to []), and caps tokens at 600.
 *   When false: uses buildSystemPrompt() with CANVAS_TOOLS and handles tool_use responses
 *   via a second follow-up API call that feeds the tool result back for a natural confirmation.
 *
 * @returns {Promise<{responseText: string, action: object|null}>}
 */
async function callClaude(userText, noTools = false) {
	const callParams = {
		model: "claude-haiku-4-5-20251001",
		max_tokens: noTools ? 600 : 512,
		system: noTools ? buildExplainSystemPrompt() : buildSystemPrompt(),
		messages: apiMessages.value,
	};
	if (!noTools) callParams.tools = CANVAS_TOOLS;

	// First API call — may trigger a tool
	const firstResponse = await claude.messages.create(callParams);

	let action = null;
	let responseText = "";

	if (firstResponse.stop_reason === "tool_use") {
		const toolUseBlock = firstResponse.content.find(
			(b) => b.type === "tool_use",
		);
		action = { type: toolUseBlock.name, ...toolUseBlock.input };

		// Feed tool result back so Claude can write a natural confirmation
		const messagesWithTool = [
			...apiMessages.value,
			{ role: "assistant", content: firstResponse.content },
			{
				role: "user",
				content: [
					{
						type: "tool_result",
						tool_use_id: toolUseBlock.id,
						content: "Done.",
					},
				],
			},
		];

		const followUp = await claude.messages.create({
			model: "claude-haiku-4-5-20251001",
			max_tokens: 256,
			system: buildSystemPrompt(),
			tools: CANVAS_TOOLS,
			messages: messagesWithTool,
		});

		responseText =
			followUp.content.find((b) => b.type === "text")?.text || "Done!";

		// Store the full exchange in apiMessages
		apiMessages.value.push({
			role: "assistant",
			content: firstResponse.content,
		});
		apiMessages.value.push({
			role: "user",
			content: [
				{ type: "tool_result", tool_use_id: toolUseBlock.id, content: "Done." },
			],
		});
		apiMessages.value.push({ role: "assistant", content: followUp.content });
	} else {
		responseText =
			firstResponse.content.find((b) => b.type === "text")?.text || "";
		apiMessages.value.push({
			role: "assistant",
			content: firstResponse.content,
		});
	}

	return { responseText, action };
}

// Regex fallback used when no API key is configured or on error
function simulateFallback(text, noTools = false) {
	// Explain/linter path — never attempt canvas pattern matching on linter text
	if (noTools) {
		// Use stored linter data (reasoning + suggestions) to generate a per-item explanation
		const skillId = state.explainSkillId;
		const errors = skillId ? state.skillLinterData[skillId]?.errors : null;
		if (errors?.length) {
			const explanation = errors
				.map((e, i) => {
					const reasoning =
						e.details?.reasoning ||
						"This can cause the agent to behave unexpectedly at runtime.";
					const fixes = e.details?.suggestions?.length
						? `\nTo fix: ${e.details.suggestions.join(" ")}`
						: "";
					return `${i + 1}. ${e.label}\n${reasoning}${fixes}`;
				})
				.join("\n\n");
			return {
				responseText: `Here's a breakdown of the issues found in this skill:\n\n${explanation}\n\nClick "Improve skill" below to apply all suggestions automatically.`,
				action: null,
			};
		}
		return {
			responseText:
				"I can see a few issues in this skill. Each relates to incomplete or ambiguous instructions that could confuse the agent at runtime. Try addressing them one by one, starting from the top of the list.",
			action: null,
		};
	}

	const lower = text.toLowerCase();

	if (/\b(create|add)\b.*(skill|capability|feature|ability)/i.test(lower)) {
		const match = text.match(
			/(?:create|add)\s+(?:a\s+)?(?:new\s+)?(?:skill\s+(?:for|to(?:\s+handle)?)\s+)?(.+?)(?:\s+skill)?$/i,
		);
		const name = capitalize(
			(match?.[1] || "New Skill").trim().replace(/\.$/, ""),
		);
		return {
			responseText: `I've created a "${name}" skill and will generate the full instructions from your description now.`,
			action: {
				type: "add_skill",
				name,
				description: `Handles ${name.toLowerCase()} requests.`,
				describe_prompt: text.trim(),
			},
		};
	}
	if (/\b(remove|delete)\b/i.test(lower)) {
		const matched = state.skillNodes.find((s) =>
			lower.includes(s.name.toLowerCase()),
		);
		if (matched)
			return {
				responseText: `I've removed "${matched.name}" from the canvas.`,
				action: { type: "remove_skill", skill_id: matched.id },
			};
		return {
			responseText: `Which skill would you like to remove?`,
			action: null,
		};
	}
	if (/rename.*agent|call.*agent|agent.*name/i.test(lower)) {
		const match =
			text.match(/["']([^"']+)["']/) ||
			text.match(/(?:to|called?|named?)\s+([A-Za-z0-9 &'-]+)/i);
		const name = match ? capitalize(match[1].trim()) : null;
		if (name)
			return {
				responseText: `Done! I've renamed the agent to "${name}".`,
				action: { type: "rename_agent", name },
			};
	}
	if (/\b(improve|apply|fix)\b.*(skill|suggestion)/i.test(lower)) {
		return {
			responseText: `I'll apply the linter suggestions to improve your skill now.`,
			action: { type: "apply_skill_improvements", skill_name: "current skill" },
		};
	}
	return {
		responseText: `Sure, could you give me a bit more detail about what you'd like to change?`,
		action: null,
	};
}

function stepsToHtml(steps) {
	if (!steps?.length) return "";
	return steps
		.map((s) => {
			let detail = s.detail;
			if (s.actions?.length) {
				for (const action of s.actions) {
					const cls =
						action.type === "workflow"
							? "connection-badge connection-badge--workflow"
							: action.type === "transfer"
							? "connection-badge connection-badge--transfer"
							: "connection-badge";
					const escaped = action.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
					detail = detail.replace(
						new RegExp(escaped, "g"),
						`<span class="${cls}">${action.name}</span>`,
					);
				}
			}
			return `<p><strong>${s.title}</strong> — ${detail}</p>`;
		})
		.join("\n");
}

function applyCanvasAction(action) {
	if (action.type === "add_skill") {
		const skillId = `skill-${Date.now()}`;
		const isDescribeFlow = !!action.describe_prompt;
		state.skillNodes.push({
			id: skillId,
			name: action.name,
			description:
				action.description ?? `Handles ${action.name.toLowerCase()} requests.`,
			position: {
				left: 420,
				top: 50 + state.skillNodes.length * 160,
			},
			isNew: true,
			isGenerating: !isDescribeFlow,
			instructions: isDescribeFlow ? "" : stepsToHtml(action.steps),
			guardrails: "",
			labels: "",
			actionCount: action.action_count ?? 0,
			...(isDescribeFlow ? { describeText: action.describe_prompt } : {}),
		});
		state.hasUnsavedChanges = true;

		if (isDescribeFlow) {
			// Signal AgentEditorTab to open this skill in describe mode.
			// isNew stays true so SkillPanel enters describe mode; it's cleared by handleNext()
			// after instructions are generated.
			state.pendingOpenSkillId = skillId;
		} else {
			// Clear shimmer after animation completes
			setTimeout(() => {
				const idx = state.skillNodes.findIndex((n) => n.id === skillId);
				if (idx !== -1) {
					state.skillNodes[idx].isGenerating = false;
					state.skillNodes[idx].isNew = false;
				}
			}, 1200);
		}
	}

	if (action.type === "remove_skill") {
		const idx = state.skillNodes.findIndex(
			(s) => s.id === (action.skill_id ?? action.id),
		);
		if (idx !== -1) {
			state.skillNodes.splice(idx, 1);
			state.hasUnsavedChanges = true;
		}
	}

	if (action.type === "rename_agent" && state.selectedAgent) {
		state.selectedAgent.name = action.name;
		state.hasUnsavedChanges = true;
	}

	if (action.type === "apply_skill_improvements") {
		// Only trigger when a skill is open for explanation (explainSkillId set by
		// handleExplainLinter). Without this guard, setting pendingFixAll when no
		// SkillPanel watcher matches leaves it stuck at true permanently.
		if (state.explainSkillId) {
			state.pendingFixAll = true;
		}
	}
}

function scrollToBottom() {
	nextTick(() => {
		if (messagesEl.value) {
			messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
		}
	});
}

function capitalize(s) {
	if (!s) return s;
	return s.charAt(0).toUpperCase() + s.slice(1);
}

function focusInput() {
	nextTick(() => {
		const el = inputAreaEl.value?.querySelector(
			'input, textarea, [contenteditable="true"]',
		);
		el?.focus();
	});
}

defineExpose({ focusInput });

// When SkillPanel sets a pending message (e.g. via Explain), inject it as a new user turn
// and tag the AI response with a Fix all button.
// noTools=true: the message contains linter text (may include words like "remove") that
// must NOT be interpreted as canvas commands — use the explain system prompt instead.
watch(
	() => state.pendingChatMessage,
	async (msg) => {
		if (!msg) return;
		state.pendingChatMessage = null;
		inputText.value = msg;
		await sendMessage(true);
		// Find the AI response and attach a fix affordance
		const lastAiMsg = [...messages.value]
			.reverse()
			.find((m) => m.role === "assistant");
		if (lastAiMsg) lastAiMsg.showFixButton = true;
	},
);

function triggerFixAll() {
	state.pendingFixAll = true;
}

// Display a confirmation message in the thread after SkillPanel completes a fix
watch(
	() => state.pendingAssistantMessage,
	async (msg) => {
		if (!msg) return;
		state.pendingAssistantMessage = null;

		isTyping.value = true;
		scrollToBottom();
		await new Promise((r) => setTimeout(r, 700));
		isTyping.value = false;

		const aiMsg = reactive({ role: "assistant", content: "" });
		messages.value.push(aiMsg);
		typewriterEffect(
			msg,
			(t) => {
				aiMsg.content = t;
				scrollToBottom();
			},
			8,
		);
	},
);
</script>

<style scoped>
.assistant-panel {
	position: fixed;
	top: 16px;
	left: 66px; /* 50px skinny nav + 16px margin */
	bottom: 16px;
	z-index: 1001;
	background: white;
	border-radius: 24px;
	box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.04),
		0px 1px 2px rgba(0, 0, 0, 0.03);
	display: flex;
	flex-direction: column;
	overflow: hidden;
	animation: slideInPanel 0.45s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.assistant-resize-handle {
	position: absolute;
	top: 0;
	right: -4px;
	width: 8px;
	height: 100%;
	cursor: col-resize;
	z-index: 10;
}

.assistant-resize-handle::after {
	content: "";
	position: absolute;
	top: 0;
	left: 3px;
	width: 2px;
	height: 100%;
	background: transparent;
	transition: background 0.15s;
}

.assistant-resize-handle:hover::after {
	background: rgba(147, 88, 255, 0.35);
}

@keyframes slideInPanel {
	from {
		transform: translateX(-100%);
		opacity: 0;
	}
	to {
		transform: translateX(0);
		opacity: 1;
	}
}

/* Header */
.assistant-header {
	height: 52px;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 12px 0 16px;
	position: relative;
	z-index: 1;
}

.assistant-header::after {
	content: "";
	position: absolute;
	bottom: -20px;
	left: 0;
	right: 0;
	height: 20px;
	background: linear-gradient(to bottom, white, transparent);
	pointer-events: none;
	z-index: 1;
}

.assistant-header-left {
	display: flex;
	align-items: center;
	gap: 8px;
	color: #1c1c1c;
}

.assistant-icon-ai {
	display: flex;
	align-items: center;
}

.assistant-title {
	font-size: 15px;
	font-weight: 590;
	color: #1c1c1c;
	line-height: 1.6;
}

.assistant-close {
	background: none;
	border: none;
	cursor: pointer;
	padding: 6px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 6px;
	color: #666;
	transition: background 0.15s ease;
}

.assistant-close:hover {
	background: #f5f5f5;
}

/* Messages */
.assistant-messages {
	flex: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 16px;
	scroll-behavior: smooth;
}

.assistant-messages::-webkit-scrollbar {
	width: 4px;
}

.assistant-messages::-webkit-scrollbar-thumb {
	background: transparent;
	border-radius: 2px;
}

.assistant-messages.is-scrolling::-webkit-scrollbar-thumb {
	background: rgba(0, 0, 0, 0.2);
}

/* User message */
.message--user {
	display: flex;
	justify-content: flex-end;
	margin-bottom: 8px;
}

.message-bubble {
	background: #e9e9e9;
	border-radius: 16px;
	padding: 14px 18px;
	font-size: 15px;
	line-height: 1.4;
	color: #1c1c1c;
	max-width: 78%;
	word-break: break-word;
}

/* Thought indicator */
.thought-indicator {
	display: flex;
	align-items: center;
	gap: 4px;
	background: none;
	border: none;
	cursor: pointer;
	padding: 6px 0;
	font-size: 12px;
	color: var(--dt-color-foreground-secondary);
	transition: opacity 0.15s ease;
	text-align: left;
	margin-bottom: 4px;
}

.thought-indicator:hover {
	opacity: 0.75;
}

/* AI message */
.message--ai {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin-bottom: 8px;
}

.message-text {
	font-size: 15px;
	line-height: 1.5;
	color: #1c1c1c;
	margin: 0 0 8px 0;
	word-break: break-word;
}

.message-text :deep(p) {
	margin: 0 0 8px 0;
}

.message-text :deep(p:last-child) {
	margin-bottom: 0;
}

.message-text :deep(h1),
.message-text :deep(h2),
.message-text :deep(h3) {
	font-size: 14px;
	font-weight: 600;
	color: #1c1c1c;
	margin: 12px 0 4px 0;
}

.message-text :deep(h1:first-child),
.message-text :deep(h2:first-child),
.message-text :deep(h3:first-child) {
	margin-top: 0;
}

.message-text :deep(strong) {
	font-weight: 600;
}

.message-text :deep(ul),
.message-text :deep(ol) {
	padding-left: 18px;
	margin: 4px 0 8px 0;
}

.message-text :deep(li) {
	margin-bottom: 2px;
}

.message-text :deep(code) {
	font-size: 13px;
	background: #f0f0f0;
	border-radius: 3px;
	padding: 1px 4px;
}

.chat-fix-button {
	margin-top: 8px;
}

.summary-list {
	margin: 0 0 8px 0;
	padding-left: 20px;
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.summary-list li {
	font-size: 14px;
	line-height: 1.5;
	color: #1c1c1c;
}

.summary-toggle {
	background: none;
	border: none;
	cursor: pointer;
	font-size: 13px;
	color: var(--dt-color-foreground-secondary);
	padding: 0;
	transition: opacity 0.15s ease;
}

.summary-toggle:hover {
	opacity: 0.75;
}

/* Typing indicator (3 bouncing dots) */
.typing-indicator {
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 8px 0;
}

.typing-indicator span {
	width: 7px;
	height: 7px;
	border-radius: 50%;
	background: #aaa;
	animation: typingBounce 1.2s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
	animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
	animation-delay: 0.4s;
}

@keyframes typingBounce {
	0%,
	60%,
	100% {
		transform: translateY(0);
		opacity: 0.4;
	}
	30% {
		transform: translateY(-6px);
		opacity: 1;
	}
}

/* Input area */
.assistant-input-area {
	flex-shrink: 0;
	padding: 12px 16px 16px;
	position: relative;
}

.assistant-input-area::before {
	content: "";
	position: absolute;
	top: -20px;
	left: 0;
	right: 0;
	height: 20px;
	background: linear-gradient(to bottom, transparent, white);
	pointer-events: none;
}

.assistant-input-area :deep(.d-recipe-message-input) {
	background: var(--dt-color-surface-primary);
	border-radius: 12px;
}

.assistant-input-area :deep(.d-recipe-message-input__bottom-section) {
	background: var(--dt-color-surface-primary);
	border-radius: 0 0 12px 12px;
}

.assistant-input-area :deep(.d-btn--circle:not([disabled])) {
	background: var(--dt-color-surface-ai);
	background-size: 200% 200%;
	background-position: 70% 70%;
	color: var(--dt-color-neutral-white);
	overflow: hidden;
}

.assistant-input-area :deep(.d-btn--circle[disabled]) {
	background: none !important;
}
</style>
