<template>
  <label class="dt-radio">
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="dt-radio__label"><slot /></span>
  </label>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  value: { type: [String, Number, Boolean], required: true },
  name: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
  modelValue: { type: [String, Number, Boolean], default: undefined },
})

const emit = defineEmits(['update:modelValue'])
const group = inject('dtRadioGroup', null)

const isChecked = computed(() => {
  if (group) return group.modelValue.value === props.value
  return props.modelValue === props.value
})

function onChange() {
  if (group) group.update(props.value)
  else emit('update:modelValue', props.value)
}
</script>

<style scoped>
.dt-radio {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-350);
  font: var(--dt-typography-body-md);
  cursor: pointer;
}
.dt-radio input {
  width: 16px;
  height: 16px;
  accent-color: var(--dt-color-surface-brand-strong, #7c52ff);
}
</style>
