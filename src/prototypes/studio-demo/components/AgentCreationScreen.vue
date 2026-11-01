<template>
  <div class="creation">
    <LeftRail />
    <div class="canvas">
      <div class="ambient-glow" :class="{ 'is-faded': phase === 'canvas' }" />
      <div class="ambient-glow-2" :class="{ 'is-faded': phase === 'canvas' }" />

      <div class="float float--left">
        <span class="icon-btn" aria-hidden="true">
          <Icon name="arrow-left" :size="16" />
        </span>
        <span class="agent-name">{{ phase === 'canvas' ? 'AI Receptionist' : 'New AI Agent' }}</span>
        <span class="draft">Draft</span>
      </div>

      <div class="float float--right">
        <span class="icon-btn"><Icon name="more-vertical" :size="16" /></span>
        <span class="icon-btn"><Icon name="settings" :size="16" /></span>
        <span class="divider" />
        <span class="text-btn" :class="{ 'is-disabled': phase !== 'canvas' }">
          <Icon name="play" :size="12" />
          Test
        </span>
        <span class="text-btn" :class="{ 'is-disabled': phase !== 'canvas' }">Save</span>
        <span
          class="text-btn"
          :class="phase === 'canvas' ? 'text-btn--outline is-disabled' : 'text-btn--primary is-disabled'"
        >Publish</span>
      </div>

      <div class="panel" :class="{ 'is-building': phase === 'building', 'is-gone': phase === 'canvas' }">
        <Transition name="heading" mode="out-in">
          <h1 :key="heading">{{ heading }}</h1>
        </Transition>
        <Transition name="heading" mode="out-in">
          <p :key="subtext">{{ subtext }}</p>
        </Transition>
        <div class="prompt" data-autoplay="prompt">
          <span class="prompt-placeholder" :class="{ 'is-value': inputText }">{{ inputText || previewText || 'Describe your AI agent in a conversational manner...' }}</span>
          <span class="send" :class="{ 'is-ready': inputText }" data-autoplay="send" aria-hidden="true">
            <span v-if="phase === 'building'" class="spinner" />
            <Icon v-else name="send" :size="16" />
          </span>
        </div>
        <div class="chips" :class="{ 'is-hidden': phase === 'building' || phase === 'canvas' }">
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

      <AgentCanvas
        v-if="phase === 'canvas'"
        :count="revealedCount"
        :shimmering="shimmering"
        :entering="entering"
      />

      <div v-if="phase === 'canvas'" class="dock">
        <span class="assist" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="M8 1.2 9.1 5.4 13.4 6.2 9.1 7.1 8 11.3 6.9 7.1 2.6 6.2 6.9 5.4 8 1.2Z" />
            <path d="M12.4 9.4 12.8 10.8 14.2 11.1 12.8 11.5 12.4 12.9 12 11.5 10.6 11.1 12 10.8 12.4 9.4Z" />
          </svg>
        </span>
        <span class="zoom">
          <svg viewBox="0 0 16 16"><path d="M3 8h10" /></svg>
          <svg viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" /></svg>
          <svg viewBox="0 0 16 16"><path d="M6 2.5H3.5V5M10 2.5h2.5V5M6 13.5H3.5V11M10 13.5h2.5V11" /></svg>
          <svg viewBox="0 0 16 16"><path d="M6 3H3v3M10 3h3v3M6 13H3v-3M10 13h3v-3" /></svg>
          <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.2" /><path d="M8 5.4v3.2M8 11.1v.1" /></svg>
        </span>
        <span class="add" aria-hidden="true">
          <svg viewBox="0 0 16 16"><path d="M8 3.5v9M3.5 8h9" /></svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Icon from './Icon.vue'
import LeftRail from './LeftRail.vue'
import AgentCanvas from './AgentCanvas.vue'
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
  phase: { type: String, default: 'edit' },
  revealedCount: { type: Number, default: 0 },
  shimmering: { type: Array, default: () => [] },
  entering: { type: Array, default: () => [] },
})

function chipSentence(index) {
  if (!Number.isInteger(index)) return ''
  return chipPrompts[suggestionChips[index]] || ''
}

const previewText = computed(() => chipSentence(props.previewIndex))
const inputText = computed(() => chipSentence(props.inputIndex))
const heading = computed(() => (props.phase === 'building' ? 'Building your agent...' : "Let's get started"))
const subtext = computed(() => (
  props.phase === 'building'
    ? "Great description! We'll take it from here. Hang tight."
    : 'Describe what you want this agent to do.'
))
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
  transition: opacity 0.6s ease;
}

.ambient-glow.is-faded,
.ambient-glow-2.is-faded {
  opacity: 0;
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

.text-btn--outline {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fff;
  color: #9a9a9a;
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
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.panel.is-gone {
  opacity: 0;
  transform: scale(0.97);
  pointer-events: none;
}

.heading-enter-active,
.heading-leave-active {
  transition: opacity 0.25s ease;
}

.heading-enter-from,
.heading-leave-to {
  opacity: 0;
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

.send.is-pressed {
  transform: scale(0.92);
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: send-spin 0.7s linear infinite;
}

@keyframes send-spin {
  to { transform: rotate(360deg); }
}

.chips {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-height: 240px;
  overflow: hidden;
  transition: opacity 0.35s ease, max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.chips.is-hidden {
  max-height: 0;
  opacity: 0;
  pointer-events: none;
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

.dock {
  position: absolute;
  z-index: 2;
  right: 0;
  bottom: 0;
  left: 0;
  height: 80px;
  pointer-events: none;
  animation: dock-in 0.45s ease;
}

@keyframes dock-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.assist,
.add,
.zoom {
  position: absolute;
  bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.assist {
  left: 16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f97316 100%);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
  color: #fff;
}

.assist svg,
.add svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linejoin: round;
}

.assist svg { fill: currentColor; stroke: none; }

.zoom {
  left: 88px;
  gap: 0;
  padding: 4px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #666;
}

.zoom svg {
  width: 32px;
  height: 32px;
  padding: 6px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  box-sizing: border-box;
}

.add {
  right: 16px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #9358ff;
  box-shadow: 0 4px 12px rgba(147, 88, 255, 0.3);
  color: #fff;
}
</style>
