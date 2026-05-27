<template>
  <div class="analytics-view">
    <AnalyticsSidebar />

    <div class="analytics-main">
      <!-- Top bar -->
      <div class="analytics-top-bar">
        <div class="analytics-breadcrumbs">
          <span class="crumb-muted">Analytics</span>
          <span class="crumb-separator">/</span>
          <span class="crumb-muted">AI Scorecards</span>
          <span class="crumb-separator">/</span>
          <span class="crumb-active">By group</span>
        </div>
        <div class="analytics-search">
          <Search :size="12" class="search-icon" />
          <span>Search</span>
        </div>
      </div>

      <!-- Content -->
      <div class="analytics-content">
        <!-- Page title -->
        <div class="analytics-title-area">
          <div class="analytics-title-left">
            <h1 class="analytics-title">AI Scorecards by group</h1>
            <div class="analytics-filters">
              <button class="analytics-filter-btn">
                <span>All groups</span>
                <ChevronDown :size="16" class="analytics-filter-chevron" />
              </button>
              <button class="analytics-filter-btn analytics-filter-btn--active">
                <span>Past 60 days</span>
                <span>&times;</span>
              </button>
            </div>
          </div>
          <div class="analytics-title-right">
            <span class="analytics-link">View graded calls</span>
            <button class="analytics-export-btn">Export</button>
          </div>
        </div>

        <!-- Chart -->
        <ComboChart />

        <!-- Spacer -->
        <div style="height: 42px;"></div>

        <!-- Agent table -->
        <AgentTable />
      </div>
    </div>
  </div>
</template>

<script setup>
import AnalyticsSidebar from './AnalyticsSidebar.vue'
import ComboChart from './ComboChart.vue'
import AgentTable from './AgentTable.vue'
import { ChevronDown, Search } from '@lucide/vue'
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
  padding: 9px 16px;
  background: #f9f9f9;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  height: 50px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.analytics-breadcrumbs {
  display: flex;
  gap: 6px;
  font-size: 14px;
}

.crumb-muted { color: #808080; }
.crumb-active { color: #1c1c1c; font-weight: 500; }
.crumb-separator { color: #808080; }

.analytics-search {
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

.search-icon {
  width: 12px;
  height: 12px;
}

.analytics-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 32px;
  background: white;
}

.analytics-title-area {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
}

.analytics-title-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.analytics-title {
  font-size: 27px;
  font-weight: 500;
  color: #1c1c1c;
  margin: 0;
  line-height: 1.2;
}

.analytics-filters {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.analytics-filter-btn {
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

.analytics-filter-chevron {
  color: #3a3a3a;
  flex-shrink: 0;
}

.analytics-filter-btn--active {
  background: #F5F0FF;
  border-color: #D3BCFF;
  color: #7C52FF;
}

.analytics-title-right {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.analytics-link {
  font-size: 15px;
  color: #7C52FF;
  cursor: default;
  line-height: 2.4;
}

.analytics-export-btn {
  padding: 8px 20px;
  background: #7C52FF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: default;
}
</style>
