<template>
  <div
    class="zoom-controls"
    :class="{ 'fade-out': isFading }"
  >
    <button @click="$emit('zoom-out')" title="Zoom out" :disabled="zoomLevel <= 0.5">
      <dt-icon name="zoom-out" size="200" />
    </button>
    <button @click="$emit('zoom-in')" title="Zoom in" :disabled="zoomLevel >= 2">
      <dt-icon name="zoom-in" size="200" />
    </button>
    <button @click="$emit('reset-zoom')" title="Help">
      <dt-icon name="help-circle" size="200" />
    </button>
  </div>
</template>

<script setup>
import { DtIcon } from '../ui'

defineProps({
  zoomLevel: {
    type: Number,
    required: true
  },
  isFading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['zoom-in', 'zoom-out', 'reset-zoom'])
</script>
