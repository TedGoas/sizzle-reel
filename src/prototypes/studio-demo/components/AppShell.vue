<template>
  <div class="shell">
    <LeftRail />
    <aside class="admin-nav">
      <div class="admin-office">
        <span>Agentic Office</span>
        <Icon name="chevron-down" :size="12" />
      </div>
      <div
        v-for="item in navItems"
        :key="item"
        class="admin-item"
        :class="{ 'admin-item--active': item === 'AI Agent Management' }"
      >
        {{ item }}
      </div>
    </aside>
    <div class="shell-main">
      <header class="top-bar">
        <nav class="crumbs" aria-label="breadcrumbs">
          <span class="crumb-muted">Admin</span>
          <span class="crumb-muted">/</span>
          <span class="crumb-muted">AI Agents</span>
          <span class="crumb-muted">/</span>
          <span class="crumb-active">AI Agent Management</span>
        </nav>
        <div class="help-search">
          <Icon name="search" :size="12" />
          <span>Search help center</span>
        </div>
      </header>
      <div class="shell-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import Icon from './Icon.vue'
import LeftRail from './LeftRail.vue'

const navItems = [
  'AI Agent Management',
  'Digital Channels',
  'Historical Administration',
  'Connectors',
]
</script>

<style scoped>
.shell {
  display: flex;
  width: 100%;
  height: 100%;
  background: #fff;
  color: #18181b;
}

.admin-nav {
  width: 215px;
  background: #f9f9f9;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.admin-office {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 12px;
  border-bottom: 1px solid rgba(28, 28, 28, 0.11);
  font-size: 12px;
  color: #1a1a1a;
}

.admin-item {
  display: flex;
  align-items: center;
  height: 52px;
  padding: 12px;
  box-sizing: border-box;
  font-size: 15px;
}

.admin-item--active {
  background: #e9e9e9;
}

.shell-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 9px 16px;
  box-sizing: border-box;
  background: #f9f9f9;
  border-bottom: 1px solid hsl(0 0% 11% / 0.1);
  flex-shrink: 0;
}

.crumbs {
  display: flex;
  gap: 6px;
  font-size: 15px;
  line-height: 1.6;
}

.crumb-muted {
  color: #808080;
}

.crumb-active {
  color: #1a1a1a;
  font-weight: 500;
}

.help-search {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 200px;
  padding: 6px 12px;
  background: #fff;
  border: 1px solid hsl(0 0% 11% / 0.1);
  border-radius: 8px;
  color: #808080;
  font-size: 12px;
  line-height: 1.4;
}

.shell-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  background: #fff;
}
</style>
