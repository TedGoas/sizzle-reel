<template>
  <div class="dt-stack" :style="stackStyle" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  direction: { type: String, default: 'column' }, // column | row
  gap: { type: [String, Number], default: '0' },
  align: { type: String, default: undefined },
  justify: { type: String, default: undefined },
  as: { type: String, default: 'div' },
})

const GAP_MAP = {
  0: '0',
  100: 'var(--dt-space-100)',
  200: 'var(--dt-space-200)',
  300: 'var(--dt-space-300)',
  350: 'var(--dt-space-350)',
  400: 'var(--dt-space-400)',
  450: 'var(--dt-space-450)',
  500: 'var(--dt-space-500)',
  550: 'var(--dt-space-550)',
  600: 'var(--dt-space-600)',
}

const stackStyle = computed(() => ({
  display: 'flex',
  flexDirection: props.direction === 'row' ? 'row' : 'column',
  gap: GAP_MAP[String(props.gap)] ?? (typeof props.gap === 'number' ? `${props.gap}px` : props.gap),
  alignItems: props.align,
  justifyContent: props.justify,
}))
</script>
