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
  background: #f9f9f9;
  border-right: 1px solid rgba(28, 28, 28, 0.11);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.analytics-sidebar-dropdown {
  padding: 0 12px;
  border-bottom: 1px solid rgba(28, 28, 28, 0.11);
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
  padding-top: 8px;
}

.analytics-sidebar-item {
  padding: 8px 16px;
  margin-top: 4px;
  font-size: 15px;
  color: #1c1c1c;
  cursor: default;
  line-height: 1.4;
  border-radius: 4px;
  white-space: nowrap;
}

.analytics-sidebar-item--parent {
  font-size: 12px;
  line-height: 1.2;
}

.analytics-sidebar-item--indented {
  padding: 4px 16px 4px 32px;
  margin: 4px 4px 0;
  font-size: 12px;
  line-height: 1.2;
  border-radius: 50px;
  height: 30px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.analytics-sidebar-item--active {
  background: rgba(0, 0, 0, 0.08);
}
</style>
