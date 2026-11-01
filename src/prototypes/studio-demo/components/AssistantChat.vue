<template>
  <aside class="assistant" :style="panelStyle">
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
      <span class="close" aria-hidden="true">
        <svg viewBox="0 0 12 12"><path d="M3 3l6 6M9 3 3 9" /></svg>
      </span>
    </header>

    <div class="messages">
      <div class="message message--user">
        <div class="bubble">{{ userText }}</div>
      </div>

      <div v-if="chat.showThought" class="thought">
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M6 1.2 6.7 4.2 9.8 4.8 6.7 5.5 6 8.5 5.3 5.5 2.2 4.8 5.3 4.2 6 1.2Z" />
        </svg>
        Thought for {{ chat.thoughtSeconds }}s
        <svg class="chevron" viewBox="0 0 12 12" aria-hidden="true"><path d="M4.5 2.5 8 6 4.5 9.5" /></svg>
      </div>

      <div v-if="chat.reply" class="message message--ai">
        <p>{{ chat.reply }}</p>
        <ul>
          <li v-for="skill in skills" :key="skill">{{ skill }}</li>
        </ul>
        <span class="summary">Hide summary</span>
      </div>

      <div v-if="chat.typing" class="typing" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
    </div>

    <div class="composer">
      <span>Ask for changes</span>
      <span class="send" aria-hidden="true">
        <Icon name="send" :size="14" />
      </span>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import Icon from './Icon.vue'
import { chipPrompts } from '../agents.js'

const props = defineProps({
  chat: { type: Object, required: true },
})

const userText = chipPrompts['AI Receptionist']
const skills = ['Route Incoming Calls', 'Take Messages', 'Schedule Callbacks']

const panelStyle = computed(() => {
  const slide = props.chat.slide || 0
  return {
    transform: `translateX(${(1 - slide) * -100}%)`,
    opacity: Math.max(0, Math.min(1, slide)),
  }
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
  overflow: hidden;
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
  justify-content: space-between;
  margin: 12px 16px 16px;
  padding: 10px 8px 10px 14px;
  border: 1px solid rgba(28, 28, 28, 0.12);
  border-radius: 12px;
  color: #9a9a9a;
  font-size: 15px;
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
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: #c4c4c4;
}
</style>
