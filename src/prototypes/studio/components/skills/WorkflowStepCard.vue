<template>
  <div style="border: 1px solid #e0e0e0; border-left: 3px solid #4caf50; border-radius: 6px; padding: 16px; background: white;">
    <div style="font-size: 10px; text-transform: uppercase; color: #666; margin-bottom: 4px;">{{ step.type }}</div>
    <div style="font-weight: 500; margin-bottom: 4px;">{{ step.title }}</div>
    <div style="font-size: 14px; color: #666;">{{ step.description }}</div>
  </div>
</template>

<script setup>
defineProps({
  step: {
    type: Object,
    required: true
  }
})
</script>
