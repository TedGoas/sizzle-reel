<template>
  <BaseIcon :name="resolvedName" :size="pixelSize" :class="$attrs.class" />
</template>

<script setup>
import { computed } from 'vue'
import BaseIcon from '@/components/icons/DtIcon.vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [String, Number], default: 200 },
})

const SIZE_MAP = {
  100: 12,
  200: 16,
  300: 20,
  400: 24,
  500: 32,
  600: 36,
  700: 42,
  800: 48,
}

const ALIASES = {
  loading: 'refresh',
  loader: 'refresh',
  sparkles: 'sparkle',
  'sparkle-filled': 'sparkle',
  'ai-sparkle': 'sparkle',
  'default-ai-agent-fab': 'dialpad-sparkle',
  'dialpad-star-mark': 'dialpad-sparkle',
  phone: 'dp-phone',
  'message-circle': 'message',
  'chat-two': 'message',
  'circle-x': 'close',
  'external-link': 'share-2',
  'grip-vertical': 'more-vertical',
  maximize: 'arrow-up',
  minimize: 'arrow-down',
  stop: 'stop-circle',
  'stop-filled': 'stop-circle',
  add: 'plus',
  edit: 'ai-write',
  info: 'help-circle',
  brain: 'lightbulb',
  zap: 'sparkle',
  'lightning-bolt': 'sparkle',
  flame: 'alert-triangle',
  tools: 'settings',
  wrench: 'settings',
  workflow: 'layout-template',
  scan: 'search',
  cloud: 'inbox',
  lock: 'token',
  quote: 'message',
  code: 'hash',
  link: 'share-2',
  'link-2': 'share-2',
  clock: 'history',
  'agent-assist': 'headphones',
  'test-tube': 'flask',
  beaker: 'flask',
  flask: 'token',
  'shield-alert': 'alert-triangle',
  'check-circle-filled': 'check-circle',
  'list-ordered': 'list-bullet',
  'align-left': 'list-bullet',
  'chevrons-up-down': 'chevrons-down-up',
  'chevron-left': 'arrow-left',
  'chevron-right': 'arrow-right',
  bold: 'hash',
  italic: 'hash',
  underline: 'hash',
}

const pixelSize = computed(() => {
  if (typeof props.size === 'number' && props.size > 50) return props.size
  const key = String(props.size)
  if (SIZE_MAP[key] != null) return SIZE_MAP[key]
  const n = Number(props.size)
  return Number.isFinite(n) ? n : 16
})

const resolvedName = computed(() => ALIASES[props.name] || props.name)
</script>
