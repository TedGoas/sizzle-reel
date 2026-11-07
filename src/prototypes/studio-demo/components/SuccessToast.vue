<template>
  <div class="publish-toast" role="status">
    <Icon name="check-circle" :size="20" class="check" />
    <span class="message">{{ message }}</span>
    <button type="button" class="toast-close" aria-label="Dismiss" @click="emit('close')">
      <Icon name="close" :size="16" />
    </button>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import Icon from './Icon.vue'
import { TIMING } from '../mock/agentData.js'

defineProps({
  message: { type: String, required: true },
})

const emit = defineEmits(['close'])
let timer = null

onMounted(() => {
  timer = setTimeout(() => emit('close'), TIMING.successToast)
})
onUnmounted(() => clearTimeout(timer))
</script>

<style scoped>
/* Mirrors Dialtone's .d-toast.d-toast--success (public dialtone-css). */
.publish-toast {
  position: fixed;
  z-index: 40;
  top: 44px;
  left: 50%;
  display: flex;
  align-items: center;
  gap: var(--dt-space-450);
  max-width: calc(100vw - 32px);
  padding: var(--dt-space-450) var(--dt-space-400) var(--dt-space-450) var(--dt-space-500);
  background: var(--dt-color-surface-success);
  border-radius: 8px;
  box-shadow: 0 0 0 1px var(--dt-color-border-subtle) inset, var(--dt-shadow-medium);
  color: var(--dt-color-foreground-primary);
  font-size: var(--dt-font-size-200);
  line-height: 1.4;
  transform: translateX(-50%);
}

.check {
  flex-shrink: 0;
  color: var(--dt-color-foreground-success);
}

.message {
  flex: 1;
  margin-right: var(--dt-space-400);
  white-space: nowrap;
}

.toast-close {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: var(--btn-height-icon);
  height: var(--btn-height-icon);
  padding: 0;
  border-radius: 6px;
  color: var(--dt-color-foreground-primary);
  cursor: pointer;
}

.toast-close:hover {
  background: var(--dt-color-border-subtle);
}

.toast-close:focus-visible {
  box-shadow: var(--dt-shadow-focus);
  outline: none;
}
</style>
