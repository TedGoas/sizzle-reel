<template>
  <div class="builder-view">
    <!-- Admin sidebar -->
    <aside class="builder-admin-nav">
      <div class="admin-nav-search">
        <select v-model="selectedCompany" class="custom-select custom-select--sm">
          <option value="my-company">My Company</option>
        </select>
      </div>
      <div
        v-for="item in adminNavItems"
        :key="item.label"
        class="admin-nav-item"
        :class="{ 'admin-nav-item--active': item.active }"
      >
        <span>{{ item.label }}</span>
        <span v-if="item.hasPlus" class="admin-nav-plus">+</span>
      </div>
    </aside>

    <!-- Main content -->
    <div class="builder-main">
      <!-- Top bar -->
      <div class="builder-top-bar">
        <div class="builder-breadcrumbs">
          <span v-for="(crumb, i) in breadcrumbs" :key="i">
            <span :class="i < breadcrumbs.length - 1 ? 'crumb-muted' : 'crumb-active'">{{ crumb }}</span>
            <span v-if="i < breadcrumbs.length - 1" class="crumb-separator"> / </span>
          </span>
        </div>
        <div class="builder-search-bar">
          <DtIcon name="search" :size="12" class="builder-search-icon" />
          <span>Search</span>
        </div>
      </div>

      <!-- Page title area -->
        <div class="builder-title-area">
          <div class="builder-title-left">
            <div class="builder-title-row">
              <h1 class="builder-title">{{ scorecardMeta.name }}</h1>
              <div class="builder-ai-badge">
                <svg class="builder-ai-badge-icon" width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 2a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0V6h-1a1 1 0 1 1 0-2h1V3a1 1 0 0 1 1-1Zm-9 2a1 1 0 0 1 .91.586l2.033 4.471 4.47 2.033a1 1 0 0 1 0 1.82l-4.47 2.033-2.033 4.47a1 1 0 0 1-1.82 0l-2.033-4.47-4.47-2.033a1 1 0 0 1 0-1.82l4.47-2.033 2.033-4.47A1 1 0 0 1 10 4Zm0 3.417-1.277 2.81a1 1 0 0 1-.497.496L5.416 12l2.81 1.277a1 1 0 0 1 .497.497L10 16.584l1.277-2.81a1 1 0 0 1 .497-.497L14.584 12l-2.81-1.277a1 1 0 0 1-.497-.497L10 7.416ZM18 16a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 1 1 0-2h1v-1a1 1 0 0 1 1-1Z" fill="url(#ai-gradient)"/><defs><linearGradient id="ai-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse"><stop stop-color="#471571"/><stop offset=".031" stop-color="#551B84"/><stop offset=".145" stop-color="#7C229E"/><stop offset=".237" stop-color="#9024A4"/><stop offset=".355" stop-color="#B02290"/><stop offset=".483" stop-color="#D32B86"/><stop offset=".603" stop-color="#E92F6F"/><stop offset=".701" stop-color="#F6484F"/><stop offset=".9" stop-color="#FB7328"/><stop offset=".973" stop-color="#F3960F"/><stop offset="1" stop-color="#F3960F"/></linearGradient></defs></svg>
                <span class="builder-ai-badge-text">{{ scorecardMeta.gradeBy }}</span>
              </div>
              <div class="builder-draft-badge">
                <span class="builder-draft-badge-text">Draft</span>
              </div>
            </div>
            <div class="builder-filters">
              <button class="builder-filter-btn">
                <span>Contact centers (0)</span>
                <DtIcon name="chevron-down" :size="16" class="builder-filter-chevron" />
              </button>
              <button class="builder-filter-btn">
                <span>Coaching teams (0)</span>
                <DtIcon name="chevron-down" :size="16" class="builder-filter-chevron" />
              </button>
            </div>
          </div>
          <div class="builder-title-right">
            <div class="builder-actions-row">
              <button class="builder-action-btn builder-action-btn--icon" aria-label="Delete">
                <DtIcon name="trash" :size="16" />
              </button>
              <button class="builder-action-btn builder-action-btn--icon" aria-label="Copy">
                <DtIcon name="copy" :size="16" />
              </button>
              <div class="builder-action-btn builder-action-btn--select">
                <span class="builder-select-value">English</span>
                <DtIcon name="chevron-down" :size="16" class="builder-select-arrow" />
              </div>
              <button class="builder-action-btn builder-action-btn--primary">
                Publish
              </button>
            </div>
          </div>
        </div>

        <!-- Two column layout -->
        <div class="builder-content">
          <div class="builder-left">
            <QuestionList
              :questions="localQuestions"
              :selectedId="selectedQuestionId"
              @select="selectQuestion"
              @create="createQuestion"
            />
          </div>
          <div class="builder-right">
            <QuestionDetail ref="detailRef" :question="selectedQuestion" @saved="showSaveNotice" @define="openDefineModal" />
          </div>
        </div>
    </div>
    <Teleport to="body">
      <Transition name="save-notice">
        <div v-if="saveNotice" class="save-notice" role="status">
          <div class="save-notice-body">
            <DtIcon name="check-circle" :size="20" class="save-notice-icon" />
            <span class="save-notice-title">{{ saveNotice }}</span>
          </div>
          <button
            type="button"
            class="save-notice-close"
            aria-label="Dismiss"
            @click="dismissSaveNotice"
          >
            <DtIcon name="close" :size="16" />
          </button>
        </div>
      </Transition>
      <DefineTermModal
        v-model="defineText"
        :show="defineOpen"
        :acronym="defineAcronym"
        :busy="defineBusy"
        :status="defineStatus"
        :status-kind="defineStatusKind"
        @close="closeDefineModal"
        @save="() => saveDefinition()"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DtIcon from '../../../components/icons/DtIcon.vue'
import QuestionList from './QuestionList.vue'
import QuestionDetail from './QuestionDetail.vue'
import DefineTermModal from './DefineTermModal.vue'
import { scorecardMeta, adminNavItems, createInitialQuestions, createBlankQuestion } from '../data/builderData.js'

const selectedCompany = ref('my-company')
const detailRef = ref(null)
const localQuestions = ref(createInitialQuestions())
const selectedQuestionId = ref(3)
const saveNotice = ref('')
let saveNoticeTimer = null
const defineOpen = ref(false)
const defineAcronym = ref('')
const defineText = ref('')
const defineBusy = ref(false)
const defineStatus = ref('')
const defineStatusKind = ref('busy')
let defineGen = 0

const selectedQuestion = computed(() =>
  localQuestions.value.find(q => q.id === selectedQuestionId.value) || null
)

const breadcrumbs = computed(() => scorecardMeta.breadcrumbs)

function selectQuestion(id) {
  closeDefineModal(true)
  selectedQuestionId.value = id
}

function createQuestion() {
  closeDefineModal(true)
  const next = Math.max(0, ...localQuestions.value.map((q) => q.id)) + 1
  const question = createBlankQuestion(next, next, { aiSuggestions: [] })
  localQuestions.value.push(question)
  selectedQuestionId.value = question.id
}

function showSaveNotice(message) {
  saveNotice.value = typeof message === 'string' && message
    ? message
    : 'Question successfully updated'
  clearTimeout(saveNoticeTimer)
  saveNoticeTimer = setTimeout(() => {
    saveNotice.value = ''
    saveNoticeTimer = null
  }, 2500)
}

function dismissSaveNotice() {
  clearTimeout(saveNoticeTimer)
  saveNoticeTimer = null
  saveNotice.value = ''
}

function saveQuestion() {
  detailRef.value?.saveQuestion()
}

function openDefineModal() {
  const question = selectedQuestion.value
  const acronym = question?.validationWarning?.acronyms?.[0]
    || (question?.text.match(/\b[A-Z]{2,}\b/) || [])[0]
    || 'VIP'
  defineAcronym.value = acronym
  defineText.value = question?.definedTerms?.[acronym] || ''
  defineBusy.value = false
  defineStatus.value = ''
  defineStatusKind.value = 'busy'
  defineOpen.value = true
}

function closeDefineModal(instant = false) {
  defineGen += 1
  defineOpen.value = false
  defineBusy.value = false
  defineStatus.value = ''
  defineStatusKind.value = 'busy'
  if (instant === true) {
    defineText.value = ''
    defineAcronym.value = ''
  }
}

async function typeDefinition(text, sleepFn) {
  if (!sleepFn) return
  defineText.value = ''
  for (let i = 1; i <= text.length; i++) {
    defineText.value = text.slice(0, i)
    await sleepFn(18)
  }
}

async function saveDefinition(sleepFn) {
  const question = selectedQuestion.value
  if (!question || defineBusy.value || !defineText.value.trim()) return
  const acronym = defineAcronym.value
  const gen = ++defineGen
  defineBusy.value = true
  const wait = typeof sleepFn === 'function'
    ? sleepFn
    : ((ms) => new Promise((resolve) => { setTimeout(resolve, ms) }))
  const stages = [
    { text: 'Analyzing this definition…', kind: 'busy', ms: 1200 },
    { text: 'Matching it to the question…', kind: 'busy', ms: 1200 },
    { text: `Looks good — the model understands ${acronym}.`, kind: 'success', ms: 1200 },
  ]
  for (const stage of stages) {
    if (gen !== defineGen) return
    defineStatus.value = stage.text
    defineStatusKind.value = stage.kind
    await wait(stage.ms)
  }
  if (gen !== defineGen) return
  question.definedTerms = {
    ...(question.definedTerms || {}),
    [acronym]: defineText.value.trim(),
  }
  question.validationWarning = null
  defineOpen.value = false
  defineBusy.value = false
  defineStatus.value = ''
  showSaveNotice(`${acronym} is defined`)
}

function resetDemo() {
  closeDefineModal(true)
  clearTimeout(saveNoticeTimer)
  saveNoticeTimer = null
  saveNotice.value = ''
  localQuestions.value = createInitialQuestions()
  selectedQuestionId.value = 3
  detailRef.value?.resetEditor()
}

async function typeQuestion(text, sleepFn) {
  await detailRef.value?.typeQuestion(text, sleepFn)
}

async function startRewrite(sleepFn) {
  await detailRef.value?.startRewrite(sleepFn)
}

function acceptSuggestion() {
  detailRef.value?.acceptSuggestion()
}

function openSkipEditor() {
  detailRef.value?.openSkipEditor()
}

function setAllowSkip(value = true) {
  detailRef.value?.setAllowSkip(value)
}

async function typeSkip(text, sleepFn) {
  await detailRef.value?.typeSkip(text, sleepFn)
}

function saveSkipEditor() {
  detailRef.value?.saveSkipEditor()
}

defineExpose({
  resetDemo,
  typeQuestion,
  startRewrite,
  acceptSuggestion,
  createQuestion,
  saveQuestion,
  openDefineModal,
  typeDefinition,
  saveDefinition,
  openSkipEditor,
  setAllowSkip,
  typeSkip,
  saveSkipEditor,
})
</script>

<style scoped>
.builder-view {
  display: flex;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.builder-admin-nav {
  width: 215px;
  background: #f9f9f9;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  overflow-y: auto;
}

.admin-nav-search {
  padding: 0 12px;
  border-bottom: 1px solid rgba(28, 28, 28, 0.11);
  height: 50px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.admin-nav-search :deep(*) {
  width: 100%;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  height: 52px;
  box-sizing: border-box;
  font-size: 15px;
  color: #18181b;
  cursor: default;
}

.admin-nav-item--active {
  background: #e9e9e9;
}

.admin-nav-plus {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #808080;
  border-radius: 50%;
}

.builder-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  position: relative;
}

.builder-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px var(--dt-space-500);
  background: var(--dt-color-surface-secondary);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  height: 50px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.builder-breadcrumbs {
  display: flex;
  gap: var(--dt-space-350);
  font: var(--dt-typography-body-md);
}

.crumb-muted { color: var(--dt-color-foreground-muted); }
.crumb-active { color: var(--dt-color-foreground-primary); font-weight: 500; }
.crumb-separator { color: var(--dt-color-foreground-muted); }

.builder-search-bar {
  display: flex;
  align-items: center;
  gap: var(--dt-space-350);
  padding: 6px var(--dt-space-450);
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-muted);
  width: 200px;
}

.builder-search-icon {
  width: 12px;
  height: 12px;
}

.builder-title-area {
  display: flex;
  justify-content: space-between;
  gap: var(--dt-space-500);
  padding: var(--dt-space-500) var(--dt-space-600) 0;
  flex-shrink: 0;
}

.builder-title-left {
  display: flex;
  flex-direction: column;
}

.builder-title-row {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  padding: var(--dt-space-300) 0;
}

.builder-title {
  font: var(--dt-typography-headline-xl);
  color: var(--dt-color-foreground-primary);
  margin: 0;
}

.builder-ai-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-300);
  padding: 3px var(--dt-space-350) 3px var(--dt-space-300);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-space-350);
  color: var(--dt-color-foreground-primary);
  background: linear-gradient(168deg, rgba(71,21,113,0.1) 0%, rgba(85,27,132,0.1) 3.08%, rgba(124,34,158,0.1) 14.48%, rgba(144,36,164,0.1) 23.67%, rgba(176,34,144,0.1) 35.5%, rgba(211,43,134,0.1) 48.3%, rgba(233,47,111,0.1) 60.29%, rgba(246,72,79,0.1) 70.08%, rgba(251,115,40,0.1) 90.02%, rgba(243,150,15,0.1) 97.29%, rgba(243,150,15,0.1) 100%);
}

