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
          :scorecard-mode="scorecardMode"
          :selections="selections"
        />
      </div>
      <div
        class="view-layer"
        :class="{ 'view-layer--visible': activeView === 'analytics' }"
      >
        <AnalyticsView ref="analyticsRef" />
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
import AnalyticsView from './components/AnalyticsView.vue'
import { scorecardQuestions } from './data/callData.js'
import { HOVER_PATH } from './data/analyticsData.js'

const TYPED_QUESTION = 'Did the agent greet the customer?'
const VIEW_FADE_MS = 1000

const appRef = ref(null)
const builderRef = ref(null)
const analyticsRef = ref(null)
const activeView = ref('builder')
const scorecardMode = ref('grading')
const selections = reactive({})

const cursorX = ref(98)
const cursorY = ref(80)
const cursorClicking = ref(false)
const cursorMoving = ref(false)
const moveDuration = ref(700)

const activeItem = computed(() => {
  switch (activeView.value) {
    case 'builder': return 'settings'
    case 'call-review': return 'history'
    case 'analytics': return 'trending-up'
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
    case 'trending-up': activeView.value = 'analytics'; break
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
  analyticsRef.value?.clearChartHover()
  activeView.value = 'builder'
  scorecardMode.value = 'grading'
  resetSelections()
  cursorClicking.value = false
  builderRef.value?.resetDemo()
}

async function runFilm() {
  running = true
  resetFilm()
  await nextTick()
  await sleep(1500)
  if (!running) return

  const createBtn = queryEl('[data-autoplay="create-cta"]')
  await moveTo(createBtn)
  await clickEl(createBtn)

  builderRef.value?.setScene('builder')
  await nextTick()
  await sleep(400)
  if (!running) return

  const titleInput = queryEl('.ai-question-input')
  await moveTo(titleInput)
  await sleep(200)
  await builderRef.value?.typeQuestion(TYPED_QUESTION, sleep)
  await sleep(350)
  if (!running) return

  const saveBtn = queryEl('.footer-btn--save')
  await moveTo(saveBtn)
  await clickEl(saveBtn)

  activeView.value = 'call-review'
  scorecardMode.value = 'grading'
  await sleep(VIEW_FADE_MS)
  await nextTick()
  if (!running) return

  const q1Yes = queryEl('[data-autoplay="q-0-Yes"]')
  await moveTo(q1Yes, 1000)
  await clickEl(q1Yes)
  selections[0] = 'Yes'
  await sleep(500)
  if (!running) return

  const q2Yes = queryEl('[data-autoplay="q-1-Yes"]')
  await moveTo(q2Yes, 1100)
  await clickEl(q2Yes)
  selections[1] = 'Yes'
  await sleep(600)
  if (!running) return

  scorecardQuestions.forEach((q, i) => {
    if (selections[i] == null) {
      selections[i] = i === 4 || i === 7 ? 'No' : (q.answer || 'Yes')
    }
  })
  scorecardMode.value = 'graded'
  await sleep(VIEW_FADE_MS)
  await sleep(1500)
  if (!running) return

  activeView.value = 'analytics'
  await nextTick()
  analyticsRef.value?.playReveal()
  await sleep(VIEW_FADE_MS)
  await sleep(1000)
    if (!running) return

    for (let i = 0; i < HOVER_PATH.length; i++) {
      const index = HOVER_PATH[i]
      const col = queryEl(`[data-autoplay="chart-col-${index}"]`)
      const duration = i === 0 ? 900 : 700
      const hoverAt = i === 0 ? duration * 0.75 : duration * 0.35
      const moving = moveTo(col, duration)
      await sleep(hoverAt)
      analyticsRef.value?.showChartHover(index)
      await moving
      await sleep(400)
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
