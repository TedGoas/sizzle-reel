<template>
  <div class="scorecards-app" ref="appRef">
    <LeftBar :activeItem="activeItem" @icon-click="handleIconClick" />
    <main class="scorecards-content">
      <div
        class="view-layer"
        :class="{ 'view-layer--visible': activeView === 'builder' }"
      >
        <BuilderView ref="builderRef" />
      </div>
      <div
        class="view-layer"
        :class="{ 'view-layer--visible': activeView === 'call-review' }"
      >
        <CallReviewView
          ref="callReviewRef"
          :selections="selections"
          :ai-reveal-count="aiRevealCount"
        />
      </div>
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
import { ref, computed, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import LeftBar from '@/components/LeftBar.vue'
import BuilderView from './components/BuilderView.vue'
import CallReviewView from './components/CallReviewView.vue'
import { scorecardQuestions } from './data/callData.js'

const VIEW_FADE_MS = 1000
const AI_QUESTION_COUNT = scorecardQuestions.filter((q) => q.aiSuggest).length

const appRef = ref(null)
const builderRef = ref(null)
const callReviewRef = ref(null)
const activeView = ref('builder')
const selections = reactive({})
const aiRevealCount = ref(0)

const cursorX = ref(98)
const cursorY = ref(80)
const cursorClicking = ref(false)
const cursorMoving = ref(false)
const moveDuration = ref(700)

const activeItem = computed(() => {
  switch (activeView.value) {
    case 'builder': return 'settings'
    case 'call-review': return 'history'
    default: return 'settings'
  }
})

const cursorStyle = computed(() => ({
  transform: `translate(${cursorX.value}px, ${cursorY.value}px)`,
  transition: cursorMoving.value
    ? `transform ${moveDuration.value}ms cubic-bezier(0.22, 1, 0.36, 1)`
    : 'none',
}))

function handleIconClick(iconName) {
  switch (iconName) {
    case 'settings': activeView.value = 'builder'; break
    case 'history': activeView.value = 'call-review'; break
  }
}

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

function resetSelections() {
  Object.keys(selections).forEach((key) => {
    delete selections[key]
  })
}

function resetFilm() {
  activeView.value = 'builder'
  aiRevealCount.value = 0
  resetSelections()
  cursorClicking.value = false
  callReviewRef.value?.clearEvidence()
  builderRef.value?.resetDemo()
}

async function runFilm() {
  running = true
  resetFilm()
  await nextTick()
  await sleep(1400)
  if (!running) return

  const selectBtn = queryEl('[data-autoplay="select-ai-questions"]')
  await moveTo(selectBtn)
  await clickEl(selectBtn)
  builderRef.value?.openAiPicker()
  await nextTick()
  await sleep(450)
  if (!running) return

  const firstQuestion = queryEl('[data-autoplay="ai-question-0"]')
  await moveTo(firstQuestion, 800)
  await clickEl(firstQuestion)
  builderRef.value?.applyAiQuestion(0)
  await nextTick()
  await sleep(550)
  if (!running) return

  const triggerInput = queryEl('#trigger-words')
  await moveTo(triggerInput)
  triggerInput?.focus()
  await sleep(200)
  if (!running) return

  await builderRef.value?.typeTriggerPhrase('hello', sleep)
  await sleep(400)
  if (!running) return

  await builderRef.value?.typeTriggerPhrase('how are you today', sleep)
  await sleep(1000)
  if (!running) return

  const saveBtn = queryEl('[data-autoplay="save-question"]')
  await moveTo(saveBtn)
  await clickEl(saveBtn)

  activeView.value = 'call-review'
  await sleep(VIEW_FADE_MS)
  await nextTick()
  if (!running) return

  await sleep(500)
  if (!running) return

  for (let n = 1; n <= AI_QUESTION_COUNT; n++) {
    aiRevealCount.value = n
    await sleep(180)
    if (!running) return
  }

  await sleep(400)
  if (!running) return

  const evidenceBadge = queryEl('[data-autoplay="ai-badge-0"]')
  await moveTo(evidenceBadge)
  await clickEl(evidenceBadge)
  callReviewRef.value?.showEvidence('greet')
  await sleep(1600)
  if (!running) return

  const lastGradedIndex = 4

  for (let i = 0; i <= lastGradedIndex; i++) {
    const q = scorecardQuestions[i]
    const choice = q.aiSuggest || q.answer
    const radio = queryEl(`[data-autoplay="q-${i}-${choice}"]`)
    if (i === lastGradedIndex) {
      radio?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
      await nextTick()
    }
    await moveTo(radio, i === 0 ? 1000 : 700)
    await clickEl(radio)
    selections[i] = choice
    await sleep(320)
    if (!running) return
  }

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
.scorecards-app {
  display: grid;
  grid-template-columns: 50px 1fr;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: var(--dt-font-family-body);
  position: relative;
}

.scorecards-content {
  position: relative;
  overflow: hidden;
  background: white;
  height: 100%;
}

.view-layer {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 1s ease;
}

.view-layer > * {
  height: 100%;
}

.view-layer--visible {
  opacity: 1;
  pointer-events: auto;
  z-index: 1;
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
