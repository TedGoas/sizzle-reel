<template>
  <button
    type="button"
    class="dt-btn"
    :class="[
      `dt-btn--${importance}`,
      `dt-btn--${kind}`,
      `dt-btn--${size}`,
      { 'dt-btn--circle': circle, 'dt-btn--icon': iconOnly },
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <span v-if="$slots.icon" class="dt-btn__icon" :class="`dt-btn__icon--${iconPosition}`">
      <slot name="icon" />
    </span>
    <slot />
  </button>
</template>

<script setup>
defineProps({
  importance: { type: String, default: 'primary' }, // primary | outlined | clear | muted
  kind: { type: String, default: 'default' }, // default | muted | danger | inverted
  size: { type: String, default: 'md' }, // xs | sm | md | lg
  circle: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  iconPosition: { type: String, default: 'left' },
  iconOnly: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})
</script>

<style scoped>
.dt-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--dt-space-300);
  height: var(--btn-height-md);
  padding: 0 var(--dt-space-450);
  border-radius: 6px;
  border: 1px solid transparent;
  font: var(--dt-typography-label-md-compact);
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  background: var(--dt-color-surface-brand);
  color: #fff;
}

.dt-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dt-btn--xs { height: var(--btn-height-sm); padding: 0 var(--dt-space-400); font-size: 12px; }
.dt-btn--sm { height: var(--btn-height-sm); padding: 0 var(--dt-space-400); }
.dt-btn--lg { height: 36px; padding: 0 var(--dt-space-500); }

.dt-btn--primary {
  background: var(--dt-color-surface-brand);
  color: #fff;
  border-color: transparent;
}
.dt-btn--primary:hover:not(:disabled) {
  filter: brightness(1.05);
}

.dt-btn--outlined {
  background: var(--dt-color-surface-primary);
  color: var(--dt-color-foreground-primary);
  border-color: var(--dt-color-border-default);
}
.dt-btn--outlined:hover:not(:disabled) {
  background: var(--dt-color-surface-secondary);
}

.dt-btn--clear,
.dt-btn--muted {
  background: transparent;
  color: var(--dt-color-foreground-primary);
  border-color: transparent;
}
.dt-btn--clear:hover:not(:disabled),
.dt-btn--muted:hover:not(:disabled) {
  background: var(--dt-color-surface-secondary);
}

.dt-btn--kind-muted,
.dt-btn--muted {
  color: var(--dt-color-foreground-muted);
}

.dt-btn--danger {
  background: var(--dt-color-surface-critical-strong, #d02127);
  color: #fff;
}

.dt-btn--circle,
.dt-btn--icon {
  width: var(--btn-height-icon);
  padding: 0;
}

.dt-btn__icon {
  display: inline-flex;
  align-items: center;
}
</style>
