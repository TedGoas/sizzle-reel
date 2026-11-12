<template>
  <div class="studio-demo">
    <AppShell v-if="scene === 'list'">
      <AgentListScreen :agents="agentList" @create="scene = 'creation'" @open="openAgent" @edit="editAgent" />
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
      @saved="onSaved"
    />
    <AgentCreationScreen v-else key="create" @back="scene = 'list'" @saved="onSaved" />
    <Teleport to="body">
      <Transition name="toast">
        <SuccessToast v-if="toastMessage" :key="toastKey" :message="toastMessage" @close="toastMessage = ''" />
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppShell from './components/AppShell.vue'
import AgentListScreen from './components/AgentListScreen.vue'
import AgentCreationScreen from './components/AgentCreationScreen.vue'
import AgentDetailScreen from './components/AgentDetailScreen.vue'
import SuccessToast from './components/SuccessToast.vue'
import { agents, receptionistAgent } from './agents.js'
import './studio-demo.css'
import './sections.css'

const scene = ref('list')
const selectedAgent = ref(null)
const section = ref('overview')
const agentList = ref([...agents])
const toastMessage = ref('')
const toastKey = ref(0)

function showToast(message) {
  toastKey.value += 1
  toastMessage.value = message
}

// Editor Save: Create adds the new agent to the list; Edit returns to that agent. Both land on Overview.
function onSaved({ name, published }) {
  if (scene.value === 'editor' && selectedAgent.value) {
    if (published) selectedAgent.value = { ...selectedAgent.value, status: 'Published' }
    agentList.value = agentList.value.map((agent) => (agent.id === selectedAgent.value.id ? selectedAgent.value : agent))
  } else {
    const saved = { ...receptionistAgent, name, status: published ? 'Published' : 'Draft' }
    agentList.value = [saved, ...agentList.value.filter((agent) => agent.id !== saved.id)]
    selectedAgent.value = saved
  }
  section.value = 'overview'
  scene.value = 'agent'
  showToast(`${name} is saved.`)
}

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
