<template>
  <svg
    class="message-circle-text-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    role="img"
  >
    <path d="M3.086 17.509a2 2 0 00-.094-1.167 10 10 0 114.777 4.719 2 2 0 00-1.099-.092l-3.413.998a1 1 0 01-1.236-1.168z" />
    <path d="M8 12h9" />
    <path d="M8 16h5" />
    <path d="M8 8h7" />
  </svg>
</template>

<script setup>
defineProps({
  size: { type: Number, default: 16 },
})
</script>
