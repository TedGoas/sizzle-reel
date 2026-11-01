<template>
  <div class="dt-msg-input">
    <textarea
      class="dt-msg-input__field"
      :value="modelValue"
      :placeholder="placeholder"
      rows="2"
      @input="$emit('update:modelValue', $event.target.value)"
      @keydown.enter.exact.prevent="$emit('submit')"
    />
    <button type="button" class="dt-msg-input__send" aria-label="Send" @click="$emit('submit')">
      <slot name="rightIcon">Send</slot>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Message…' },
})
defineEmits(['update:modelValue', 'submit'])
</script>

<style scoped>
.dt-msg-input {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--dt-color-border-default);
  border-radius: 8px;
  background: var(--dt-color-surface-primary);
}
.dt-msg-input__field {
  flex: 1;
  border: 0;
  outline: none;
  resize: none;
  font: var(--dt-typography-body-md);
  background: transparent;
}
.dt-msg-input__send {
  border: 0;
  background: var(--dt-color-surface-brand-strong, #7c52ff);
  color: #fff;
  border-radius: 6px;
  height: 32px;
  padding: 0 12px;
  cursor: pointer;
}
</style>
