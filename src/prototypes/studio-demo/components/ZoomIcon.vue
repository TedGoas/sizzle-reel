<template>
  <svg
    class="zoom-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
  >
    <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#zoom-icon-gradient)" />
    <path d="M7 8.563a.625.625 0 0 0-.625.624v4.027c0 1.036.84 1.875 1.875 1.875h5.807c.345 0 .625-.28.625-.625v-4.027c0-1.035-.84-1.874-1.875-1.874H7Zm8.495 1.622a.625.625 0 0 0-.22.476v2.627c0 .183.08.357.22.476l1.568 1.337a.625.625 0 0 0 1.03-.476V9.323a.625.625 0 0 0-1.03-.475l-1.568 1.337Z" fill="#fff" />
    <defs>
      <linearGradient id="zoom-icon-gradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop stop-color="#4594FF" />
        <stop offset=".604" stop-color="#357CFC" />
        <stop offset="1" stop-color="#2C6FFA" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script setup>
defineProps({
  size: { type: Number, default: 16 },
})
</script>
