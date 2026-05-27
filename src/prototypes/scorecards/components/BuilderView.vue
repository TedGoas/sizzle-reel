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
          <span v-for="(crumb, i) in scorecardMeta.breadcrumbs" :key="i">
            <span :class="i < scorecardMeta.breadcrumbs.length - 1 ? 'crumb-muted' : 'crumb-active'">{{ crumb }}</span>
            <span v-if="i < scorecardMeta.breadcrumbs.length - 1" class="crumb-separator"> / </span>
          </span>
        </div>
        <div class="builder-search-bar">
          <Search :size="12" class="builder-search-icon" />
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
              <ChevronDown :size="16" class="builder-filter-chevron" />
            </button>
            <button class="builder-filter-btn">
              <span>Coaching teams (0)</span>
              <ChevronDown :size="16" class="builder-filter-chevron" />
            </button>
          </div>
        </div>
        <div class="builder-title-right">
          <div class="builder-actions-row">
            <button class="builder-action-btn builder-action-btn--icon" aria-label="Delete">
              <Trash2 :size="20" />
            </button>
            <button class="builder-action-btn builder-action-btn--icon" aria-label="Copy">
              <Copy :size="20" />
            </button>
            <div class="builder-action-btn builder-action-btn--select">
              <span class="builder-select-value">English</span>
              <ChevronDown :size="16" class="builder-select-arrow" />
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
          />
        </div>
        <div class="builder-right">
          <QuestionDetail :question="selectedQuestion" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Trash2, Copy, ChevronDown, Search } from '@lucide/vue'
import QuestionList from './QuestionList.vue'
import QuestionDetail from './QuestionDetail.vue'
import { questions, scorecardMeta, adminNavItems } from '../data/builderData.js'

const selectedCompany = ref('my-company')
const localQuestions = ref([...questions])
const selectedQuestionId = ref(questions[0]?.id || null)

const selectedQuestion = computed(() =>
  localQuestions.value.find(q => q.id === selectedQuestionId.value) || null
)

function selectQuestion(id) {
  selectedQuestionId.value = id
}
</script>

<style scoped>
.builder-view {
  display: flex;
  height: 100%;
  overflow: hidden;
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
}

.builder-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 16px;
  background: #f9f9f9;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  height: 50px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.builder-breadcrumbs {
  display: flex;
  gap: 6px;
  font-size: 14px;
}

.crumb-muted { color: #808080; }
.crumb-active { color: #1c1c1c; font-weight: 500; }
.crumb-separator { color: #808080; }

.builder-search-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 14px;
  color: #808080;
  width: 200px;
}

.builder-search-icon {
  width: 12px;
  height: 12px;
}

.builder-title-area {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 32px 0;
  flex-shrink: 0;
}

.builder-title-left {
  display: flex;
  flex-direction: column;
}

.builder-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}


.builder-title {
  font-size: 27px;
  font-weight: 500;
  color: #1c1c1c;
  margin: 0;
  line-height: 1.2;
}

.builder-ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px 3px 4px;
  border: 1px solid rgba(28, 28, 28, 0.11);
  border-radius: 6px;
  color: #1c1c1c;
  background: linear-gradient(168deg, rgba(71,21,113,0.1) 0%, rgba(85,27,132,0.1) 3.08%, rgba(124,34,158,0.1) 14.48%, rgba(144,36,164,0.1) 23.67%, rgba(176,34,144,0.1) 35.5%, rgba(211,43,134,0.1) 48.3%, rgba(233,47,111,0.1) 60.29%, rgba(246,72,79,0.1) 70.08%, rgba(251,115,40,0.1) 90.02%, rgba(243,150,15,0.1) 97.29%, rgba(243,150,15,0.1) 100%);
}

.builder-ai-badge-icon {
  flex-shrink: 0;
}

.builder-ai-badge-text {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  white-space: nowrap;
}

.builder-draft-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 6px;
  border: 1px solid rgba(28, 28, 28, 0.11);
  border-radius: 6px;
  background: white;
}

.builder-draft-badge-text {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  color: #1c1c1c;
  white-space: nowrap;
}

.builder-filters {
  display: flex;
  gap: 8px;
}

.builder-filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 5.5px;
  padding: 8px 10px 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: none;
  font-size: 12px;
  font-weight: 500;
  color: #3a3a3a;
  cursor: default;
  line-height: 1.2;
  white-space: nowrap;
}

.builder-filter-chevron {
  color: #3a3a3a;
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
  gap: 8px;
}

.builder-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  box-sizing: border-box;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: default;
  line-height: 1.2;
  padding: 0;
  border: none;
  background: none;
}

.builder-action-btn--icon {
  width: 36px;
  color: #3a3a3a;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.builder-action-btn--icon:hover {
  background: rgba(28, 28, 28, 0.05);
}

.builder-action-btn--select {
  gap: 6px;
  padding: 0 10px 0 12px;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.03);
  color: #3a3a3a;
  font-weight: 400;
}

.builder-select-value {
  font-size: 14px;
}

.builder-select-arrow {
  color: #808080;
}

.builder-action-btn--primary {
  padding: 0 20px;
  background: #7C52FF;
  color: white;
  font-size: 14px;
}

.builder-content {
  display: flex;
  gap: 16px;
  padding: 32px 32px 32px 20px;
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
</style>
