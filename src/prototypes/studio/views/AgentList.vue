<template>
  <div style="padding: 24px;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
      <div>
        <h1 style="font-size: 28px; font-weight: 600; margin: 0 0 8px 0;">AI Agents</h1>
        <p style="margin: 0; color: #666; font-size: 14px;">Create and customize virtual assistants that can handle customer questions and automate routine tasks. <a href="#" style="color: #9358ff; text-decoration: none;">Need help?</a></p>
      </div>
      <dt-button importance="primary" @click="state.startAgentCreation()">Create AI Agent</dt-button>
    </div>

    <!-- Filters -->
    <div style="display: flex; gap: 12px; margin-bottom: 16px;">
      <dt-input placeholder="AI Agents" style="flex: 1; max-width: 300px;">
        <template #leftIcon>
          <dt-icon name="search" size="300" />
        </template>
      </dt-input>
      <dt-button importance="outlined">Published (1) <dt-icon name="chevron-down" size="200" style="margin-left: 4px;" /></dt-button>
      <dt-button importance="outlined">All types <dt-icon name="chevron-down" size="200" style="margin-left: 4px;" /></dt-button>
    </div>

    <!-- Table -->
    <agent-table :agents="state.agentsList" @agent-selected="viewAgent" />
  </div>
</template>

<script setup>
import { DtButton, DtInput, DtIcon } from '../components/ui'
import AgentTable from '../components/tables/AgentTable.vue'
import { state } from '../state.js'
import { useNavigation } from '../composables/useNavigation.js'

const { viewAgent } = useNavigation()
</script>
