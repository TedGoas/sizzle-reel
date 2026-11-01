<template>
  <div class="studio-demo">
    <AppShell v-if="scene === 'list'">
      <AgentListScreen @create="scene = 'creation'" />
    </AppShell>
    <AgentCreationScreen v-else @back="scene = 'list'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppShell from './components/AppShell.vue'
import AgentListScreen from './components/AgentListScreen.vue'
import AgentCreationScreen from './components/AgentCreationScreen.vue'
import './studio-demo.css'

const scene = ref('list')
</script>
