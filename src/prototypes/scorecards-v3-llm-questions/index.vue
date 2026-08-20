<template>
  <div class="scorecards-app" id="scorecards-app" ref="appRef">
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
        <CallReviewView ref="callReviewRef" :resolved-count="resolvedCount" />
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
      :class="{
        'autoplay-cursor--clicking': cursorClicking,
        'autoplay-cursor--hidden': cursorHidden,
      }"
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
import BuilderView from './components/BuilderView.vue'
import CallReviewView from './components/CallReviewView.vue'
import AnalyticsView from './components/AnalyticsView.vue'
import { DRAFT_QUESTION, VIP_QUESTION, VIP_DEFINITION, SKIP_CONDITION } from './data/builderData.js'
import { scorecardQuestions } from './data/callData.js'
import { HOVER_PATH } from './data/analyticsData.js'

const VIEW_FADE_MS = 1000

const appRef = ref(null)
const builderRef = ref(null)
const callReviewRef = ref(null)
const analyticsRef = ref(null)
const activeView = ref('builder')
const resolvedCount = ref(0)

const cursorX = ref(98)
const cursorY = ref(80)
const cursorClicking = ref(false)
const cursorMoving = ref(false)
const cursorHidden = ref(false)
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
  opacity: cursorHidden.value ? 0 : 1,
  transition: cursorMoving.value
    ? `transform ${moveDuration.value}ms cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease`
    : 'opacity 0.3s ease',
}))

function handleIconClick(iconName) {
  switch (iconName) {
    case 'settings': activeView.value = 'builder'; break
    case 'history': activeView.value = 'call-review'; break
    case 'trending-up': activeView.value = 'analytics'; break
  }
}

function queryEl(selector) {
  return appRef.value?.querySelector(selector)
    || document.querySelector(selector)
    || null
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
  el.scrollIntoView({ block: 'nearest', inline: 'nearest' })
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

function resetFilm() {
  analyticsRef.value?.clearChartHover()
  callReviewRef.value?.clearEvidence()
  activeView.value = 'builder'
  resolvedCount.value = 0
  cursorClicking.value = false
  cursorHidden.value = false
  builderRef.value?.resetDemo()
}

async function runFilm() {
  running = true
  resetFilm()
  await nextTick()
  await sleep(1400)
  if (!running) return

  const questionInput = queryEl('#question-text')
  await moveTo(questionInput)
  questionInput?.focus()
  await sleep(200)
  if (!running) return

  await builderRef.value?.typeQuestion(DRAFT_QUESTION, sleep)
  await sleep(600)
  if (!running) return

  const rewriteBtn = queryEl('[data-autoplay="rewrite"]')
  await moveTo(rewriteBtn)
  await clickEl(rewriteBtn)
  await builderRef.value?.startRewrite(sleep)
  if (!running) return

  await sleep(500)
  if (!running) return

  const acceptBtn = queryEl('[data-autoplay="accept"]')
  await moveTo(acceptBtn)
  await clickEl(acceptBtn)
  builderRef.value?.acceptSuggestion()
  await sleep(800)
  if (!running) return

  const firstSaveBtn = queryEl('[data-autoplay="save-question"]')
  await moveTo(firstSaveBtn)
  await clickEl(firstSaveBtn)
  builderRef.value?.saveQuestion()
  await sleep(1800)
  if (!running) return

  const createBtn = queryEl('[data-autoplay="create-question"]')
  await moveTo(createBtn)
  await clickEl(createBtn)
  builderRef.value?.createQuestion()
  await nextTick()
  await sleep(400)
  if (!running) return

  const vipInput = queryEl('#question-text')
  await moveTo(vipInput)
  vipInput?.focus()
  await sleep(200)
  if (!running) return

  await builderRef.value?.typeQuestion(VIP_QUESTION, sleep)
  await sleep(500)
  if (!running) return

  const saveBtn = queryEl('[data-autoplay="save-question"]')
  await moveTo(saveBtn)
  await clickEl(saveBtn)
  builderRef.value?.saveQuestion()
  await nextTick()
  queryEl('.ai-question-input-wrapper')?.scrollIntoView({ block: 'center', inline: 'nearest' })
  await sleep(1200)
  if (!running) return

  const defineLink = queryEl('[data-autoplay="define-term"]')
  await moveTo(defineLink)
  await clickEl(defineLink)
  builderRef.value?.openDefineModal()
  await nextTick()
  await sleep(500)
  if (!running) return

  const defineInput = queryEl('[data-autoplay="define-term-input"]')
  await moveTo(defineInput)
  defineInput?.focus()
  await sleep(200)
  if (!running) return

  await builderRef.value?.typeDefinition(VIP_DEFINITION, sleep)
  await sleep(400)
  if (!running) return

  const defineSave = queryEl('[data-autoplay="define-save"]')
  await moveTo(defineSave)
  await clickEl(defineSave)
  await builderRef.value?.saveDefinition(sleep)
  await sleep(1000)
  if (!running) return

  const skipAllow = queryEl('[data-autoplay="skip-allow"]')
  await moveTo(skipAllow)
  await clickEl(skipAllow)
  builderRef.value?.setAllowSkip(true)
  await nextTick()
  await sleep(300)
  if (!running) return

  const skipLink = queryEl('[data-autoplay="skip-when"]')
  await moveTo(skipLink)
  await clickEl(skipLink)
  builderRef.value?.openSkipEditor()
  await nextTick()
  await sleep(400)
  if (!running) return

  const skipInput = queryEl('[data-autoplay="skip-input"]')
  await moveTo(skipInput)
  skipInput?.focus()
  await sleep(200)
  if (!running) return

  await builderRef.value?.typeSkip(SKIP_CONDITION, sleep)
  await sleep(400)
  if (!running) return

  const skipSave = queryEl('[data-autoplay="skip-save"]')
  await moveTo(skipSave)
  await clickEl(skipSave)
  builderRef.value?.saveSkipEditor()
  await sleep(1000)
  if (!running) return

  cursorHidden.value = true
  activeView.value = 'call-review'
  await sleep(VIEW_FADE_MS)
  await nextTick()
  if (!running) return

  await sleep(1000)
  if (!running) return

  for (let i = 0; i < scorecardQuestions.length; i++) {
    resolvedCount.value = i + 1
    await sleep(150)
    if (!running) return
  }

  await sleep(400)
  if (!running) return

  cursorHidden.value = false
  await nextTick()
  const evidenceBadge = queryEl('[data-autoplay="ai-badge-0"]')
  await moveTo(evidenceBadge)
  await clickEl(evidenceBadge)
  callReviewRef.value?.showEvidence('greet')
  await sleep(1600)
  if (!running) return

  activeView.value = 'analytics'
  await nextTick()
  analyticsRef.value?.playReveal()
  await sleep(VIEW_FADE_MS)
  await sleep(500)
  if (!running) return

  cursorHidden.value = false
  await nextTick()

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
  z-index: 40;
  width: 28px;
  height: 28px;
  pointer-events: none;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.28));
  transition: opacity 0.3s ease;
}

.autoplay-cursor--hidden {
  opacity: 0;
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
