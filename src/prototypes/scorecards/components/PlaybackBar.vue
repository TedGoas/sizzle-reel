<template>
  <div class="playback-bar">
    <button class="playback-icon-btn" aria-label="Play">
      <Play :size="16" />
    </button>
    <div class="playback-tray-wrapper">
      <div class="playback-tray">
        <div
          v-for="(seg, i) in segments"
          :key="i"
          class="playback-segment"
          :style="{ background: seg.color, flex: seg.width }"
        ></div>
      </div>
      <span class="playback-time">0:00 / 8:10</span>
    </div>
    <div class="playback-controls">
      <button class="playback-icon-btn" aria-label="Rewind 15 seconds">
        <RotateCcw :size="16" />
      </button>
      <button class="playback-icon-btn" aria-label="Skip 15 seconds">
        <RotateCw :size="16" />
      </button>
      <button class="playback-icon-btn" aria-label="Playback speed">
        <Gauge :size="16" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { playbackSegments } from '../data/callData.js'
import { Play, RotateCcw, RotateCw, Gauge } from '@lucide/vue'

const segments = playbackSegments
</script>

<style scoped>
.playback-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 16px 0;
  height: 66px;
  box-sizing: border-box;
}

.playback-icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 50%;
  color: #737373;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
}

.playback-icon-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #262626;
}

.playback-tray-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
  padding-right: 4px;
}

.playback-tray {
  display: flex;
  height: 8px;
  border-radius: 8px;
  overflow: hidden;
  flex: 1;
  background: #d4d4d4;
}

.playback-segment {
  min-width: 4px;
}

.playback-time {
  font-size: 12px;
  color: #262626;
  white-space: nowrap;
  flex-shrink: 0;
  line-height: 14px;
  letter-spacing: -0.1px;
}

.playback-controls {
  display: flex;
  flex-shrink: 0;
}
</style>
