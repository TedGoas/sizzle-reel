<template>
  <aside class="assistant" :class="{ 'is-in': entered }">
    <header class="assistant-header">
      <span class="assistant-title">
        <svg class="spark" viewBox="0 0 12 12" aria-hidden="true">
          <defs>
            <linearGradient id="assistant-ai-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#9333ea" />
              <stop offset="50%" stop-color="#ec4899" />
              <stop offset="100%" stop-color="#f97316" />
            </linearGradient>
          </defs>
          <path fill="url(#assistant-ai-grad)" d="M9 0a.5.5 0 0 1 .5.5V1h.5a.5.5 0 1 1 0 1h-.5v.5a.5.5 0 1 1-1 0V2H8a.5.5 0 0 1 0-1h.5V.5A.5.5 0 0 1 9 0ZM2.5 2a.5.5 0 0 0-.5.5v7.6l1.5-.9a.5.5 0 0 1 .25-.07H9.5a.5.5 0 0 0 .5-.5V6.9a.5.5 0 0 1 1 0v1.7a1.5 1.5 0 0 1-1.5 1.5H3.9L1.8 11.4A.5.5 0 0 1 1 11V2.5A1.5 1.5 0 0 1 2.5 1h4a.5.5 0 0 1 0 1h-4ZM6 3a.5.5 0 0 1 .45.3l.55 1.2 1.2.55a.5.5 0 0 1 0 .9l-1.2.55-.55 1.2a.5.5 0 0 1-.9 0l-.55-1.2-1.2-.55a.5.5 0 0 1 0-.9l1.2-.55.55-1.2A.5.5 0 0 1 6 3Z" />
        </svg>
        Assistant
      </span>
      <button type="button" class="close" aria-label="Close assistant" @click="emit('close')">
        <svg viewBox="0 0 12 12"><path d="M3 3l6 6M9 3 3 9" /></svg>
      </button>
    </header>

    <div ref="messagesEl" class="messages">
      <template v-for="msg in messages" :key="msg.id">
        <div v-if="msg.role === 'user'" class="message message--user">
          <div class="bubble">{{ msg.content }}</div>
        </div>

        <div v-else-if="msg.role === 'thought'" class="thought">
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path d="M6 1.2 6.7 4.2 9.8 4.8 6.7 5.5 6 8.5 5.3 5.5 2.2 4.8 5.3 4.2 6 1.2Z" />
          </svg>
          Thought for {{ msg.seconds }}s
          <svg class="chevron" viewBox="0 0 12 12" aria-hidden="true"><path d="M4.5 2.5 8 6 4.5 9.5" /></svg>
        </div>

        <div v-else-if="msg.role === 'assistant' && (msg.content || msg.ideas?.length || msg.closing)" class="message message--ai">
          <p v-if="msg.content">{{ msg.content }}</p>
          <p v-for="(idea, index) in msg.ideas" :key="index" class="idea">
            <strong>{{ idea.name }}</strong><span v-if="idea.detail"> – {{ idea.detail }}</span>
          </p>
          <p v-if="msg.closing" class="closing">{{ msg.closing }}</p>
          <ul v-if="msg.bullets?.length">
            <li v-for="skill in msg.bullets" :key="skill">{{ skill }}</li>
          </ul>
          <span v-if="msg.bullets?.length" class="summary">Hide summary</span>
        </div>
      </template>

      <div v-if="typing" class="typing" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
    </div>

    <form class="composer" @submit.prevent="send">
      <input
        v-model="draft"
        type="text"
        placeholder="Ask for changes"
        aria-label="Ask for changes"
      />
      <button type="submit" class="send" :class="{ 'is-ready': draft.trim() }" aria-label="Send">
        <Icon name="send" :size="14" />
      </button>
    </form>
  </aside>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import Icon from './Icon.vue'
import { skillAdviceClosing, skillAdviceHandles, skillIdeas } from '../agents.js'

const props = defineProps({
  userText: { type: String, required: true },
  agentName: { type: String, required: true },
  skills: { type: Array, default: () => [] },
  openingSkills: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'action'])

