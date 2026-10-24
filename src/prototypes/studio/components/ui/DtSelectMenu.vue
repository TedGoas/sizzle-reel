<template>
  <select
    class="custom-select dt-select"
    :value="modelValue"
    :disabled="disabled"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <slot />
  </select>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  disabled: { type: Boolean, default: false },
  label: { type: String, default: '' },
  size: { type: String, default: 'md' },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.dt-select {
  width: auto;
  min-width: 120px;
}
</style>
