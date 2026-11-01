<template>
  <div class="creation">
    <LeftRail />
    <div class="canvas">
      <div class="ambient-glow" />
      <div class="ambient-glow-2" />

      <div class="float float--left">
        <span class="icon-btn" aria-hidden="true">
          <Icon name="arrow-left" :size="16" />
        </span>
        <span class="agent-name">New AI Agent</span>
        <span class="draft">Draft</span>
      </div>

      <div class="float float--right">
        <span class="icon-btn"><Icon name="more-vertical" :size="16" /></span>
        <span class="icon-btn"><Icon name="settings" :size="16" /></span>
        <span class="divider" />
        <span class="text-btn is-disabled">
          <Icon name="play" :size="12" />
          Test
        </span>
        <span class="text-btn is-disabled">Save</span>
        <span class="text-btn text-btn--primary is-disabled">Publish</span>
      </div>

      <div class="panel">
        <h1>Let's get started</h1>
        <p>Describe what you want this agent to do.</p>
        <div class="prompt" data-autoplay="prompt">
          <span class="prompt-placeholder" :class="{ 'is-value': inputText }">{{ inputText || previewText || 'Describe your AI agent in a conversational manner...' }}</span>
          <span class="send" :class="{ 'is-ready': inputText }" aria-hidden="true">
            <Icon name="send" :size="16" />
          </span>
        </div>
        <div class="chips">
          <div class="chip-row">
            <span
              v-for="(chip, i) in suggestionChips.slice(0, 3)"
              :key="chip"
              class="chip"
              :class="{ 'chip--hover': previewIndex === i }"
              :data-autoplay="`chip-${i}`"
            >{{ chip }}</span>
          </div>
          <div class="chip-row">
            <span
              v-for="(chip, i) in suggestionChips.slice(3)"
              :key="chip"
              class="chip"
              :class="{ 'chip--hover': previewIndex === i + 3 }"
              :data-autoplay="`chip-${i + 3}`"
            >{{ chip }}</span>
          </div>
          <div class="chip-row">
            <span class="chip chip--quiet">
              <Icon name="refresh" :size="12" />
              See more examples
            </span>
          </div>
          <button type="button" class="manual">Create manually</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Icon from './Icon.vue'
import LeftRail from './LeftRail.vue'
import { chipPrompts, suggestionChips } from '../agents.js'

const props = defineProps({
  previewIndex: {
    default: null,
    validator: (value) => value == null || Number.isInteger(value),
  },
  inputIndex: {
    default: null,
    validator: (value) => value == null || Number.isInteger(value),
  },
})

function chipSentence(index) {
  if (!Number.isInteger(index)) return ''
  return chipPrompts[suggestionChips[index]] || ''
}

const previewText = computed(() => chipSentence(props.previewIndex))
const inputText = computed(() => chipSentence(props.inputIndex))
</script>

<style scoped>
.creation {
  display: flex;
  width: 100%;
  height: 100%;
  background: #fff;
}

