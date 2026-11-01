<template>
  <div class="dt-list-item" role="option" @click="$emit('click', $event)">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  navigationType: { type: String, default: undefined },
  role: { type: String, default: 'option' },
})
defineEmits(['click'])
</script>

<style scoped>
.dt-list-item {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}
.dt-list-item:hover {
  background: var(--dt-color-surface-secondary);
}
</style>
