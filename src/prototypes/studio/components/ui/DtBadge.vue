<template>
  <span class="dt-badge" :class="[`dt-badge--${kind}`, `dt-badge--${type}`]">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  kind: { type: String, default: 'default' },
  type: { type: String, default: 'default' }, // default | inverted | etc
})
</script>

<style scoped>
.dt-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font: var(--dt-typography-label-sm-compact);
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-primary);
  white-space: nowrap;
}
.dt-badge--success { background: var(--dt-color-surface-success-subtle, #e6f5e9); color: var(--dt-color-foreground-success); }
.dt-badge--critical { background: var(--dt-color-surface-critical-subtle, #fde8e9); color: var(--dt-color-foreground-critical); }
.dt-badge--warning { background: #fff4e5; color: #a15c00; }
.dt-badge--info { background: #e8f0fe; color: #1a56db; }
.dt-badge--bulletin { background: #f3e8ff; color: #6b21a8; }
</style>
