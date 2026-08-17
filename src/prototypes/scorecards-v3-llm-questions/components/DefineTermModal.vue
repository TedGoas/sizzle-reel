<template>
  <div
    v-if="show"
    class="define-modal"
    role="presentation"
  >
    <div class="define-modal-scrim" />
    <div
      class="define-modal-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="define-term-title"
    >
          <div class="define-modal-header">
            <h2 id="define-term-title" class="define-modal-title">Define {{ acronym }}</h2>
            <button
              class="define-modal-close"
              type="button"
              aria-label="Close"
              :disabled="busy"
              @click="$emit('close')"
            >
              <DtIcon name="close" :size="16" />
            </button>
          </div>

          <p class="define-modal-helper">
            Tell the scoring model what this term means on a call.
          </p>

          <textarea
            ref="inputRef"
            class="define-modal-textarea"
            data-autoplay="define-term-input"
            :value="modelValue"
            :disabled="busy"
            rows="5"
            placeholder="What does this term mean?"
            @input="$emit('update:modelValue', $event.target.value)"
          />

          <div class="define-modal-footer">
            <div class="define-modal-status" aria-live="polite">
              <Transition name="define-status" mode="out-in">
                <span
                  v-if="status"
                  :key="status"
                  class="define-modal-status-text"
                  :class="{
                    'define-modal-status-text--live': statusKind === 'busy',
                    'define-modal-status-text--success': statusKind === 'success',
                  }"
                >{{ status }}</span>
              </Transition>
            </div>
            <div class="define-modal-actions">
              <button
                class="define-modal-btn define-modal-btn--cancel"
                type="button"
                :disabled="busy"
                @click="$emit('close')"
              >
                Cancel
              </button>
              <button
                class="define-modal-btn define-modal-btn--save"
                :class="{ 'is-busy': busy }"
                type="button"
                data-autoplay="define-save"
                :disabled="busy || !modelValue.trim()"
                @click="$emit('save')"
              >
                <span v-if="busy" class="define-modal-spinner" aria-hidden="true" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import DtIcon from '../../../components/icons/DtIcon.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  acronym: { type: String, default: '' },
  modelValue: { type: String, default: '' },
  busy: { type: Boolean, default: false },
  status: { type: String, default: '' },
  statusKind: { type: String, default: 'busy' },
})

defineEmits(['close', 'save', 'update:modelValue'])

const inputRef = ref(null)

watch(
  () => props.show,
  async (open) => {
    if (!open) return
    await nextTick()
    inputRef.value?.focus()
  }
)
</script>

<style scoped>
.define-modal {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--dt-space-550);
  box-sizing: border-box;
  animation: define-modal-in 0.2s ease;
}

.define-modal-scrim {
  position: absolute;
  inset: 0;
  background: var(--dt-color-surface-backdrop);
}

.define-modal-dialog {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
  padding: var(--dt-space-550);
  background: var(--dt-color-surface-primary);
  border-radius: var(--dt-space-500);
  box-shadow: var(--dt-shadow-small);
}

.define-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--dt-space-400);
}

.define-modal-title {
  margin: 0;
  font: var(--dt-typography-headline-lg);
  color: var(--dt-color-foreground-primary);
}

.define-modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--btn-height-icon);
  height: var(--btn-height-icon);
  padding: 0;
  border: none;
  border-radius: var(--dt-space-400);
  background: none;
  color: var(--dt-color-foreground-muted);
  cursor: pointer;
}

.define-modal-close:hover:not(:disabled) {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-secondary);
}

.define-modal-close:disabled {
  opacity: 0.5;
  cursor: default;
}

.define-modal-helper {
  margin: 0;
  font: var(--dt-typography-body-sm);
  color: var(--dt-color-foreground-muted);
}

.define-modal-textarea {
  width: 100%;
  min-height: 120px;
  padding: var(--dt-space-400) var(--dt-space-450);
  background: var(--dt-color-surface-secondary);
  border: 1px solid var(--dt-color-border-default);
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-primary);
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s ease;
}

.define-modal-textarea::placeholder {
  color: var(--dt-color-foreground-muted);
}

.define-modal-textarea:focus {
  border-color: var(--dt-color-border-moderate);
}

.define-modal-textarea:disabled {
  opacity: 0.7;
}

.define-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-400);
}

.define-modal-status {
  min-height: 1.2em;
  flex: 1;
  min-width: 0;
}

.define-modal-status-text {
  font: var(--dt-typography-body-sm-compact);
  color: var(--dt-color-foreground-secondary);
}

.define-modal-status-text--live {
  animation: define-status-pulse 1.2s ease-in-out infinite;
}

.define-modal-status-text--success {
  color: var(--dt-color-foreground-success);
}

.define-modal-actions {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  flex-shrink: 0;
}

.define-modal-btn {
  height: var(--btn-height-md);
  padding: 0 var(--dt-space-500);
  border-radius: var(--dt-space-400);
  font: var(--dt-typography-label-sm-compact);
  cursor: pointer;
  border: none;
}

.define-modal-btn:disabled {
  opacity: 0.55;
  cursor: default;
}

.define-modal-btn--cancel {
  background: none;
  color: var(--dt-color-foreground-muted);
}

.define-modal-btn--cancel:hover:not(:disabled) {
  color: var(--dt-color-foreground-secondary);
}

.define-modal-btn--save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--dt-space-300);
  background: var(--dt-color-link-primary);
  color: var(--dt-color-surface-primary);
}

.define-modal-btn--save:hover:not(:disabled) {
  background: var(--dt-color-link-primary-hover);
}

.define-modal-btn--save.is-busy:disabled {
  opacity: 0.9;
}

.define-modal-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: define-spin 0.7s linear infinite;
}

@keyframes define-spin {
  to { transform: rotate(360deg); }
}

@keyframes define-modal-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.define-status-enter-active,
.define-status-leave-active {
  transition: opacity 0.18s ease;
}

.define-status-enter-from,
.define-status-leave-to {
  opacity: 0;
}

@keyframes define-status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.42; }
}

@media (prefers-reduced-motion: reduce) {
  .define-modal {
    animation: none;
  }

  .define-modal-status-text--live {
    animation: none;
  }

  .define-modal-spinner {
    animation: none;
    border-right-color: currentColor;
    opacity: 0.55;
  }

  .define-status-enter-active,
  .define-status-leave-active {
    transition: none;
  }
}
</style>
