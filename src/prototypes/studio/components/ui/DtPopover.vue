<template>
  <div class="dt-popover" ref="root">
    <div class="dt-popover__anchor" @click.stop="toggle">
      <slot name="anchor" />
    </div>
    <div
      v-if="isOpen"
      class="dt-popover__content"
      :class="[`dt-popover__content--${placement}`]"
      role="dialog"
      @click.stop
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: undefined },
  placement: { type: String, default: 'bottom-start' },
  initialFocusElement: { type: String, default: undefined },
})

const emit = defineEmits(['update:open', 'opened', 'closed'])

const internalOpen = ref(false)
const root = ref(null)

const isOpen = computed({
  get: () => (props.open !== undefined ? props.open : internalOpen.value),
  set: (v) => {
    if (props.open !== undefined) emit('update:open', v)
    else internalOpen.value = v
  },
})

watch(isOpen, (v) => {
  if (v) emit('opened')
  else emit('closed')
})

function toggle() {
  isOpen.value = !isOpen.value
}

function onDocClick(e) {
  if (!root.value) return
  if (!root.value.contains(e.target) && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocClick, true))
onUnmounted(() => document.removeEventListener('click', onDocClick, true))

defineExpose({ open: isOpen, toggle })
</script>

<style scoped>
.dt-popover {
  position: relative;
  display: inline-flex;
}
.dt-popover__anchor {
  display: inline-flex;
}
.dt-popover__content {
  position: absolute;
  z-index: 1000;
  top: calc(100% + 4px);
  left: 0;
  min-width: 200px;
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: var(--dt-space-400);
}
.dt-popover__content--bottom-end {
  left: auto;
  right: 0;
}
.dt-popover__content--top-start {
  top: auto;
  bottom: calc(100% + 4px);
}
</style>
