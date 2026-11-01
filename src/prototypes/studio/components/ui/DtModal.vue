<template>
  <Teleport to="body">
    <div v-if="show" class="dt-modal-backdrop" @click.self="$emit('update:show', false)">
      <div class="dt-modal" role="dialog" aria-modal="true">
        <header v-if="title || $slots.header" class="dt-modal__header">
          <slot name="header">
            <h2 class="dt-modal__title">{{ title }}</h2>
          </slot>
          <button type="button" class="dt-modal__close" aria-label="Close" @click="$emit('update:show', false)">×</button>
        </header>
        <div class="dt-modal__body">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="dt-modal__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: { type: String, default: 'md' },
})
defineEmits(['update:show', 'close'])
</script>

<style scoped>
.dt-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.dt-modal {
  width: min(560px, 100%);
  max-height: 90vh;
  overflow: auto;
  background: var(--dt-color-surface-primary);
  border-radius: 12px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
}
.dt-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--dt-color-border-subtle);
}
.dt-modal__title {
  margin: 0;
  font: var(--dt-typography-headline-md);
}
.dt-modal__close {
  border: 0;
  background: transparent;
  font-size: 22px;
  cursor: pointer;
  color: var(--dt-color-foreground-muted);
}
.dt-modal__body { padding: 20px; }
.dt-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--dt-color-border-subtle);
}
</style>
