<template>
  <div class="agent-detail-container">
    <!-- Fixed Header Section -->
    <div class="agent-detail-header">
      <!-- Back Button -->
      <dt-button importance="clear" kind="muted" size="xs" icon-position="left" @click="state.setCurrentPage('agent-list')" style="margin-bottom: 4px;">
        <template #icon><dt-icon name="arrow-left" size="200" /></template>
        Back
      </dt-button>

      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <h1 style="font-size: 24px; font-weight: 600; margin: 0;">{{ state.selectedAgent.name }}</h1>
          <dt-badge type="ai" text="Agentic" />
          <dt-badge type="success" text="Published" />
        </div>
        <div v-if="state.currentAgentTab !== 'testing' && state.currentAgentTab !== 'skills-workflows' && state.currentAgentTab !== 'conversation-history'" style="display: flex; gap: 12px;">
          <dt-button importance="outlined" ref="publishButtonRef" @click="handlePublishClick">Publish</dt-button>
          <dt-button importance="primary">Try now</dt-button>
        </div>
      </div>
    </div>

    <!-- Publish Popover -->
    <publish-popover
      :is-open="showPublishPopover"
      :agent-name="state.selectedAgent.name"
      :trigger-element="publishButtonElement"
      @close="showPublishPopover = false"
      @publish="handlePublishFromPopover"
    />

    <!-- Deployment Modal -->
    <deployment-modal
      :is-open="showDeploymentModal"
      :agent-name="state.selectedAgent.name"
      @close="showDeploymentModal = false"
      @published="handlePublished"
    />

    <!-- Main Content Area with Sidebar -->
    <div class="agent-detail-body">
      <!-- Left Sidebar Navigation -->
      <div class="agent-detail-sidebar">
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <button
            v-for="tab in agentTabs"
            :key="tab.id"
            @click="state.setCurrentAgentTab(tab.id)"
            :style="{
              padding: '8px 12px',
              border: 'none',
              background: state.currentAgentTab === tab.id ? '#f0f0f0' : 'transparent',
              color: '#333',
              textAlign: 'left',
              cursor: 'pointer',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: state.currentAgentTab === tab.id ? '500' : '400'
            }"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="agent-detail-main-content">
        <component :is="currentTabComponent" @mining-cancelled="$emit('mining-cancelled')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { DtButton, DtIcon, DtBadge } from '../components/ui'
import OverviewTab from './agent-detail-tabs/OverviewTab.vue'
import AgentEditorTab from './agent-detail-tabs/AgentEditorTab.vue'
import TestingTab from './agent-detail-tabs/TestingTab.vue'
import AnalyticsTab from './agent-detail-tabs/AnalyticsTab.vue'
import ConversationHistoryTab from './agent-detail-tabs/ConversationHistoryTab.vue'
import SkillsWorkflowsTab from './agent-detail-tabs/SkillsWorkflowsTab.vue'
import SettingsTab from './agent-detail-tabs/SettingsTab.vue'
import DeploymentModal from '../components/modals/DeploymentModal.vue'
import PublishPopover from '../components/popovers/PublishPopover.vue'
import { state } from '../state.js'
import { agentTabs } from '../config/tabsConfig.js'

// Publish popover state
const showPublishPopover = ref(false)
const publishButtonRef = ref(null)
const publishButtonElement = ref(null)

// Deployment modal state
const showDeploymentModal = ref(false)

const tabComponents = {
  'overview': OverviewTab,
  'agent-editor': AgentEditorTab,
  'testing': TestingTab,
  'analytics': AnalyticsTab,
  'conversation-history': ConversationHistoryTab,
  'skills-workflows': SkillsWorkflowsTab,
  'settings': SettingsTab
}

const currentTabComponent = computed(() => {
  return tabComponents[state.currentAgentTab] || OverviewTab
})

function handlePublishClick() {
  // Get the button element for positioning
  const btnEl = publishButtonRef.value?.$el || publishButtonRef.value;
  publishButtonElement.value = btnEl;
  showPublishPopover.value = true;
}

function handlePublishFromPopover() {
  // Close popover and open modal
  showPublishPopover.value = false;
  showDeploymentModal.value = true;
}

function handlePublished(deploymentInfo) {
  // Success is now shown in the modal itself
  // Modal will be closed by user clicking "Done" button
}
</script>