const entered = ref(false)
const typing = ref(false)
const draft = ref('')
const messagesEl = ref(null)
const messages = ref([{ id: 1, role: 'user', content: props.userText }])
const timers = []
let ticker = 0
let nextId = 2

function openingCopy() {
  const names = props.openingSkills
  const count = names.length
  if (!count) {
    return {
      text: `I'm setting up ${props.agentName} now. The skills will appear on the canvas shortly. Let me know if you'd like to adjust anything.`,
      bullets: null,
    }
  }
  const noun = count === 1 ? 'skill' : 'skills'
  return {
    text: `All set! I've created ${props.agentName} with ${count} ${noun} to handle your request. Let me know if you'd like to adjust anything.`,
    bullets: [...names],
  }
}

function scroll() {
  nextTick(() => {
    const el = messagesEl.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

function messageById(id) {
  return messages.value.find((msg) => msg.id === id)
}

function typeInto(id, text) {
  let i = 0
  const typer = setInterval(() => {
    i += 1
    const msg = messageById(id)
    if (!msg) {
      clearInterval(typer)
      return
    }
    msg.content = text.slice(0, i)
    scroll()
    if (i >= text.length) clearInterval(typer)
  }, 8)
  timers.push(typer)
}

function capitalize(value) {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function asksForIdeas(text) {
  const lower = text.toLowerCase()
  const asks = /\b(what|which|suggest|recommend|should|think|idea|ideas)\b/.test(lower)
  if (!asks) return false
  if (/\bskills?\b/.test(lower)) return true
  return /\b(suggest|recommend|add|change|include|idea|ideas)\b/.test(lower)
}

function adviceForAgent() {
  const handles = skillAdviceHandles[props.agentName] || 'the work you described'
  return {
    intro: `Good question! Given your ${props.agentName} already handles ${handles}, I'd suggest one of these:`,
    ideas: skillIdeas,
    closing: skillAdviceClosing,
  }
}

function wantsGuardrails(text) {
  const lower = text.toLowerCase()
  if (!/\bguardrails?\b/.test(lower)) return false
  const missing = /\b(no|none|missing|without|empty|lack|lacks|doesn't|doesnt|don't|dont)\b/.test(lower)
  const add = /\b(add|generate|write|create|include|put|give|need)\b/.test(lower)
  return missing || add
}

function wantsReschedule(text) {
  const lower = text.toLowerCase()
  if (!/reschedul/.test(lower)) return false
  if (asksForIdeas(text) && !/\b(add|create|include|want|let's|lets)\b/.test(lower)) return false
  return true
}

function fallback(text) {
  const lower = text.toLowerCase()
  if (wantsReschedule(text)) {
    return {
      responseText: "Done! I've added Reschedule Appointments to your canvas. It walks through retrieving the appointment, showing available slots, confirming the new time, updating it, and sending a confirmation email.",
      skipThought: true,
      action: {
        type: 'add_skill',
        name: 'Reschedule Appointments',
        description: 'Moves an existing booking to a new time and sends a confirmation email.',
        actions: 5,
      },
    }
  }
  if (wantsGuardrails(text)) {
    return {
      responseText: "Done! I've added guardrails to Reschedule Appointments.",
      guardrails: true,
      action: null,
    }
  }
  if (asksForIdeas(text)) {
    return { advice: adviceForAgent(), action: null }
  }
  if (/\b(create|add)\b.*(skill|capability|feature|ability)/i.test(lower)) {
    const match = text.match(
      /(?:create|add)\s+(?:a\s+)?(?:new\s+)?(?:skill\s+(?:for|to(?:\s+handle)?)\s+)?(.+?)(?:\s+skill)?$/i,
    )
    const name = capitalize((match?.[1] || 'New Skill').trim().replace(/\.$/, ''))
    return {
      responseText: `I've created a "${name}" skill and will generate the full instructions from your description now.`,
      action: {
        type: 'add_skill',
        name,
        description: `Handles ${name.toLowerCase()} requests.`,
      },
    }
  }
  if (/\b(remove|delete)\b/i.test(lower)) {
    const matched = props.skills.find((name) => lower.includes(name.toLowerCase()))
    if (matched) {
      return {
        responseText: `I've removed "${matched}" from the canvas.`,
        action: { type: 'remove_skill', name: matched },
      }
    }
    return { responseText: 'Which skill would you like to remove?', action: null }
  }
  if (/rename.*agent|call.*agent|agent.*name/i.test(lower)) {
    const match = text.match(/["']([^"']+)["']/)
      || text.match(/(?:to|called?|named?)\s+([A-Za-z0-9 &'-]+)/i)
    const name = match ? capitalize(match[1].trim()) : null
    if (name) {
      return {
        responseText: `Done! I've renamed the agent to "${name}".`,
        action: { type: 'rename_agent', name },
      }
    }
  }
  return {
    responseText: "Sure, could you give me a bit more detail about what you'd like to change?",
    action: null,
  }
}

function typeAdvice(id, advice) {
  const parts = [
    { field: 'content', text: advice.intro },
    ...advice.ideas.map((idea) => ({ field: 'idea', name: idea.name, text: idea.detail })),
    { field: 'closing', text: advice.closing },
  ]
  let part = 0
  let i = 0
  const typer = setInterval(() => {
    const msg = messageById(id)
    const piece = parts[part]
    if (!msg || !piece) {
      clearInterval(typer)
      return
    }
    if (piece.field === 'idea' && i === 0) {
      msg.ideas = [...(msg.ideas || []), { name: piece.name, detail: '' }]
    }
    i += 1
    if (piece.field === 'content') msg.content = piece.text.slice(0, i)
    if (piece.field === 'closing') msg.closing = piece.text.slice(0, i)
    if (piece.field === 'idea') {
      const ideas = msg.ideas.map((idea, index) => (
        index === msg.ideas.length - 1 ? { ...idea, detail: piece.text.slice(0, i) } : idea
      ))
      msg.ideas = ideas
    }
    scroll()
    if (i >= piece.text.length) {
      part += 1
      i = 0
      if (part >= parts.length) clearInterval(typer)
    }
  }, 8)
  timers.push(typer)
}

function thinkThen(ms, then, seconds = 10) {
  const thoughtId = nextId++
  messages.value.push({ id: thoughtId, role: 'thought', seconds: 0 })
  typing.value = true
  scroll()
  const count = setInterval(() => {
    const thought = messageById(thoughtId)
    if (thought) thought.seconds += 1
  }, 1000)
  timers.push(count)
  timers.push(setTimeout(() => {
    clearInterval(count)
    const thought = messageById(thoughtId)
    if (thought) thought.seconds = seconds
    typing.value = false
    then()
  }, ms))
}

function send() {
  const text = draft.value.trim()
  if (!text) return
  draft.value = ''
  messages.value.push({ id: nextId++, role: 'user', content: text })
  const result = fallback(text)
  if (result.advice) {
    thinkThen(10050, () => {
      const replyId = nextId++
      messages.value.push({ id: replyId, role: 'assistant', content: '', ideas: [], closing: '' })
      typeAdvice(replyId, result.advice)
    })
    return
  }
  if (result.guardrails) {
    emit('action', { type: 'add_guardrails', phase: 'start' })
    thinkThen(4450, () => {
      emit('action', { type: 'add_guardrails', phase: 'write' })
      const replyId = nextId++
      messages.value.push({ id: replyId, role: 'assistant', content: '' })
      typeInto(replyId, result.responseText)
    }, 4)
    return
  }
  if (!result.skipThought) {
    messages.value.push({ id: nextId++, role: 'thought', seconds: 0 })
  }
  if (result.action) emit('action', result.action)
  const replyId = nextId++
  messages.value.push({ id: replyId, role: 'assistant', content: '' })
  typeInto(replyId, result.responseText)
}

onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { entered.value = true })
  })
  timers.push(setTimeout(() => {
    const thoughtId = nextId++
    messages.value.push({ id: thoughtId, role: 'thought', seconds: 0 })
    typing.value = true
    scroll()
    ticker = setInterval(() => {
      const thought = messageById(thoughtId)
      if (thought) thought.seconds += 1
    }, 1000)
  }, 400))
  // Thought starts 400ms after open and counts one real second at a time.
  // The reply waits until that count reaches 8.
  const replyAt = props.openingSkills.length ? 8450 : 1200
  timers.push(setTimeout(() => {
    clearInterval(ticker)
    typing.value = false
    const replyId = nextId++
    const opening = openingCopy()
    messages.value.push({
      id: replyId,
      role: 'assistant',
      content: '',
      bullets: opening.bullets,
    })
    typeInto(replyId, opening.text)
  }, replyAt))
})

onUnmounted(() => {
  timers.forEach((id) => {
    clearTimeout(id)
    clearInterval(id)
  })
  clearInterval(ticker)
})
</script>

<style scoped>
.assistant {
  position: absolute;
  z-index: 4;
  top: 16px;
  left: 16px;
  bottom: 16px;
  width: 360px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border-radius: 24px;
  box-shadow:
    0 2px 16px rgba(0, 0, 0, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 1px 2px rgba(0, 0, 0, 0.03);
  opacity: 0;
  transform: translateX(-100%);
  transition: transform 0.45s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.35s ease;
}

.assistant.is-in {
  opacity: 1;
  transform: translateX(0);
}

.assistant-header {
  position: relative;
  z-index: 1;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 12px 0 16px;
}

.assistant-header::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -20px;
  left: 0;
  height: 20px;
  background: linear-gradient(to bottom, #fff, transparent);
  pointer-events: none;
}

.assistant-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1c1c1c;
  font-size: 15px;
  font-weight: 590;
  line-height: 1.6;
}

.spark {
  width: 20px;
  height: 20px;
}

.close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: #666;
  cursor: pointer;
}

.close svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
}

.messages {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-height: 0;
  padding: 16px;
  overflow-x: hidden;
  overflow-y: auto;
}

.message--user {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.bubble {
  max-width: 78%;
  padding: 14px 18px;
  border-radius: 16px;
  background: #e9e9e9;
  color: #1c1c1c;
  font-size: 15px;
  line-height: 1.4;
}

.thought {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
  padding: 6px 0;
  color: #3a3a3a;
  font-size: 12px;
}

.thought svg {
  width: 12px;
  height: 12px;
  fill: currentColor;
}

.thought .chevron {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.message--ai {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 8px;
}

.message--ai p {
  margin: 0 0 8px;
  color: #1c1c1c;
  font-size: 15px;
  line-height: 1.5;
}

.idea {
  margin: 16px 0;
}

.idea strong {
  font-weight: 650;
}

.closing {
  margin-top: 16px;
}

.message--ai ul {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0 0 8px;
  padding-left: 20px;
  list-style: disc;
}

.message--ai li {
  color: #1c1c1c;
  font-size: 14px;
  line-height: 1.5;
}

.summary {
  color: #3a3a3a;
  font-size: 13px;
}

.typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
}

.typing span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #aaa;
  animation: typing-bounce 1.2s ease-in-out infinite;
}

.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-6px); opacity: 1; }
}

.composer {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  margin: 12px 16px 16px;
  padding: 6px 6px 6px 14px;
  border: 1px solid rgba(28, 28, 28, 0.12);
  border-radius: 12px;
  background: #fff;
  font-size: 15px;
}

.composer input {
  flex: 1;
  min-width: 0;
  height: 32px;
  border: 0;
  outline: none;
  background: transparent;
  color: #1c1c1c;
  font: inherit;
}

.composer input::placeholder {
  color: #9a9a9a;
}

.composer::before {
  content: '';
  position: absolute;
  top: -32px;
  right: -16px;
  left: -16px;
  height: 20px;
  background: linear-gradient(to bottom, transparent, #fff);
  pointer-events: none;
}

.send {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #c4c4c4;
  cursor: default;
}

.send.is-ready {
  background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f97316 100%);
  color: #fff;
  cursor: pointer;
}
</style>
