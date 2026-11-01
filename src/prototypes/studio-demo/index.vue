<template>
  <div class="studio-demo">
    <div ref="stageRef" class="studio-demo-stage">
      <div class="studio-demo-scene" :class="scene === 'list' ? 'is-active' : 'is-hidden'">
        <AppShell>
          <AgentListScreen />
        </AppShell>
      </div>
      <div class="studio-demo-scene" :class="scene === 'creation' ? 'is-active' : 'is-hidden'">
        <AgentCreationScreen />
      </div>
      <div
        v-show="ready"
        class="studio-demo-cursor"
        :class="{ 'is-clicking': clicking }"
        :style="{ transform: `translate(${cursorX}px, ${cursorY}px)` }"
        aria-hidden="true"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
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
const { playing, ready, scene, cursorX, cursorY, clicking, toggle, seekBy } = useDirector(stageRef)
</script>
