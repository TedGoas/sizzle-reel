<template>
  <div class="dt-combobox">
    <div class="dt-combobox__chips">
      <span v-for="(item, i) in selectedItems" :key="i" class="dt-combobox__chip">
        {{ typeof item === 'string' ? item : item.label || item.name }}
      </span>
      <input
        class="dt-combobox__input"
        :value="query"
        :placeholder="placeholder"
        @input="query = $event.target.value; $emit('query', query)"
        @focus="$emit('focus')"
      />
    </div>
    <div v-if="showList && $slots.default" class="dt-combobox__list">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  selectedItems: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Select…' },
  showList: { type: Boolean, default: false },
  label: { type: String, default: '' },
})

defineEmits(['query', 'focus', 'select', 'remove'])

const query = ref('')
</script>

<style scoped>
.dt-combobox {
  position: relative;
  width: 100%;
}
.dt-combobox__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  min-height: 32px;
  padding: 4px 8px;
  border: 1px solid var(--dt-color-border-default);
  border-radius: 4px;
  background: var(--dt-color-surface-primary);
}
.dt-combobox__chip {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--dt-color-surface-secondary);
  font-size: 12px;
}
.dt-combobox__input {
  flex: 1;
  min-width: 80px;
  border: 0;
  outline: none;
  font: var(--dt-typography-body-sm);
  background: transparent;
}
.dt-combobox__list {
  position: absolute;
  z-index: 20;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 240px;
  overflow: auto;
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
</style>
