<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="icon.viewBox"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    fill="currentColor"
  >
    <template v-for="(elem, i) in icon.elems" :key="i">
      <circle
        v-if="elem.type === 'circle'"
        :cx="elem.cx"
        :cy="elem.cy"
        :r="elem.r"
        :fill="elem.fill || 'currentColor'"
        :stroke="elem.stroke"
        :stroke-width="elem.strokeWidth"
      />
      <path
        v-else
        :d="elem.d"
        :fill-rule="elem.fillRule"
        :clip-rule="elem.clipRule"
        :fill="elem.fill || 'currentColor'"
      />
    </template>
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import { icons } from './iconPaths.js'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 20 },
})

const icon = computed(() => {
  const found = icons[props.name]
  if (!found) {
    console.warn(`DtIcon: unknown icon "${props.name}"`)
    return { viewBox: '0 0 12 12', elems: [] }
  }
  return found
})
</script>
