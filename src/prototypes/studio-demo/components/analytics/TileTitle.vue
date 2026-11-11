<template>
  <div class="tile-title">
    <h3>
      <button
        type="button"
        class="title"
        :aria-describedby="open ? tipId : undefined"
        @mouseenter="open = true"
        @mouseleave="open = false"
        @focus="open = true"
        @blur="open = false"
      >{{ title }}</button>
    </h3>
    <div v-if="open" :id="tipId" class="tip" role="tooltip">
      <strong>{{ title }}</strong>
      <p>{{ tip }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  tip: { type: String, required: true },
})

const open = ref(false)
const tipId = computed(() => `tile-tip-${props.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)
</script>

<style scoped>
.tile-title {
  position: relative;
  display: flex;
  align-items: center;
}

h3 { margin: 0; }

.title {
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  font-size: var(--dt-font-size-200);
  font-weight: 600;
  line-height: 1.6;
  color: var(--dt-color-foreground-primary);
  text-decoration: underline;
  text-decoration-style: dotted;
  text-decoration-color: var(--dt-color-foreground-muted);
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  cursor: default;
  transition: text-decoration-color 0.15s ease;
}

.title:hover,
.title:focus-visible {
  text-decoration-color: var(--dt-color-foreground-primary);
  outline: none;
}

.tip {
  position: absolute;
  z-index: 6;
  bottom: calc(100% + var(--dt-space-200));
  left: 0;
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
  width: max-content;
  max-width: 280px;
  padding: var(--dt-space-400) var(--dt-space-450);
  background: var(--dt-color-surface-contrast);
  border-radius: var(--dt-space-300);
  box-shadow: var(--dt-shadow-medium);
  color: var(--dt-color-foreground-primary-inverted);
  font-size: var(--dt-font-size-100);
  font-weight: 400;
  line-height: 1.4;
  text-align: left;
  pointer-events: none;
}

.tip strong { font-weight: 700; }
.tip p {
  margin: 0;
  color: var(--dt-color-foreground-secondary-inverted);
}
</style>
