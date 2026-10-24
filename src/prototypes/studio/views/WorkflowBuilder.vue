<template>
  <div style="display: flex; height: 100%;">
    <!-- Sidebar -->
    <div style="width: 240px; background: #f5f5f5; padding: 24px; border-right: 1px solid #e0e0e0;">
      <dt-button importance="clear" kind="muted" @click="state.setCurrentPage('skill-mining')" style="margin-bottom: 24px; width: 100%;">
        <dt-icon name="arrow-left" size="200" />
        Back
      </dt-button>
      <h3 style="font-size: 14px; margin: 0 0 16px 0;">Workflow Builder</h3>
      <div v-for="(step, index) in builderSteps" :key="index" @click="state.currentBuilderStep = index"
           style="padding: 12px; margin-bottom: 8px; border-radius: 6px; cursor: pointer;"
           :style="{ background: state.currentBuilderStep === index ? '#9358ff' : 'white', color: state.currentBuilderStep === index ? 'white' : 'black' }">
        {{ index + 1 }}. {{ step }}
      </div>
    </div>

    <!-- Main Content -->
    <div style="flex: 1; padding: 24px; overflow-y: auto;">
      <!-- Step 1: Define Skill -->
      <div v-if="state.currentBuilderStep === 0">
        <h2 style="font-size: 24px; margin: 0 0 8px 0;">Define Your Skill</h2>
        <p style="color: #666; margin: 0 0 24px 0;">Give your skill a clear name and description</p>

        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Skill Name</label>
          <dt-input v-model="state.workflowData.skillName" placeholder="Enter skill name" />
        </div>

        <div style="margin-bottom: 24px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">Description</label>
          <textarea v-model="state.workflowData.skillDescription" placeholder="Describe what this skill does" rows="4" style="width: 100%; padding: 8px; border: 1px solid #e0e0e0; border-radius: 6px; font-family: inherit; font-size: 14px;"></textarea>
        </div>

        <dt-button importance="primary" @click="state.currentBuilderStep = 1">Next Step</dt-button>
      </div>

      <!-- Step 2: Build Workflow -->
      <div v-if="state.currentBuilderStep === 1">
        <h2 style="font-size: 24px; margin: 0 0 8px 0;">Build Your Workflow</h2>
        <p style="color: #666; margin: 0 0 24px 0;">Define the steps your agent will take</p>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          <workflow-step-card
            v-for="(step, index) in workflowSteps"
            :key="index"
            :step="step"
            style="margin-bottom: 16px;"
          />
        </div>

        <div style="display: flex; gap: 12px;">
          <dt-button importance="outlined" @click="state.currentBuilderStep = 0">Previous</dt-button>
          <dt-button importance="primary" @click="state.currentBuilderStep = 2">Next Step</dt-button>
        </div>
      </div>

      <!-- Step 3: Add Logic -->
      <div v-if="state.currentBuilderStep === 2">
        <h2 style="font-size: 24px; margin: 0 0 8px 0;">Add Logic Rules</h2>
        <p style="color: #666; margin: 0 0 24px 0;">Configure how your agent should handle different scenarios</p>

        <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <h3 style="font-size: 16px; margin: 0 0 16px 0;">Common Rules</h3>
          <div v-for="rule in logicRules" :key="rule.label" style="margin-bottom: 12px; display: flex; align-items: center; gap: 12px;">
            <input type="checkbox" v-model="rule.enabled" />
            <span>{{ rule.label }}</span>
          </div>
        </div>

        <div style="display: flex; gap: 12px;">
          <dt-button importance="outlined" @click="state.currentBuilderStep = 1">Previous</dt-button>
          <dt-button importance="primary" @click="state.currentBuilderStep = 3">Next Step</dt-button>
        </div>
      </div>

      <!-- Step 4: Test & Deploy -->
      <div v-if="state.currentBuilderStep === 3">
        <h2 style="font-size: 24px; margin: 0 0 8px 0;">Test & Deploy</h2>
        <p style="color: #666; margin: 0 0 24px 0;">Review your workflow and deploy it to your agent</p>

        <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <h3 style="font-size: 18px; margin: 0 0 8px 0;">{{ state.workflowData.skillName }}</h3>
          <p style="color: #666; margin: 0 0 16px 0;">{{ state.workflowData.skillDescription }}</p>

          <div style="margin-bottom: 16px;">
            <div style="font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 8px;">Workflow Steps</div>
            <ul style="margin: 0; padding-left: 20px;">
              <li v-for="step in workflowSteps" :key="step.title">{{ step.title }}</li>
            </ul>
          </div>

          <div>
            <div style="font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 8px;">Logic Rules</div>
            <ul style="margin: 0; padding-left: 20px;">
              <li v-for="rule in enabledLogicRules" :key="rule.label">{{ rule.label }}</li>
            </ul>
          </div>
        </div>

        <div style="display: flex; gap: 12px;">
          <dt-button importance="outlined" @click="state.currentBuilderStep = 2">Previous</dt-button>
          <dt-button importance="primary" @click="deploySkill()">Deploy Skill</dt-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { DtButton, DtInput, DtIcon } from '../components/ui'
import WorkflowStepCard from '../components/skills/WorkflowStepCard.vue'
import { builderSteps, workflowSteps, logicRules } from '../config/workflowData.js'
import { state } from '../state.js'
import { useNavigation } from '../composables/useNavigation.js'

const { deploySkill } = useNavigation()

const enabledLogicRules = computed(() => {
  return logicRules.filter(rule => rule.enabled)
})
</script>
