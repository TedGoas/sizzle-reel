<template>
  <div
    ref="root"
    class="drawer"
    :style="{ width: width + 'px' }"
    role="dialog"
    tabindex="-1"
    :aria-labelledby="titleId"
  >
    <button type="button" class="resize" :aria-label="`Resize ${title} panel`" @mousedown="startResize" />
    <header>
      <button type="button" class="close" aria-label="Close" @click="emit('close')">×</button>
      <h2 :id="titleId">{{ title }}</h2>
      <p v-if="$slots.meta" class="meta"><slot name="meta" /></p>
    </header>
    <slot name="nav" />
    <div ref="body" class="body">
      <slot />
    </div>
    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup>
// Shared right-side panel. Same shell as the Conversation History drawer:
// full height, resizable from the left edge, close in the top right.
import { onMounted, ref, watch } from 'vue'
import { useDrawerDismiss } from '../composables/useDrawerDismiss.js'
import { preferredDrawerWidth } from '../mock/historyData.js'

const props = defineProps({
  title: { type: String, required: true },
  titleId: { type: String, default: 'side-drawer-title' },
  // Starting width in px. Leave empty to match the History drawer.
  defaultWidth: { type: Number, default: null },
  // Change this when the drawer shows a different record, so the body scrolls back to the top.
  contentKey: { type: [String, Number], default: null },
})

const emit = defineEmits(['close', 'resize', 'resizing'])
const root = ref(null)
const body = ref(null)

const width = ref(props.defaultWidth || preferredDrawerWidth())

useDrawerDismiss(root, () => emit('close'))

onMounted(() => emit('resize', width.value))

watch(() => props.contentKey, () => {
  if (body.value) body.value.scrollTop = 0
})

function startResize(event) {
  event.preventDefault()
  const startX = event.clientX
  const startWidth = width.value
  emit('resizing', true)
  function move(moveEvent) {
    width.value = Math.min(1100, Math.max(400, startWidth + (startX - moveEvent.clientX)))
    emit('resize', width.value)
  }
  function up() {
    emit('resizing', false)
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}
</script>

<style scoped>
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 25;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--dt-color-surface-primary);
  border-left: 1px solid var(--dt-color-border-default);
  box-shadow: var(--dt-shadow-medium);
  outline: none;
}

.resize {
  position: absolute;
  top: 0;
  left: -4px;
  width: 8px;
  height: 100%;
  border: 0;
  background: transparent;
  cursor: ew-resize;
}

header { position: relative; padding: var(--dt-space-500) var(--dt-space-550) var(--dt-space-400); }
.close {
  position: absolute;
  top: var(--dt-space-400);
  right: var(--dt-space-400);
  width: var(--btn-height-icon);
  height: var(--btn-height-icon);
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dt-color-foreground-secondary);
  font-size: 20px;
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;
}
.close:hover { background: var(--dt-color-surface-secondary); color: var(--dt-color-foreground-primary); }
.close:active { transform: scale(0.94); }
.close:focus-visible { outline: 2px solid var(--dt-color-border-focus); outline-offset: 1px; }
h2 { margin: 0 var(--dt-space-600) 0 0; font-size: var(--dt-font-size-300); font-weight: 600; }
.meta {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  margin: var(--dt-space-200) 0 0;
  color: var(--dt-color-foreground-tertiary);
  font-size: var(--dt-font-size-100);
}

.body { flex: 1; overflow: auto; padding: var(--dt-space-500) var(--dt-space-550) var(--dt-space-600); }

footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--dt-space-400);
  padding: var(--dt-space-450) var(--dt-space-550);
  border-top: 1px solid var(--dt-color-border-subtle);
}
</style>
