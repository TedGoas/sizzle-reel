<template>
  <div class="dt-pagination">
    <button type="button" class="dt-pagination__btn" :disabled="modelValue <= 1" @click="$emit('update:modelValue', modelValue - 1)">Prev</button>
    <span class="dt-pagination__label">{{ modelValue }} / {{ totalPages }}</span>
    <button type="button" class="dt-pagination__btn" :disabled="modelValue >= totalPages" @click="$emit('update:modelValue', modelValue + 1)">Next</button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  ariaLabel: { type: String, default: 'Pagination' },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.dt-pagination {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.dt-pagination__btn {
  height: 28px;
  padding: 0 10px;
  border: 1px solid var(--dt-color-border-default);
  border-radius: 4px;
  background: var(--dt-color-surface-primary);
  cursor: pointer;
}
.dt-pagination__btn:disabled { opacity: 0.4; cursor: not-allowed; }
.dt-pagination__label { font: var(--dt-typography-body-sm); color: var(--dt-color-foreground-muted); }
</style>
