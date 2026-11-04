<template>
  <div class="detail">
    <header class="detail-header">
      <button type="button" class="back" @click="emit('back')">
        <Icon name="arrow-left" :size="16" />
        Back
      </button>
      <div class="title-row">
        <h1>{{ agent.name }}</h1>
        <span class="badge">{{ agent.type }}</span>
        <span class="badge badge--ok">{{ agent.status }}</span>
      </div>
    </header>
    <div class="detail-body">
      <nav class="sections" aria-label="Agent sections">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          :class="{ active: tab.id === section }"
          :aria-current="tab.id === section ? 'page' : undefined"
          @click="choose(tab.id)"
        >
          {{ tab.label }}
        </button>
      </nav>
      <div class="detail-main">
        <OverviewSection v-if="section === 'overview'" />
        <TestingSection v-else-if="section === 'testing'" :agent-id="agent.id" />
        <AnalyticsSection v-else-if="section === 'analytics'" />
        <HistorySection v-else-if="section === 'history'" :agent="agent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Icon from './Icon.vue'
import OverviewSection from './overview/OverviewSection.vue'
import TestingSection from './testing/TestingSection.vue'
import AnalyticsSection from './analytics/AnalyticsSection.vue'
import HistorySection from './history/HistorySection.vue'

defineProps({
  agent: { type: Object, required: true },
  section: { type: String, required: true },
})

const emit = defineEmits(['back', 'section', 'edit'])

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'editor', label: 'Agent Editor' },
  { id: 'testing', label: 'Testing' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'history', label: 'Conversation History' },
]

function choose(id) {
  if (id === 'editor') emit('edit')
  else emit('section', id)
}
</script>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  color: var(--dt-color-foreground-primary);
}

.detail-header {
  padding: var(--dt-space-500) var(--dt-space-550) var(--dt-space-400);
}

.back {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-200);
  margin-bottom: var(--dt-space-200);
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--dt-color-foreground-secondary);
  font-family: inherit;
  font-size: var(--dt-font-size-100);
  cursor: pointer;
}

.title-row {
  display: flex;
  align-items: center;
  gap: var(--dt-space-450);
}

h1 {
  margin: 0;
  font-size: var(--dt-font-size-300);
  font-weight: 600;
  line-height: 1.2;
}

.badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 var(--dt-space-400);
  border-radius: 999px;
  background: var(--dt-color-surface-brand-subtle);
  color: var(--dt-color-link-primary);
  font-size: var(--dt-font-size-100);
  font-weight: 600;
}

.badge--ok {
  background: var(--dt-color-surface-success);
  color: var(--dt-color-foreground-success);
}

.detail-body {
  display: flex;
  align-items: flex-start;
  min-height: 0;
  flex: 1;
}

.sections {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-200);
  width: 200px;
  flex-shrink: 0;
  padding: 0 var(--dt-space-450) var(--dt-space-550);
}

.sections button {
  padding: var(--dt-space-400) var(--dt-space-450);
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dt-color-foreground-secondary);
  font-family: inherit;
  font-size: var(--dt-font-size-200);
  text-align: left;
  cursor: pointer;
}

.sections button.active {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-primary);
  font-weight: 500;
}

.detail-main {
  flex: 1;
  min-width: 0;
  padding: 0 var(--dt-space-550) var(--dt-space-600);
}
</style>
