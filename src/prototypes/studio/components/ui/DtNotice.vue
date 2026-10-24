<template>
  <div class="dt-notice" :class="`dt-notice--${kind}`" role="status">
    <div class="dt-notice__body">
      <div v-if="title" class="dt-notice__title">{{ title }}</div>
      <slot />
    </div>
    <button v-if="closeButtonProps !== false" type="button" class="dt-notice__close" aria-label="Close" @click="$emit('close')">
      ×
    </button>
  </div>
</template>

<script setup>
defineProps({
  kind: { type: String, default: 'info' },
  title: { type: String, default: '' },
  closeButtonProps: { type: [Object, Boolean], default: undefined },
})
defineEmits(['close'])
</script>

<style scoped>
.dt-notice {
  display: flex;
  align-items: flex-start;
  gap: var(--dt-space-400);
  padding: var(--dt-space-450);
  border-radius: var(--dt-size-radius-400);
  background: var(--dt-color-surface-secondary);
  border: 1px solid var(--dt-color-border-subtle);
}
.dt-notice--success { background: #e6f5e9; }
.dt-notice--warning { background: #fff4e5; }
.dt-notice--error, .dt-notice--critical { background: #fde8e9; }
.dt-notice__title { font-weight: 600; margin-bottom: 4px; }
.dt-notice__close {
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  color: var(--dt-color-foreground-muted);
}
</style>
