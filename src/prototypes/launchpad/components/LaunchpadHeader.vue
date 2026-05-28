<template>
  <div class="lp-header">
    <div class="lp-header-top">
      <div class="lp-header-left">
        <h1 class="lp-header-title">Good afternoon, Carolina</h1>
        <div class="lp-header-subtitle">
          <span class="d-body-base" style="color: var(--dt-color-foreground-secondary);">Here is a look at your snapshot for today.</span>
        </div>
        <div class="lp-header-controls">
          <button class="lp-filter-btn">
            <span>5 CCs</span>
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 3.5l3 3 3-3" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>
          </button>
          <button class="lp-filter-btn">
            <span>43 agents</span>
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 3.5l3 3 3-3" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>
          </button>
          <div class="lp-divider"></div>
          <div class="lp-time-tabs">
            <button
              v-for="tab in timeTabs"
              :key="tab"
              class="lp-time-tab"
              :class="{ 'lp-time-tab--active': activeTimeTab === tab }"
              @click="setTimeTab(tab)"
            >
              {{ tab }}
            </button>
          </div>
        </div>
      </div>
      <div class="lp-header-right">
        <button class="lp-action-btn" @click="$emit('refresh')">
          <DtIcon name="refresh" :size="16" />
          <span>Refresh</span>
        </button>
        <button class="lp-action-btn">
          <span>Supervisor view</span>
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 3.5l3 3 3-3" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DtIcon from '../../../components/icons/DtIcon.vue'

const emit = defineEmits(['refresh', 'timeTabChange'])

const timeTabs = ['1D', '1W', '1M']
const activeTimeTab = ref('1D')

function setTimeTab(tab) {
  if (tab === activeTimeTab.value) return
  activeTimeTab.value = tab
  emit('timeTabChange', tab)
}
</script>

<style scoped>
.lp-header {
  padding: 16px 32px 16px 32px;
}

.lp-header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.lp-header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lp-header-title {
  font-size: 27px;
  font-weight: 510;
  line-height: 1;
  color: #1c1c1c;
}

.lp-header-subtitle {
  display: flex;
  align-items: center;
}

.lp-header-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.lp-filter-btn {
  display: flex;
  align-items: center;
  gap: 5.5px;
  padding: 8px 10px 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-weight: 510;
  color: #3a3a3a;
}

.lp-filter-btn:hover {
  background: rgba(0, 0, 0, 0.03);
}

.lp-divider {
  width: 2px;
  height: 30px;
  background: rgba(28, 28, 28, 0.17);
  border-radius: 24px;
  margin: 0 6px;
}

.lp-time-tabs {
  display: flex;
  gap: 4px;
  border: 1px solid rgba(28, 28, 28, 0.11);
  border-radius: 10px;
  padding: 2px;
}

.lp-time-tab {
  padding: 7px 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-weight: 510;
  color: #3a3a3a;
  line-height: 1.2;
}

.lp-time-tab:hover {
  background: rgba(0, 0, 0, 0.04);
}

.lp-time-tab--active {
  background: #F5F0FF;
  color: #7C52FF;
}

.lp-time-tab--active:hover {
  background: #F5F0FF;
}

.lp-header-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.lp-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-weight: 510;
  color: #3a3a3a;
  white-space: nowrap;
}

.lp-action-btn:hover {
  background: rgba(0, 0, 0, 0.03);
}
</style>
