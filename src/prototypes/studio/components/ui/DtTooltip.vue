<template>
  <span class="dt-tooltip" :title="message || undefined">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  message: { type: String, default: '' },
  placement: { type: String, default: 'top' },
})
</script>

<style scoped>
.dt-tooltip {
  display: inline-flex;
}
</style>
