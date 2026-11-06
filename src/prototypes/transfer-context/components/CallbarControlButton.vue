<!--
  Callbar control button, ported from design-studio
  (prototypes/dialpad-app/components/control-button/ControlButton.vue).
  Toggleable buttons flip `active`; the rest are inert.
-->
<template>
  <button
    class="control-button"
    :class="[`control-button--${kind}`, { 'control-button--active': active }]"
    :aria-pressed="toggleable ? active : undefined"
    @click="toggleable && (active = !active)"
  >
    <span class="control-button__icon">
      <slot name="icon">
        <DtIcon :name="active && activeIcon ? activeIcon : icon" :size="20" />
      </slot>
    </span>
    <span class="control-button__label d-body--sm">{{ active && activeLabel ? activeLabel : label }}</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import DtIcon from '@/components/icons/DtIcon.vue'

defineProps({
  label: { type: String, required: true },
  icon: { type: String, default: '' },
  activeLabel: { type: String, default: '' },
  activeIcon: { type: String, default: '' },
  kind: { type: String, default: 'default' }, // 'default' | 'critical'
  toggleable: { type: Boolean, default: false },
})

const active = ref(false)
</script>

<style scoped>
.control-button {
  --control-button-active-hover: hsla(137, 100%, 59%, 0.1);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--dt-space-200);
  flex-shrink: 0;
  width: 72px;
  height: 64px;
  border-radius: 4px;
  color: var(--dt-color-foreground-primary-inverted);
  transition: background-color var(--td200) var(--ttf-out-quint);
}

.control-button:hover {
  background-color: var(--dt-action-color-background-inverted-hover);
}

.control-button__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.control-button__label {
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.control-button--default.control-button--active,
.control-button--default:active {
  color: var(--dt-callbar-color-neon-green);
}

.control-button--default.control-button--active:hover {
  background-color: var(--control-button-active-hover);
}

.control-button--critical.control-button--active,
.control-button--critical:active {
  background-color: var(--dt-action-color-background-critical-primary-default);
  color: var(--dt-color-neutral-white);
}

.control-button--critical.control-button--active:hover {
  background-color: var(--dt-action-color-background-critical-primary-hover);
}
</style>
