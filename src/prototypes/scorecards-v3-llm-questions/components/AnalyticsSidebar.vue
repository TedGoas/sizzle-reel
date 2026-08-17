<template>
  <aside class="analytics-sidebar">
    <!-- Company dropdown -->
    <div class="analytics-sidebar-dropdown">
      <select v-model="selectedCompany" class="custom-select custom-select--sm" style="width: 100%;">
        <option value="my-company">My Company</option>
      </select>
    </div>

    <!-- Nav items -->
    <div class="analytics-sidebar-nav">
      <div
        v-for="item in navItems"
        :key="item.label"
        class="analytics-sidebar-item"
        :class="{
          'analytics-sidebar-item--active': item.active,
          'analytics-sidebar-item--indented': item.indent === 1,
          'analytics-sidebar-item--parent': item.expanded,
        }"
      >
        {{ item.label }}
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { sidebarNavItems } from '../data/analyticsData.js'

const selectedCompany = ref('my-company')
const navItems = sidebarNavItems
</script>

<style scoped>
.analytics-sidebar {
  width: 200px;
  background: var(--dt-color-surface-secondary);
  border-right: 1px solid var(--dt-color-border-subtle);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.analytics-sidebar-dropdown {
  padding: 0 var(--dt-space-450);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  height: 50px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.analytics-sidebar-dropdown :deep(*) {
  width: 100%;
}

.analytics-sidebar-nav {
  display: flex;
  flex-direction: column;
  padding-top: var(--dt-space-400);
}

.analytics-sidebar-item {
  padding: var(--dt-space-400) var(--dt-space-500);
  margin-top: var(--dt-space-300);
  font: var(--dt-typography-body-md-compact);
  color: var(--dt-color-foreground-primary);
  cursor: default;
  border-radius: var(--dt-space-300);
  white-space: nowrap;
}

.analytics-sidebar-item--parent {
  font: var(--dt-typography-label-sm-compact);
}

.analytics-sidebar-item--indented {
  padding: var(--dt-space-300) var(--dt-space-500) var(--dt-space-300) var(--dt-space-600);
  margin: var(--dt-space-300) var(--dt-space-300) 0;
  font: var(--dt-typography-body-sm-compact);
  border-radius: 50px;
  height: 30px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.analytics-sidebar-item--active {
  background: var(--dt-color-surface-moderate);
}
</style>
