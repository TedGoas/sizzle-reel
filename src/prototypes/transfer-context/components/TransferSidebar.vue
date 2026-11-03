<!--
  Contact sidebar shown during the call. Panel + card styling ported from design-studio
  (environments/ReferenceApp/components/SidePanel.vue "person" view + PanelHeader.vue);
  Transfer Context card from Figma "Agentic Transfer (Human UX)" 181:207.
-->
<template>
  <aside class="transfer-sidebar">
    <header class="transfer-sidebar__header">
      <h3 class="d-headline--lg-compact">Contact Info</h3>
      <button class="transfer-sidebar__icon-btn" aria-label="Close" @click="emit('close')">
        <DtIcon name="close" :size="20" />
      </button>
    </header>

    <div class="transfer-sidebar__content">
      <!-- Customer info -->
      <section class="sidebar-card customer-card">
        <div class="customer-card__avatar">{{ caller.initials }}</div>
        <div class="customer-card__details">
          <div class="customer-card__name-row">
            <h4 class="d-headline--md customer-card__name">{{ caller.name }}</h4>
            <span v-if="caller.verified" class="customer-card__verified">
              <DtIcon name="check" :size="12" />
              <span class="d-label--sm-compact">Verified</span>
            </span>
          </div>
          <p class="d-body--sm d-fc-tertiary">{{ caller.title }} · {{ caller.company }}</p>
          <p class="d-body--sm d-fc-tertiary">{{ caller.phone }}</p>
          <p class="d-body--sm d-fc-tertiary customer-card__email">{{ caller.email }}</p>
        </div>
      </section>

      <!-- Transfer Context -->
      <section class="sidebar-card">
        <button class="sidebar-card__header" :aria-expanded="contextOpen" @click="contextOpen = !contextOpen">
          <DtIcon name="arrow-left-right" :size="18" />
          <span class="d-headline--md sidebar-card__title">Transfer Context</span>
          <DtIcon :name="contextOpen ? 'chevron-up' : 'chevron-down'" :size="14" />
        </button>
        <dl v-if="contextOpen" class="sidebar-card__fields">
          <div v-for="field in context.fields" :key="field.label" class="sidebar-field">
            <dt class="d-body--sm d-fc-tertiary">{{ field.label }}</dt>
            <dd class="d-body--md-compact">{{ field.value }}</dd>
          </div>
        </dl>
      </section>

      <!-- Salesforce -->
      <section class="sidebar-card">
        <button class="sidebar-card__header" :aria-expanded="salesforceOpen" @click="salesforceOpen = !salesforceOpen">
          <DtIcon name="salesforce-logo" :size="18" />
          <span class="d-headline--md sidebar-card__title">Salesforce</span>
          <DtIcon :name="salesforceOpen ? 'chevron-up' : 'chevron-down'" :size="14" />
        </button>
        <dl v-if="salesforceOpen" class="sidebar-card__fields">
          <div v-for="field in salesforce" :key="field.label" class="sidebar-field">
            <dt class="d-body--sm d-fc-tertiary">{{ field.label }}</dt>
            <dd class="d-body--md-compact">{{ field.value }}</dd>
          </div>
        </dl>
      </section>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import DtIcon from '@/components/icons/DtIcon.vue'

defineProps({
  caller: { type: Object, required: true },
  context: { type: Object, required: true },
  salesforce: { type: Array, default: () => [] },
})

const emit = defineEmits(['close'])

const contextOpen = ref(true)
const salesforceOpen = ref(false)
</script>

<style scoped>
.transfer-sidebar {
  display: flex;
  flex-direction: column;
  width: 340px;
  height: 100%;
  background: var(--dt-color-surface-secondary);
  border-left: 1px solid var(--dt-color-border-subtle);
}

.transfer-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding: var(--dt-space-450) var(--dt-space-500);
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.transfer-sidebar__icon-btn {
  width: var(--btn-height-icon);
  height: var(--btn-height-icon);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--dt-color-foreground-secondary);
}

.transfer-sidebar__icon-btn:hover {
  background: var(--dt-color-surface-moderate);
}

.transfer-sidebar__content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 10px var(--dt-space-500);
}

.sidebar-card {
  flex-shrink: 0;
  overflow: hidden;
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
}

.customer-card {
  display: flex;
  align-items: flex-start;
  gap: var(--dt-space-450);
  padding: var(--dt-space-500);
}

.customer-card__avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dt-avatar-color-background-1600);
  color: var(--dt-color-neutral-black);
  font: var(--dt-typography-label-md-compact);
}

.customer-card__details {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-100);
  min-width: 0;
}

.customer-card__name-row {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
}

.customer-card__name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.customer-card__email {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.customer-card__verified {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-100);
  padding: var(--dt-space-100) var(--dt-space-300) var(--dt-space-100) var(--dt-space-100);
  border-radius: var(--dt-size-radius-300);
  background: var(--dt-color-surface-success);
  color: var(--dt-color-foreground-success);
}

.sidebar-card__header {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  width: 100%;
  padding: var(--dt-space-400) var(--dt-space-500);
  text-align: left;
  color: var(--dt-color-foreground-primary);
  transition: background-color var(--td200) var(--ttf-out-quint);
}

.sidebar-card__header:hover {
  background: var(--dt-color-surface-secondary);
}

.sidebar-card__title {
  flex: 1;
  min-width: 0;
}

.sidebar-card__fields {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-450);
  margin: 0;
  padding: 0 var(--dt-space-500) var(--dt-space-500);
}

.sidebar-field dd {
  margin: 0;
  color: var(--dt-color-foreground-primary);
}
</style>
