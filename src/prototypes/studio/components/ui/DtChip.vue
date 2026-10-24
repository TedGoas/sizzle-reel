<template>
  <span class="dt-chip">
    <slot />
    <button v-if="hideClose == false" type="button" class="dt-chip__close" aria-label="Remove" @click="$emit('close')">
      ×
    </button>
  </span>
</template>

<script setup>
defineProps({
  hideClose: { type: Boolean, default: true },
})
defineEmits(['close'])
</script>

<style scoped>
.dt-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--dt-color-surface-secondary);
  font: var(--dt-typography-label-sm-compact);
}
.dt-chip__close {
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  color: var(--dt-color-foreground-muted);
}
</style>
