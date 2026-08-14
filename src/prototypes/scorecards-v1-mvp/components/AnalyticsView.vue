<template>
  <div class="analytics-view">
    <AnalyticsSidebar />

    <div class="analytics-main">
      <div class="analytics-top-bar">
        <div class="analytics-breadcrumbs">
          <span class="crumb-muted">Admin</span>
          <span class="crumb-separator">/</span>
          <span class="crumb-muted">Scorecards</span>
          <span class="crumb-separator">/</span>
          <span class="crumb-active">Teams & Groups</span>
        </div>
        <div class="analytics-search">
          <DtIcon name="search" :size="12" class="search-icon" />
          <span>Search</span>
        </div>
      </div>

      <div class="analytics-content">
        <div class="analytics-title-area">
          <div class="analytics-title-left">
            <div class="analytics-title-row">
              <h1 class="analytics-title">Teams & Groups</h1>
              <span class="beta-badge">Beta</span>
            </div>
            <p class="analytics-desc">
              QA scorecard metrics for teams, groups, and departments.
            </p>
            <div class="analytics-filters">
              <button type="button" class="analytics-filter-btn analytics-filter-btn--active">
                <span>All Teams & Groups</span>
                <DtIcon name="chevron-down" :size="16" class="analytics-filter-chevron" />
              </button>
              <button type="button" class="analytics-filter-btn analytics-filter-btn--active">
                <span>Last 30 days</span>
                <DtIcon name="chevron-down" :size="16" class="analytics-filter-chevron" />
              </button>
            </div>
          </div>
          <button type="button" class="analytics-export-btn">
            Export
            <DtIcon name="chevron-down" :size="16" />
          </button>
        </div>

        <ComboChart ref="comboRef" />

        <div class="analytics-bottom">
          <div class="analytics-table-heading">
            <h2 class="analytics-table-title">All Teams & Groups</h2>
            <span class="analytics-link">View scored calls</span>
          </div>
          <div class="analytics-tables">
            <AgentTable />
            <aside class="graders-panel">
              <div class="graders-header">
                <span>Graders</span>
                <span>Calls graded</span>
              </div>
              <div v-for="grader in graders" :key="grader.name" class="grader-row">
                <div class="grader-person">
                  <img :src="grader.avatar" :alt="grader.name" width="28" height="28" class="grader-avatar" />
                  <span>{{ grader.name }}</span>
                </div>
                <span class="grader-calls">{{ grader.calls }}</span>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AnalyticsSidebar from './AnalyticsSidebar.vue'
import ComboChart from './ComboChart.vue'
import AgentTable from './AgentTable.vue'
import DtIcon from '../../../components/icons/DtIcon.vue'
import { graders } from '../data/analyticsData.js'

const comboRef = ref(null)

defineExpose({
  showChartHover: (index) => comboRef.value?.showHover(index),
  clearChartHover: () => comboRef.value?.clearHover(),
  playReveal: () => comboRef.value?.playReveal(),
})
</script>

<style scoped>
.analytics-view {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.analytics-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.analytics-top-bar {
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

.analytics-breadcrumbs {
  display: flex;
  gap: 6px;
  font: var(--dt-typography-body-md);
}

.crumb-muted { color: var(--dt-color-foreground-tertiary); }
.crumb-active { color: var(--dt-color-foreground-primary); font-weight: 500; }
.crumb-separator { color: var(--dt-color-foreground-tertiary); }

.analytics-search {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  padding: 6px var(--dt-space-450);
  background: var(--dt-color-surface-primary);
  border: 1.5px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-tertiary);
  width: 200px;
}

.search-icon {
  width: 12px;
  height: 12px;
}

.analytics-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--dt-space-500) var(--dt-space-600);
  background: var(--dt-color-surface-primary);
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-550);
}

.analytics-title-area {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--dt-space-500);
}

.analytics-title-left {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
  min-width: 0;
}

.analytics-title-row {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
}

.analytics-title {
  margin: 0;
  font: var(--dt-typography-headline-xl);
  color: var(--dt-color-foreground-primary);
}

.beta-badge {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 var(--dt-space-400);
  border-radius: var(--dt-space-300);
  background: var(--dt-color-surface-brand-subtle);
  color: var(--dt-color-link-primary);
  font: var(--dt-typography-label-sm-compact);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.analytics-desc {
  margin: 0;
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-secondary);
}

.analytics-filters {
  display: flex;
  gap: var(--dt-space-300);
  padding: var(--dt-space-300) 0 0;
}

.analytics-filter-btn {
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

.analytics-filter-chevron {
  flex-shrink: 0;
}

.analytics-filter-btn--active {
  background: var(--dt-color-surface-brand-subtle);
  border-color: var(--dt-color-border-brand);
  color: var(--dt-color-link-primary);
}

.analytics-export-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-300);
  height: var(--btn-height-md);
  padding: 0 var(--dt-space-500);
  background: var(--dt-color-link-primary);
  color: var(--dt-color-surface-primary);
  border: none;
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-label-md-compact);
  cursor: default;
  flex-shrink: 0;
}

.analytics-bottom {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-500);
}

.analytics-table-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-400);
}

.analytics-table-title {
  margin: 0;
  font: var(--dt-typography-headline-lg);
  color: var(--dt-color-foreground-primary);
}

.analytics-link {
  font: var(--dt-typography-body-md);
  color: var(--dt-color-link-primary);
  cursor: default;
}

.analytics-tables {
  display: flex;
  align-items: flex-start;
  gap: var(--dt-space-600);
}

.analytics-tables > :first-child {
  flex: 1;
  min-width: 0;
}

.graders-panel {
  width: 275px;
  flex-shrink: 0;
  border: 1px solid var(--dt-color-border-default);
  border-radius: var(--dt-space-300);
  padding: var(--dt-space-400) var(--dt-space-500);
}

.graders-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--dt-space-400);
  border-bottom: 1px solid var(--dt-color-border-default);
  font: var(--dt-typography-label-sm-compact);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: var(--dt-color-foreground-primary);
}

.grader-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-400);
  padding: var(--dt-space-400) 0;
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.grader-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.grader-person {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  min-width: 0;
  font: var(--dt-typography-body-md);
}

.grader-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.grader-calls {
  font: var(--dt-typography-label-md-compact);
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}
</style>