.builder-ai-badge-icon {
  flex-shrink: 0;
}

.builder-ai-badge-text {
  font: var(--dt-typography-body-sm-compact);
  white-space: nowrap;
}

.builder-draft-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px var(--dt-space-350);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-space-350);
  background: var(--dt-color-surface-primary);
}

.builder-draft-badge-text {
  font: var(--dt-typography-body-sm-compact);
  color: var(--dt-color-foreground-primary);
  white-space: nowrap;
}

.builder-filters {
  display: flex;
  gap: var(--dt-space-400);
}

.builder-filter-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-300);
  height: var(--btn-height-md);
  padding: 0 var(--dt-space-450);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-space-400);
  background: none;
  font: var(--dt-typography-label-sm-compact);
  color: var(--dt-color-foreground-secondary);
  cursor: default;
  white-space: nowrap;
}

.builder-filter-chevron {
  color: var(--dt-color-foreground-secondary);
  flex-shrink: 0;
}

.builder-title-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.builder-actions-row {
  display: flex;
  align-items: stretch;
  gap: var(--dt-space-400);
}

.builder-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--btn-height-md);
  box-sizing: border-box;
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-label-md-compact);
  cursor: default;
  padding: 0;
  border: none;
  background: none;
}

.builder-action-btn--icon {
  width: var(--btn-height-icon);
  color: var(--dt-color-foreground-secondary);
  border: 1px solid var(--dt-color-border-subtle);
}

