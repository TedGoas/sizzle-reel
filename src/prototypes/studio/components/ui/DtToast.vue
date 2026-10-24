<template>
  <div v-if="show" class="dt-toast" :class="`dt-toast--${kind}`" role="status">
    <div class="dt-toast__body">
      <div v-if="title" class="dt-toast__title">{{ title }}</div>
      <slot />
    </div>
    <div v-if="$slots.action" class="dt-toast__action"><slot name="action" /></div>
    <button v-if="!hideClose" type="button" class="dt-toast__close" aria-label="Close" @click="$emit('close')">×</button>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: true },
  kind: { type: String, default: 'base' },
  title: { type: String, default: '' },
  hideClose: { type: Boolean, default: false },
  duration: { type: Number, default: 0 },
})
defineEmits(['update:show', 'close'])
</script>

<style scoped>
.dt-toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 280px;
  max-width: 420px;
  padding: 14px 16px;
  background: #1f1f1f;
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}
.dt-toast__title { font-weight: 600; margin-bottom: 2px; }
.dt-toast__close {
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.7;
  margin-left: auto;
}
</style>
