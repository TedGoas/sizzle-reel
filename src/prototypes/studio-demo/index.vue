<template>
  <div class="studio-demo">
    <AppShell v-if="scene === 'list'">
      <AgentListScreen @create="scene = 'creation'" @open="openAgent" @edit="editAgent" />
    </AppShell>
    <AppShell v-else-if="scene === 'agent' && selectedAgent">
      <AgentDetailScreen
        :agent="selectedAgent"
        :section="section"
        @back="scene = 'list'"
        @section="section = $event"
        @edit="scene = 'editor'"
      />
    </AppShell>
    <AgentCreationScreen
      v-else-if="scene === 'editor' && selectedAgent"
      key="editor"
      start-on-canvas
      :initial-name="selectedAgent.name"
      @back="backToOverview"
      @test="openTesting"
    />
    <AgentCreationScreen v-else key="create" @back="scene = 'list'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppShell from './components/AppShell.vue'
import AgentListScreen from './components/AgentListScreen.vue'
import AgentCreationScreen from './components/AgentCreationScreen.vue'
import AgentDetailScreen from './components/AgentDetailScreen.vue'
import './studio-demo.css'
import './sections.css'

const scene = ref('list')
const selectedAgent = ref(null)
const section = ref('overview')

function openAgent(agent) {
  selectedAgent.value = agent
  section.value = 'overview'
  scene.value = 'agent'
}

function editAgent(agent) {
  selectedAgent.value = agent
  section.value = 'overview'
  scene.value = 'editor'
}

function backToOverview() {
  section.value = 'overview'
  scene.value = 'agent'
}

function openTesting() {
  section.value = 'testing'
  scene.value = 'agent'
}
</script>
