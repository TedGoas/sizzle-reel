<template>
  <div class="studio-app">
    <LeftBar active-item="settings" />
    <main class="studio-content">
      <aside class="studio-admin-nav">
        <div class="admin-nav-search">
          <select v-model="selectedOffice" class="custom-select custom-select--sm">
            <option value="agentic-office">Agentic Office</option>
          </select>
        </div>
        <div
          v-for="item in adminNavItems"
          :key="item.label"
          class="admin-nav-item"
          :class="{ 'admin-nav-item--active': item.active }"
        >
          <span>{{ item.label }}</span>
        </div>
      </aside>

      <div class="studio-main">
        <div class="studio-top-bar">
          <nav class="studio-breadcrumbs" aria-label="breadcrumbs">
            <span class="crumb-muted">Admin</span>
            <span class="crumb-separator"> / </span>
            <span class="crumb-muted">AI Agents</span>
            <span class="crumb-separator"> / </span>
            <span class="crumb-active">AI Agent Management</span>
          </nav>
          <div class="studio-search-bar">
            <DtIcon name="search" :size="12" class="studio-search-icon" />
            <span>Search help center</span>
          </div>
        </div>

        <div class="studio-main-body">
          <AgenticStudioMain />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LeftBar from '@/components/LeftBar.vue'
import DtIcon from '@/components/icons/DtIcon.vue'
import AgenticStudioMain from './AgenticStudio.vue'

const selectedOffice = ref('agentic-office')

const adminNavItems = [
  { label: 'AI Agent Management', active: true },
  { label: 'Digital Channels', active: false },
  { label: 'Historical Administration', active: false },
  { label: 'Connectors', active: false },
]
</script>

<style scoped>
.studio-app {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--dt-color-surface-primary);
  font-family: var(--dt-font-family-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
}

.studio-content {
  flex: 1;
  display: flex;
  min-width: 0;
  overflow: hidden;
}

.studio-admin-nav {
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

.studio-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  position: relative;
}

.studio-top-bar {
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

.studio-breadcrumbs {
  display: flex;
  gap: var(--dt-space-350);
  font: var(--dt-typography-body-md);
}

.crumb-muted { color: var(--dt-color-foreground-muted); }
.crumb-active { color: var(--dt-color-foreground-primary); font-weight: 500; }
.crumb-separator { color: var(--dt-color-foreground-muted); }

.studio-search-bar {
  display: flex;
  align-items: center;
  gap: var(--dt-space-350);
  padding: 6px var(--dt-space-450);
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-space-400);
  color: var(--dt-color-foreground-muted);
  font: var(--dt-typography-body-sm);
  min-width: 200px;
}

.studio-search-icon {
  flex-shrink: 0;
}

.studio-main-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  background: var(--dt-color-surface-primary);
}

.studio-main-body :deep(.agentic-studio-root),
.studio-main-body :deep(.main-content-wrapper) {
  min-height: 100%;
}
</style>
