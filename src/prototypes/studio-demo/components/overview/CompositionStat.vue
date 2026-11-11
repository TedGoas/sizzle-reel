<template>
  <article class="sd-card card stat">
    <TileTitle :title="title" :tip="tip" />
    <div class="headline">
      <p class="hero">{{ total.toLocaleString() }}</p>
      <span v-if="trend != null" class="trend" :class="tone">
        <Icon name="arrow-up" :size="12" :class="{ flip: trend < 0 }" />
        {{ trendLabel }}
      </span>
    </div>
    <p class="meta">
      <span class="line">{{ share ? `(${share})` : '\u00a0' }}</span>
      <span class="line">{{ caption || '\u00a0' }}</span>
    </p>
    <div class="bar" role="img" :aria-label="barLabel">
      <span
        v-for="segment in segments"
        :key="segment.id"
        class="seg"
        :style="{ width: widthOf(segment), background: segment.color, opacity: dim(segment.id) }"
        @mouseenter="hover = segment.id"
        @mouseleave="hover = null"
      />
    </div>
    <div class="legend">
      <span
        v-for="segment in segments"
        :key="segment.id"
        class="legend-item"
        @mouseenter="hover = segment.id"
        @mouseleave="hover = null"
      >
        <i :style="{ background: segment.color }" />
        {{ segment.label }}
        <strong>{{ segment.value.toLocaleString() }}</strong>
      </span>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import Icon from '../Icon.vue'
import TileTitle from '../analytics/TileTitle.vue'

const props = defineProps({
  title: { type: String, required: true },
  tip: { type: String, required: true },
  total: { type: Number, required: true },
  caption: { type: String, default: '' },
  share: { type: String, default: '' },
  trend: { type: Number, default: null },
  lowerIsBetter: { type: Boolean, default: false },
  segments: { type: Array, required: true },
})

const hover = ref(null)
const tone = computed(() => {
  if (!props.trend) return 'flat'
  const good = props.lowerIsBetter ? props.trend < 0 : props.trend > 0
  return good ? 'up' : 'down'
})
const trendLabel = computed(() => {
  const amount = Math.abs(props.trend)
  const text = Number.isInteger(amount) ? String(amount) : amount.toFixed(1)
  return `${text}%`
})
const barLabel = computed(() => props.segments
  .map((segment) => `${segment.label} ${segment.value.toLocaleString()}`)
  .join(', '))

function widthOf(segment) {
  if (!props.total) return '0%'
  return `${Math.max(0, Math.min(100, (segment.value / props.total) * 100))}%`
}

function dim(id) {
  return !hover.value || hover.value === id ? 1 : 0.4
}
</script>

<style scoped>
.stat {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
  padding: var(--dt-space-500);
  min-width: 0;
}

.headline {
  display: flex;
  align-items: baseline;
  flex-wrap: nowrap;
  gap: var(--dt-space-200);
  min-height: 32px;
}

.hero {
  margin: 0;
  font: var(--dt-typography-headline-xl);
  font-variant-numeric: tabular-nums;
}

.trend {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-200);
  font-size: var(--dt-font-size-100);
  font-variant-numeric: tabular-nums;
}

.trend.up { color: var(--dt-color-foreground-success); }
.trend.down { color: var(--dt-color-foreground-critical); }
.trend.flat { color: var(--dt-color-foreground-tertiary); }
.flip { transform: rotate(180deg); }

.meta {
  display: flex;
  flex-direction: column;
  margin: 0;
  color: var(--dt-color-foreground-tertiary);
  font-size: var(--dt-font-size-100);
  line-height: 1.4;
}

.line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bar {
  display: flex;
  width: 100%;
  height: 14px;
  overflow: hidden;
  border-radius: var(--dt-size-radius-300);
  background: var(--dt-color-border-subtle);
  animation: reveal 350ms cubic-bezier(0.33, 1, 0.68, 1) both;
}

.seg {
  height: 100%;
  flex-shrink: 0;
  transition: opacity 0.15s ease;
}

.seg + .seg { box-shadow: -1.5px 0 0 0 var(--dt-color-surface-primary); }

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-200) var(--dt-space-400);
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-200);
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-100);
}

.legend-item i {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex: none;
}

.legend-item strong {
  color: var(--dt-color-foreground-primary);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

@keyframes reveal {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0); }
}

@media (prefers-reduced-motion: reduce) {
  .bar { animation: none; }
}
</style>
