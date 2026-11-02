<template>
  <aside class="drawer" :class="{ 'is-open': entered }">
    <div class="sheet">
      <header class="sheet-header">
        <div class="crumb">
          <span class="crumb-title">Skill</span>
          <span class="crumb-actions">
            <span class="reviewed">Auto reviewed</span>
            <span class="crumb-divider" />
            <button type="button" class="icon-close" aria-label="Close" :disabled="thinking" @click="emit('cancel')">
              <svg viewBox="0 0 12 12"><path d="M3 3l6 6M9 3 3 9" /></svg>
            </button>
          </span>
        </div>
      </header>

      <div class="sheet-body">
        <div class="field-label">Summary</div>
        <p class="field-hint">A summary of your skill's steps. Switch to Advanced to edit in full.</p>
        <div class="summary" :class="{ 'is-thinking': thinking }">
          <textarea
            v-model="draft"
            placeholder="Type instructions here..."
            aria-label="Skill summary"
            :disabled="thinking"
          />
        </div>
      </div>

      <footer class="sheet-footer">
        <button type="button" class="btn btn--quiet advanced">Advanced</button>
        <div class="footer-right">
          <button type="button" class="btn btn--quiet" :disabled="thinking" @click="emit('cancel')">Cancel</button>
          <button type="button" class="btn btn--primary" :disabled="!draft.trim() || thinking" @click="start">Create</button>
        </div>
      </footer>
    </div>
  </aside>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const emit = defineEmits(['cancel', 'created'])

const entered = ref(false)
const draft = ref('')
const thinking = ref(false)
let timer = 0

onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { entered.value = true })
  })
})

onUnmounted(() => {
  clearTimeout(timer)
})

function start() {
  if (!draft.value.trim() || thinking.value) return
  thinking.value = true
  timer = setTimeout(() => emit('created'), 2500)
}
</script>

<style scoped>
.drawer {
  position: absolute;
  z-index: 6;
  top: 16px;
  right: 16px;
  bottom: 16px;
  width: 468px;
  cursor: default;
  transform: translateX(calc(100% + 32px));
  transition: transform 0.45s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.drawer.is-open {
  transform: translateX(0);
}

.sheet {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: #fff;
  border-radius: 24px;
  box-shadow:
    0 2px 16px rgba(0, 0, 0, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 1px 2px rgba(0, 0, 0, 0.03);
}

.sheet-header {
  flex-shrink: 0;
  padding: 16px;
}

.crumb {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 8px 0 15px;
  background: #f9f9f9;
  border-radius: 12px;
}

.crumb-title {
  color: #1c1c1c;
  font-size: 15px;
  font-weight: 590;
  line-height: 24px;
}

.crumb-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.reviewed {
  padding: 0 8px;
  color: #3a3a3a;
  font-size: 13px;
  font-weight: 650;
}

.crumb-divider {
  width: 1px;
  height: 16px;
  background: rgba(28, 28, 28, 0.12);
}

.icon-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #666;
  cursor: pointer;
}

.icon-close:disabled {
  cursor: default;
  opacity: 0.4;
}

.icon-close svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
}

.sheet-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 0 16px 88px;
}

.field-label {
  color: #1c1c1c;
  font-size: 15px;
  font-weight: 590;
  line-height: 21px;
}

.field-hint {
  margin: 0 0 8px;
  color: #808080;
  font-size: 12px;
  line-height: 1.4;
}

.summary {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border: 1px solid rgba(28, 28, 28, 0.16);
  border-radius: 12px;
  background: #fff;
}

.summary.is-thinking::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    110deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(147, 88, 255, 0.08) 20%,
    rgba(147, 88, 255, 0.2) 35%,
    rgba(236, 72, 153, 0.15) 45%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(236, 72, 153, 0.15) 55%,
    rgba(147, 88, 255, 0.2) 65%,
    rgba(147, 88, 255, 0.08) 80%,
    rgba(255, 255, 255, 0) 100%
  );
  filter: blur(8px);
  animation: summary-shimmer 1.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes summary-shimmer {
  from { left: -100%; }
  to { left: 100%; }
}

textarea {
  width: 100%;
  height: 100%;
  padding: 16px;
  border: 0;
  resize: none;
  background: transparent;
  color: #1c1c1c;
  font: inherit;
  font-size: 15px;
  line-height: 1.45;
  outline: none;
}

textarea::placeholder {
  color: #b0b0b0;
  font-style: italic;
}

textarea:disabled {
  color: #3a3a3a;
}

.sheet-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
  padding: 24px 16px 16px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 46%, #fff 100%);
  border-radius: 0 0 24px 24px;
  pointer-events: none;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn {
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  font-size: 15px;
  font-weight: 590;
  pointer-events: auto;
  cursor: pointer;
}

.btn--quiet {
  color: #3a3a3a;
}

.advanced {
  color: #808080;
  cursor: default;
}

.btn--quiet:hover:not(:disabled):not(.advanced) {
  background: rgba(0, 0, 0, 0.05);
}

.btn--primary {
  background: #7c52ff;
  color: #fff;
}

.btn--primary:hover:not(:disabled) {
  filter: brightness(0.96);
}

.btn:disabled {
  opacity: 0.45;
  cursor: default;
}
</style>
