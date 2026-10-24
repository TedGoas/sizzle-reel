<template>
  <div class="dt-radio-group" role="radiogroup">
    <div v-if="name || $slots.default" class="dt-radio-group__label" v-show="false" />
    <slot />
  </div>
</template>

<script setup>
import { computed, provide, toRef } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number, Boolean], default: undefined },
  name: { type: String, default: 'radio-group' },
})

const emit = defineEmits(['update:modelValue'])

provide('dtRadioGroup', {
  modelValue: toRef(props, 'modelValue'),
  name: computed(() => props.name),
  update: (v) => emit('update:modelValue', v),
})
</script>

<style scoped>
.dt-radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-350);
}
</style>
