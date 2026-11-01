<template>
  <button
    type="button"
    class="dt-toggle"
    :class="{ 'dt-toggle--on': modelValue, 'dt-toggle--disabled': disabled }"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span class="dt-toggle__thumb" />
  </button>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.dt-toggle {
  width: 36px;
  height: 20px;
  border-radius: 999px;
  border: 0;
  padding: 2px;
  background: var(--dt-color-surface-moderate, #c6c6c6);
  cursor: pointer;
  transition: background 0.15s ease;
}
.dt-toggle--on {
  background: var(--dt-color-surface-brand-strong, #7c52ff);
}
.dt-toggle__thumb {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.15s ease;
}
.dt-toggle--on .dt-toggle__thumb {
  transform: translateX(16px);
}
.dt-toggle--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
