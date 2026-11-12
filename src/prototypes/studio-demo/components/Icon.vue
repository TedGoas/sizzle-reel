<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="icon.viewBox"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    fill="currentColor"
  >
    <path
      v-for="(elem, i) in icon.elems"
      :key="i"
      :d="elem.d"
      :fill-rule="elem.fillRule"
      :clip-rule="elem.clipRule"
    />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import { icons } from '../icons.js'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 16 },
})

const icon = computed(() => icons[props.name] || { viewBox: '0 0 12 12', elems: [] })
</script>