.builder-action-btn--icon:hover {
  background: var(--dt-color-surface-moderate);
}

.builder-action-btn--select {
  gap: var(--dt-space-350);
  padding: 0 10px 0 var(--dt-space-450);
  border: 1px solid var(--dt-color-border-subtle);
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-secondary);
  font: var(--dt-typography-body-md);
}

.builder-select-value {
  font: var(--dt-typography-body-md);
}

.builder-select-arrow {
  color: var(--dt-color-foreground-muted);
}

.builder-action-btn--primary {
  padding: 0 var(--dt-space-525);
  background: var(--dt-color-link-primary);
  color: var(--dt-color-surface-primary);
}

.builder-content {
  display: flex;
  gap: var(--dt-space-500);
  padding: var(--dt-space-600) var(--dt-space-600) var(--dt-space-600) var(--dt-space-525);
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
}

.builder-left {
  flex: 2 2 0;
  min-width: 0;
}

.builder-right {
  flex: 3 3 0;
  min-width: 0;
}

.save-notice {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 35;
  display: flex;
  align-items: center;
  gap: var(--dt-space-500);
  padding: var(--dt-space-500);
  background: var(--dt-color-surface-success);
  border: 1px solid var(--dt-color-border-default);
  border-radius: var(--dt-space-300);
  box-shadow: var(--dt-shadow-medium);
  color: var(--dt-color-foreground-primary);
  white-space: nowrap;
}

.save-notice-body {
  display: flex;
  align-items: center;
  gap: var(--dt-space-450);
  min-width: 0;
}

.save-notice-icon {
  color: var(--dt-color-foreground-success);
  flex-shrink: 0;
  display: block;
}

.save-notice-title {
  font: var(--dt-typography-body-md-compact);
  font-weight: 700;
  color: var(--dt-color-foreground-primary);
}

.save-notice-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--btn-height-icon);
  height: var(--btn-height-icon);
  padding: 0;
  border: none;
  border-radius: 50%;
  background: none;
  color: var(--dt-color-foreground-secondary);
  cursor: pointer;
  flex-shrink: 0;
}

.save-notice-close:hover {
  background: var(--dt-color-surface-moderate);
}

.save-notice-enter-active,
.save-notice-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.save-notice.save-notice-enter-from,
.save-notice.save-notice-leave-to {
  opacity: 0;
  transform: translate(-50%, calc(-50% - var(--dt-space-400)));
}

.save-notice.save-notice-enter-to,
.save-notice.save-notice-leave-from,
.save-notice {
  transform: translate(-50%, -50%);
}
</style>
