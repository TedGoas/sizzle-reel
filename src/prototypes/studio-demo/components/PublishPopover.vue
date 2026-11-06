<template>
  <div class="publish-overlay" @click="close" />
  <div ref="panel" class="publish-popover" role="dialog" aria-labelledby="publish-title" tabindex="-1" @keydown.esc="close">
    <h3 id="publish-title" class="title">{{ agentName }}</h3>

    <ul class="rows">
      <li class="row">
        <Icon name="cloud" :size="14" />
        <span class="row-text">Saved {{ publishInfo.savedAgo }} · by {{ publishInfo.savedBy }}</span>
      </li>
      <li class="row row--link">
        <Icon name="arrow-up" :size="14" />
        <span class="row-text">
          {{ published ? `Published just now · v${publishInfo.version}` : 'Never published' }}
        </span>
        <Icon name="chevron-right" :size="14" class="chevron" />
      </li>
      <li class="row row--link">
        <Icon name="history" :size="14" />
        <span class="row-text">Version history</span>
        <Icon name="chevron-right" :size="14" class="chevron" />
      </li>
    </ul>

    <div class="actions">
      <button type="button" class="sd-btn sd-btn--outlined">
        <Icon name="link-2" :size="16" />
        Share link
      </button>
      <button
        type="button"
        class="sd-btn sd-btn--primary publish-btn"
        :class="{ 'is-working': working }"
        :aria-busy="working"
        :disabled="working"
        @click="publish"
      >
        <span class="btn-label">
          Publish v{{ publishInfo.version }}
          <Icon name="arrow-up" :size="16" />
        </span>
        <span v-if="working" class="btn-working" aria-live="polite">
          <span class="spinner" aria-hidden="true" />
          Publishing…
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Icon from './Icon.vue'
import { TIMING, publishInfo } from '../mock/agentData.js'

defineProps({
  agentName: { type: String, default: '' },
  published: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'published'])
const panel = ref(null)
const working = ref(false)
let timer = null

function close() {
  if (working.value) return
  emit('close')
}

function publish() {
  if (working.value) return
  working.value = true
  timer = setTimeout(() => {
    working.value = false
    emit('published')
  }, TIMING.publishWorking)
}

onMounted(() => panel.value?.focus({ preventScroll: true }))
onUnmounted(() => clearTimeout(timer))
</script>

<style scoped>
.publish-overlay {
  position: absolute;
  inset: 0;
  z-index: 7;
}

.publish-popover {
  position: absolute;
  z-index: 8;
  top: 60px;
  right: 16px;
  width: 300px;
  padding: var(--dt-space-500);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.08);
  outline: none;
  cursor: default;
  animation: pop-in 0.16s cubic-bezier(0.32, 0.72, 0, 1);
  transform-origin: top right;
}

@keyframes pop-in {
  from { opacity: 0; transform: translateY(-4px) scale(0.98); }
  to { opacity: 1; transform: none; }
}

.title {
  margin: 0 0 var(--dt-space-400);
  color: #1c1c1c;
  font-size: 17px;
  font-weight: 600;
  line-height: 24px;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-200);
  margin: 0 0 var(--dt-space-500);
  padding: 0;
}

.row {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  min-height: 24px;
  color: #666;
  font-size: 13px;
}

.row-text {
  flex: 1;
  min-width: 0;
}

.chevron {
  color: #999;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--dt-space-400);
}

.sd-btn {
  min-width: 0;
}

.publish-btn {
  position: relative;
}

.publish-btn:not(:disabled):hover {
  filter: brightness(0.96);
}

.publish-btn:disabled {
  opacity: 1;
  cursor: progress;
}

.btn-label {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-200);
}

/* Keep the label in the layout so the button never changes size. */
.is-working .btn-label {
  visibility: hidden;
}

.btn-working {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--dt-space-300);
}

.spinner {
  width: 12px;
  height: 12px;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

</style>
