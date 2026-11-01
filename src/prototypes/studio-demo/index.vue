<template>
  <div class="studio-demo">
    <div ref="stageRef" class="studio-demo-stage">
      <div class="studio-demo-scene" :class="scene === 'list' ? 'is-active' : 'is-hidden'">
        <AppShell>
          <AgentListScreen />
        </AppShell>
      </div>
      <div class="studio-demo-scene" :class="scene === 'creation' ? 'is-active' : 'is-hidden'">
        <AgentCreationScreen
          :preview-index="previewIndex"
          :input-index="inputIndex"
          :phase="phase"
          :revealed-count="revealedCount"
          :shimmering="shimmering"
          :entering="entering"
        />
      </div>
      <div
        v-show="ready"
        class="studio-demo-cursor"
        :class="{ 'is-clicking': clicking, 'is-pointer': pointerCursor }"
        :style="{ transform: `translate(${cursorX}px, ${cursorY}px)` }"
        aria-hidden="true"
      >
        <svg v-if="pointerCursor" width="22" height="27" viewBox="16 2 48 58" fill="none" overflow="visible">
          <path
            d="M30 4.5c3.2 0 5.6 2.6 5.6 5.8v16.2c0 1 .8 1.6 1.6 1.2l.4-.4V18.2c0-3.4 2.6-6 6-6s6 2.6 6 6v12.4c0 .8.7 1.3 1.3 1l.3-.3V24c0-3 2.4-5.4 5.4-5.4s5.4 2.4 5.4 5.4v14.5c0 3.2-1 6.2-3.2 8.6-3.4 3.8-8.6 8.2-15.2 9.6-8.2 1.8-16.2-.4-20.6-5.6-3.6-4.2-5-9.4-3.4-14 .8-2.4 2.8-4.2 5.4-5l2.2-.6V10.3c0-3.2 2.6-5.8 5.8-5.8z"
            fill="white"
            stroke="#1A1A1A"
            stroke-width="2.6"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
        </svg>
        <svg v-else width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M5 3.5 21.5 15.2l-6.6 1.5 3.8 7.8-3.1 1.5-3.9-7.9L5 24.2V3.5Z"
            fill="white"
            stroke="#1A1A1A"
            stroke-width="1.25"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <DemoPlayer :playing="playing" @toggle="toggle" @back="seekBy(-15000)" @forward="seekBy(15000)" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppShell from './components/AppShell.vue'
import AgentListScreen from './components/AgentListScreen.vue'
import AgentCreationScreen from './components/AgentCreationScreen.vue'
import DemoPlayer from './components/DemoPlayer.vue'
import { useDirector } from './useDirector.js'
import './studio-demo.css'

const stageRef = ref(null)
const {
  playing,
  ready,
  scene,
  cursorX,
  cursorY,
  clicking,
  previewIndex,
  inputIndex,
  pointerCursor,
  phase,
  revealedCount,
  shimmering,
  entering,
  toggle,
  seekBy,
} = useDirector(stageRef)
</script>
