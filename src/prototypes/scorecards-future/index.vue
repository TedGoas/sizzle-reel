<template>
  <div class="scorecards-future-app" ref="appRef">
    <LeftBar activeItem="settings" />
    <main class="scorecards-future-content">
      <BuildWorkspace ref="workspaceRef" />
    </main>

    <div
      class="autoplay-cursor"
      :class="{ 'autoplay-cursor--clicking': cursorClicking }"
      :style="cursorStyle"
      aria-hidden="true"
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M5 3.5 21.5 15.2l-6.6 1.5 3.8 7.8-3.1 1.5-3.9-7.9L5 24.2V3.5Z"
          fill="white"
          stroke="#1A1A1A"
          stroke-width="1.25"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import LeftBar from '@/components/LeftBar.vue'
import BuildWorkspace from './components/BuildWorkspace.vue'
import {
  PROMPT,
  USER_A1,
  USER_A2,
  AI_Q1,
  AI_Q2,
  AI_PREVIEW,
  THINK_1,
  THINK_2,
  THINK_3,
  THINK_3_TOOLS,
} from './data/script.js'

const appRef = ref(null)
const workspaceRef = ref(null)

const cursorX = ref(98)
const cursorY = ref(80)
const cursorClicking = ref(false)
const cursorMoving = ref(false)
const moveDuration = ref(700)

const cursorStyle = computed(() => ({
  transform: `translate(${cursorX.value}px, ${cursorY.value}px)`,
  transition: cursorMoving.value
    ? `transform ${moveDuration.value}ms cubic-bezier(0.22, 1, 0.36, 1)`
    : 'none',
}))

function queryEl(selector) {
  return appRef.value?.querySelector(selector) || null
}

function pointAt(el) {
  if (!el || !appRef.value) return
  const origin = appRef.value.getBoundingClientRect()
  const box = el.getBoundingClientRect()
  cursorX.value = box.left + box.width / 2 - origin.left - 5
  cursorY.value = box.top + box.height / 2 - origin.top - 3
}

let running = false
const pending = []

function sleep(ms) {
  return new Promise((resolve) => {
    const id = setTimeout(resolve, ms)
    pending.push(id)
  })
}

async function moveTo(el, duration = 700) {
  if (!el || !running) return
  moveDuration.value = duration
  cursorMoving.value = true
  pointAt(el)
  await sleep(duration)
  cursorMoving.value = false
}

async function clickEl(el) {
  if (!running) return
  cursorClicking.value = true
  el?.classList.add('autoplay-pressed')
  await sleep(180)
  el?.classList.remove('autoplay-pressed')
  cursorClicking.value = false
}

async function think(phrases, tools = []) {
  const workspace = workspaceRef.value
  if (!workspace || !running) return
  workspace.startThink()
  await nextTick()
  for (let i = 0; i < phrases.length; i++) {
    if (!running) return
    workspace.addThinkStep(phrases[i])
    await sleep(720)
    if (tools[i]) {
      workspace.addToolChip(tools[i])
      await sleep(380)
    }
  }
  await sleep(320)
  if (!running) return
  workspace.collapseThinking()
  await sleep(280)
}

async function streamReply(text) {
  const workspace = workspaceRef.value
  if (!workspace || !running) return
  await workspace.streamAi(text, sleep)
}

async function typeAndSend(text, sendSelector) {
  const workspace = workspaceRef.value
  const input = queryEl('[data-autoplay="composer-input"]')
  await moveTo(input)
  input?.focus()
  await sleep(180)
  if (!running) return
  await workspace?.typePrompt(text, sleep)
  await sleep(350)
  if (!running) return
  const sendBtn = queryEl(sendSelector)
  await moveTo(sendBtn)
  await clickEl(sendBtn)
  if (!running) return
  workspace?.submitReply()
}

function resetFilm() {
  cursorClicking.value = false
  workspaceRef.value?.resetDemo()
}

async function runFilm() {
  running = true
  resetFilm()
  await nextTick()
  await sleep(1400)
  if (!running) return

  const workspace = workspaceRef.value

  const input = queryEl('[data-autoplay="composer-input"]')
  await moveTo(input, 800)
  input?.focus()
  await sleep(200)
  if (!running) return

  await workspace?.typePrompt(PROMPT, sleep)
  await sleep(400)
  if (!running) return

  const createBtn = queryEl('[data-autoplay="create"]')
  await moveTo(createBtn)
  await clickEl(createBtn)
  workspace?.submitCreate()
  await nextTick()
  await sleep(400)
  if (!running) return

  await think(THINK_1)
  if (!running) return
  await streamReply(AI_Q1)
  await sleep(500)
  if (!running) return

  await typeAndSend(USER_A1, '[data-autoplay="send"]')
  await nextTick()
  await sleep(300)
  if (!running) return

  await think(THINK_2)
  if (!running) return
  await streamReply(AI_Q2)
  await sleep(500)
  if (!running) return

  await typeAndSend(USER_A2, '[data-autoplay="send"]')
  await nextTick()
  await sleep(300)
  if (!running) return

  await think(THINK_3, THINK_3_TOOLS)
  if (!running) return
  await streamReply(AI_PREVIEW)
  await sleep(400)
  if (!running) return

  workspace?.showPreview()
  await nextTick()
  await sleep(700)
  if (!running) return

  const firstQuestion = queryEl('[data-autoplay="question-0"]')
  firstQuestion?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  await nextTick()
  await moveTo(firstQuestion, 800)
  await clickEl(firstQuestion)
  workspace?.selectQuestion(1)
  await nextTick()
  await sleep(800)

  running = false
}

onMounted(() => {
  runFilm()
})

onUnmounted(() => {
  running = false
  pending.forEach(clearTimeout)
})
</script>

<style scoped>
.scorecards-future-app {
  display: grid;
  grid-template-columns: 50px 1fr;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: var(--dt-font-family-body);
  position: relative;
}

.scorecards-future-content {
  overflow: hidden;
  background: var(--dt-color-surface-primary);
  height: 100%;
}

.autoplay-cursor {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 30;
  width: 28px;
  height: 28px;
  pointer-events: none;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.28));
}

.autoplay-cursor svg {
  display: block;
  transition: transform 0.12s ease;
}

.autoplay-cursor--clicking svg {
  transform: scale(0.88);
  transform-origin: 5px 3px;
}

:deep(.autoplay-pressed) {
  filter: brightness(0.9);
  transform: scale(0.98);
}
</style>
