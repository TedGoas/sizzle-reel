<template>
  <div class="tile-title">
    <h3>{{ title }}</h3>
    <button
      type="button"
      class="info"
      :aria-label="tip"
      @mouseenter="open = true"
      @mouseleave="open = false"
      @focus="open = true"
      @blur="open = false"
    >
      <Icon name="help-circle" :size="14" />
    </button>
    <div v-if="open" class="tip" role="tooltip">{{ tip }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Icon from '../Icon.vue'

defineProps({
  title: { type: String, required: true },
  tip: { type: String, required: true },
})

const open = ref(false)
</script>

<style scoped>
.tile-title {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--dt-space-200);
  color: var(--dt-color-foreground-tertiary);
}

h3 {
  margin: 0;
  font-size: var(--dt-font-size-200);
  font-weight: 600;
  color: var(--dt-color-foreground-primary);
}

.info {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--btn-height-sm);
  height: var(--btn-height-sm);
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--dt-color-foreground-tertiary);
  cursor: help;
}

.info:hover,
.info:focus-visible {
  background: var(--dt-color-surface-secondary);
  outline: none;
}

.tip {
  position: absolute;
  z-index: 6;
  top: calc(100% + var(--dt-space-200));
  left: 0;
  width: max-content;
  max-width: 260px;
  padding: var(--dt-space-400) var(--dt-space-450);
  background: var(--dt-color-surface-glass);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-space-300);
  box-shadow: var(--dt-shadow-small);
  color: var(--dt-color-foreground-primary);
  font-size: var(--dt-font-size-100);
  font-weight: 400;
  line-height: 1.4;
  text-align: left;
  pointer-events: none;
}
</style>
