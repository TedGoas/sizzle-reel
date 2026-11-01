<template>
  <div
    class="agentic-studio-root"
    :class="{ 'builder-fullscreen-mode': state.isFullScreenEditor }"
  >
    <div class="main-content-wrapper">
      <component :is="currentView" @mining-cancelled="handleMiningCancelled" />
    </div>
  </div>

  <skill-mining-drawer
    :visible="state.showMiningDrawer"
    @close="state.showMiningDrawer = false"
    @mining-started="handleMiningStarted"
  />

  <skill-mining-modal
    :visible="state.showMiningDetailsModal"
    @close="state.showMiningDetailsModal = false"
  />

  <skill-opportunity-drawer
    :visible="state.showOpportunityDrawer"
    :opportunity="state.selectedOpportunity"
    @close="state.showOpportunityDrawer = false"
    @create-skill="handleCreateSkill"
  />

  <toast-notification v-model:show="showToast" kind="success" :timeout="5000">
    <div style="font-weight: 600; margin-bottom: 4px;">Skill search started</div>
    <div style="font-size: 14px;">We'll email you when it's done</div>
  </toast-notification>

  <toast-notification
    v-model:show="showResultsToast"
    title="Skill mining complete"
    kind="success"
    :timeout="10000"
  >
    <template #action>
      <dt-button
        size="sm"
        importance="outlined"
        kind="muted"
        @click="handleViewMiningResults"
      >
        View details
      </dt-button>
    </template>
  </toast-notification>

  <toast-notification
    v-model:show="showCancelledToast"
    title="Skill mining cancelled"
    kind="base"
    :timeout="5000"
  />

  <toast-notification v-model:show="state.showPublishedToast" kind="success" :timeout="0">
    <div style="font-weight: 600; margin-bottom: 4px;">Agent successfully published</div>
  </toast-notification>

  <toast-notification v-model:show="state.showTestCompleteToast" kind="success" :timeout="5000">
    <div style="font-weight: 600; margin-bottom: 4px;">Testing complete</div>
    <div style="font-size: 14px;">All scenarios have been tested successfully</div>
    <template #action>
      <dt-button
        size="sm"
        importance="outlined"
        kind="muted"
        @click="handleViewTestResults"
        style="white-space: nowrap;"
      >
        View results
      </dt-button>
    </template>
  </toast-notification>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { DtButton } from './components/ui'
import { state } from './state.js'
import ToastNotification from './components/ToastNotification.vue'
import AgentCreation from './views/AgentCreation.vue'
import AgentList from './views/AgentList.vue'
import AgentDetail from './views/AgentDetail.vue'
import TestResultDetail from './views/TestResultDetail.vue'
import SkillDetailPage from './views/SkillDetailPage.vue'
import SkillMiningDrawer from './components/drawers/SkillMiningDrawer.vue'
import SkillOpportunityDrawer from './components/drawers/SkillOpportunityDrawer.vue'
import SkillMiningModal from './components/modals/SkillMiningModal.vue'

const showToast = ref(false)
const showResultsToast = ref(false)
const showCancelledToast = ref(false)

const handleMiningStarted = () => {
  showToast.value = true
}

const handleMiningCancelled = () => {
  showCancelledToast.value = true
}

const handleViewMiningResults = () => {
  state.hasMiningResults = true
  showResultsToast.value = false
}

const handleViewTestResults = () => {
  if (state.latestTestResultId) {
    const latestResult = state.testResultsList.find(r => r.id === state.latestTestResultId)
    if (latestResult) {
      state.selectTestResult(latestResult)
    }
  }
  state.showTestCompleteToast = false
}

watch(() => state.miningStatus, (newStatus, oldStatus) => {
  if (oldStatus === 'in-progress' && newStatus === 'complete') {
    showResultsToast.value = true
  }
})

const handleCreateSkill = (opportunity) => {
  state.showOpportunityDrawer = false

  if (state.currentPage !== 'agent-detail') {
    if (!state.selectedAgent) {
      const agents = [{ id: 1, name: 'Daarty', status: 'published', channel: 'voice', description: 'DAART Therapy Studio offers personalized mental health care through innovative, evidence-based therapeutic approaches.' }]
      state.selectAgent(agents[0])
    }
  }

  state.setCurrentAgentTab('agent-editor')

  setTimeout(() => {
    state.createSkillFromMining = opportunity
  }, 200)
}

const viewMap = {
  'agent-creation': AgentCreation,
  'agent-list': AgentList,
  'agent-detail': AgentDetail,
  'test-result-detail': TestResultDetail,
  'skill-detail': SkillDetailPage,
}

const currentView = computed(() => {
  if (state.currentPage === 'agent-detail' && state.provingGroundView === 'detail' && state.selectedTestResult) {
    return TestResultDetail
  }

  return viewMap[state.currentPage] || AgentList
})
</script>

<style>
@import './styles/animations.css';
@import './styles/agent-detail.css';
@import './styles/canvas.css';
@import './styles/timeline.css';
@import './styles/drawer.css';
</style>
