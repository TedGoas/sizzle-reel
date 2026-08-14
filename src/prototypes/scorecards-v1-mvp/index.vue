<template>
  <div class="scorecards-app">
    <LeftBar :activeItem="activeItem" @icon-click="handleIconClick" />
    <main class="scorecards-content">
      <BuilderView v-if="activeView === 'builder'" />
      <CallReviewView v-else-if="activeView === 'call-review'" />
      <AnalyticsView v-else-if="activeView === 'analytics'" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LeftBar from '@/components/LeftBar.vue'
import BuilderView from './components/BuilderView.vue'
import CallReviewView from './components/CallReviewView.vue'
import AnalyticsView from './components/AnalyticsView.vue'

const activeView = ref('builder')

const activeItem = computed(() => {
  switch (activeView.value) {
    case 'builder': return 'settings'
    case 'call-review': return 'history'
    case 'analytics': return 'trending-up'
    default: return 'settings'
  }
})

function handleIconClick(iconName) {
  switch (iconName) {
    case 'settings': activeView.value = 'builder'; break
    case 'history': activeView.value = 'call-review'; break
    case 'trending-up': activeView.value = 'analytics'; break
  }
}
</script>

<style scoped>
.scorecards-app {
  display: grid;
  grid-template-columns: 50px 1fr;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: var(--dt-font-family-body);
}

.scorecards-content {
  overflow: hidden;
  background: white;
}
</style>
