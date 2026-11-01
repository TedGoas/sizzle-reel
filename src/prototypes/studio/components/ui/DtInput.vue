<template>
  <div class="dt-input" :class="[`dt-input--${size}`, { 'dt-input--disabled': disabled }]">
    <span v-if="$slots.leftIcon" class="dt-input__icon dt-input__icon--left">
      <slot name="leftIcon" />
    </span>
    <input
      class="dt-input__field"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @input="$emit('update:modelValue', $event.target.value)"
      v-bind="inputAttrs"
    />
    <span v-if="$slots.rightIcon" class="dt-input__icon dt-input__icon--right">
      <slot name="rightIcon" />
    </span>
  </div>
</template>

<script setup>
import { useAttrs, computed } from 'vue'

defineProps({
  modelValue: { type: [String, Number], default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const attrs = useAttrs()
const inputAttrs = computed(() => {
  const { class: _c, style: _s, ...rest } = attrs
  return rest
})
</script>

<style scoped>
.dt-input {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-300);
  height: var(--btn-height-md);
  padding: 0 var(--dt-space-400);
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-default);
  border-radius: 6px;
  box-sizing: border-box;
  width: 100%;
}

.dt-input--sm { height: var(--btn-height-sm); }
.dt-input--disabled { opacity: 0.5; }

.dt-input:focus-within {
  border-color: var(--dt-color-border-brand, #7c52ff);
  box-shadow: var(--dt-shadow-focus, 0 0 0 2px rgba(124, 82, 255, 0.25));
}

.dt-input__field {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-primary);
}

.dt-input__icon {
  display: inline-flex;
  color: var(--dt-color-foreground-muted);
  flex-shrink: 0;
}
</style>