.canvas {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #fff;
  background-image: radial-gradient(circle, #d0d0d0 1px, transparent 1px);
  background-size: 15px 15px;
}

.ambient-glow,
.ambient-glow-2 {
  position: absolute;
  pointer-events: none;
  background-size: 300% 300%;
}

.ambient-glow {
  top: 50%;
  left: 50%;
  width: 660px;
  height: 460px;
  background-image: linear-gradient(135deg, #471571, #7c229e, #e92f6f, #fb7328, #f3960f, #e92f6f, #7c229e, #471571);
  filter: blur(72px);
  opacity: 0.18;
  animation: glow-shape 12s ease-in-out infinite, glow-shift 9s ease-in-out infinite;
}

.ambient-glow-2 {
  top: 18%;
  left: 12%;
  width: 420px;
  height: 300px;
  background-image: linear-gradient(225deg, #2d0b5a, #7c229e, #c2185b, #e92f6f, #9c1058, #471571, #2d0b5a);
  filter: blur(85px);
  opacity: 0.13;
  animation: glow-shape-2 16s ease-in-out infinite, glow-shift-2 11s ease-in-out infinite;
}

@keyframes glow-shape {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
  }
  25% {
    border-radius: 40% 60% 65% 35% / 40% 65% 35% 55%;
    transform: translate(-50%, -50%) scale(1.1) rotate(12deg);
  }
  50% {
    border-radius: 70% 30% 50% 50% / 30% 50% 50% 60%;
    transform: translate(-50%, -50%) scale(0.92) rotate(-8deg);
  }
  75% {
    border-radius: 30% 70% 40% 60% / 65% 35% 65% 35%;
    transform: translate(-50%, -50%) scale(1.08) rotate(5deg);
  }
}

@keyframes glow-shift {
  0%, 100% { background-position: 0% 50%; }
  33% { background-position: 80% 20%; }
  66% { background-position: 40% 90%; }
}

@keyframes glow-shape-2 {
  0%, 100% {
    border-radius: 40% 60% 70% 30% / 50% 40% 60% 50%;
    transform: scale(1) rotate(0deg);
  }
  33% {
    border-radius: 65% 35% 40% 60% / 30% 60% 40% 70%;
    transform: scale(1.14) rotate(-12deg);
  }
  66% {
    border-radius: 30% 70% 60% 40% / 70% 30% 50% 50%;
    transform: scale(0.88) rotate(9deg);
  }
}

@keyframes glow-shift-2 {
  0%, 100% { background-position: 100% 0%; }
  33% { background-position: 20% 80%; }
  66% { background-position: 60% 30%; }
}

.float {
  position: absolute;
  z-index: 2;
  top: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.float--left { left: 16px; }
.float--right { right: 16px; }

.agent-name {
  padding: 2px 4px;
  font-size: 13px;
  font-weight: 500;
  color: #1c1c1c;
}

.draft {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: #f9f9f9;
  color: #1a1a1a;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
}

.icon-btn,
.text-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 28px;
  color: #3a3a3a;
  font-size: 12px;
  font-weight: 600;
}

.icon-btn {
  width: 28px;
}

.text-btn {
  padding: 0 8px;
}

.text-btn--primary {
  background: #7c52ff;
  color: #fff;
  border-radius: 6px;
}

.is-disabled {
  opacity: 0.5;
}

.divider {
  width: 1px;
  height: 20px;
  margin: 0 4px;
  background: #e5e7eb;
}

.panel {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 620px;
  padding: 0 24px;
}

h1 {
  margin: 0 0 8px;
  font-size: 27px;
  font-weight: 510;
  line-height: 1.2;
  color: #1c1c1c;
  text-align: center;
}

p {
  margin: 0 0 20px;
  font-size: 15px;
  color: #535353;
  text-align: center;
}

.prompt {
  position: relative;
  width: 100%;
  max-width: 572px;
  min-height: 96px;
  margin-bottom: 16px;
  padding: 16px 56px 16px 20px;
  background: #fff;
  border: 1px solid rgba(28, 28, 28, 0.12);
  border-radius: 24px;
  box-sizing: border-box;
}

.prompt-placeholder {
  color: #9a9a9a;
  font-size: 15px;
  line-height: 1.4;
}

.prompt-placeholder.is-value {
  color: #1c1c1c;
}

.send {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #c4c4c4;
}

.send.is-ready {
  background: #7c52ff;
  color: #fff;
}

.chips {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #fff;
  border: 0.5px solid rgba(28, 28, 28, 0.11);
  border-radius: 40px;
  color: #1c1c1c;
  font-size: 12px;
  white-space: nowrap;
}

.chip--hover {
  background: #f9f9f9;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.chip.is-pressed {
  background: #f3f3f3;
  transform: scale(0.98);
}

.chip--quiet {
  color: #535353;
}

.manual {
  margin-top: 4px;
  padding: 4px 0;
  background: none;
  border: none;
  color: #808080;
  font-size: 15px;
  text-decoration: underline;
  cursor: default;
}
</style>
