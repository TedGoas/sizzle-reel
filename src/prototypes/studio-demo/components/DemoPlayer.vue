<template>
  <div class="player">
    <button type="button" aria-label="Back 15 seconds" @click="$emit('back')">
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <path d="M8.5 2.5 4 7l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span>15</span>
    </button>
    <button type="button" :aria-label="playing ? 'Pause' : 'Play'" @click="$emit('toggle')">
      <svg v-if="playing" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="3.5" y="2.5" width="3" height="11" rx="0.6" fill="currentColor" />
        <rect x="9.5" y="2.5" width="3" height="11" rx="0.6" fill="currentColor" />
      </svg>
      <svg v-else width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4.2 2.6c0-.7.8-1.1 1.4-.7l8 5.4c.5.4.5 1.1 0 1.5l-8 5.4c-.6.4-1.4 0-1.4-.8V2.6Z" fill="currentColor" />
      </svg>
    </button>
    <button type="button" aria-label="Forward 15 seconds" @click="$emit('forward')">
      <span>15</span>
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <path d="M5.5 2.5 10 7l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  playing: { type: Boolean, default: false },
})

defineEmits(['toggle', 'back', 'forward'])
</script>

<style scoped>
.player {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 36px;
  flex-shrink: 0;
  background: #1c1c1c;
  color: #fff;
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
  height: 28px;
  padding: 0 6px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
}

button:hover {
  background: rgba(255, 255, 255, 0.12);
}
</style>
