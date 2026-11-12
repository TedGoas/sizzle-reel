<template>
  <button type="button" class="sd-btn copy-btn" @click="markCopied">
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path v-if="copied" d="M20 6 9 17l-5-5" />
      <template v-else>
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </template>
    </svg>
    <span class="label">
      <span class="sizer" aria-hidden="true">Copied</span>
      <span class="shown">{{ copied ? 'Copied' : 'Copy' }}</span>
    </span>
  </button>
</template>

<script setup>
import { onUnmounted, ref } from 'vue'
import { TIMING } from '../../mock/historyData.js'

const copied = ref(false)
let timer = 0

function markCopied() {
  copied.value = true
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    copied.value = false
    timer = 0
  }, TIMING.copyReset)
}

onUnmounted(() => window.clearTimeout(timer))
</script>

<style scoped>
.copy-btn {
  flex-shrink: 0;
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-tertiary);
}
.copy-btn:hover {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-primary);
}
.icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.label { display: inline-grid; }
.sizer,
.shown { grid-area: 1 / 1; }
.sizer { visibility: hidden; }
.shown { text-align: center; }
</style>
