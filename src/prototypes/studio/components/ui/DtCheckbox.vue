<template>
  <label class="dt-checkbox">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="dt-checkbox__label"><slot /></span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  name: { type: String, default: undefined },
  value: { type: [String, Number, Boolean], default: undefined },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.dt-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-350);
  font: var(--dt-typography-body-md);
  cursor: pointer;
}
.dt-checkbox input {
  width: 16px;
  height: 16px;
  accent-color: var(--dt-color-surface-brand-strong, #7c52ff);
}
</style>
