<template>
  <div style="padding: 24px;">
    <dt-button importance="clear" kind="muted" @click="state.setCurrentPage('deploy-confirm')" style="margin-bottom: 16px;">
      <dt-icon name="arrow-left" size="200" />
      Back
    </dt-button>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <h1 style="font-size: 32px; margin: 0 0 8px 0;">Proving Ground</h1>
        <p style="color: #666; margin: 0;">Test {{ state.workflowData.skillName }} across different scenarios</p>
      </div>
      <dt-button importance="primary" @click="runAllTests()">Run All Tests</dt-button>
    </div>

    <div style="display: flex; flex-direction: column; gap: 16px;">
      <test-scenario-card
        v-for="scenario in testScenarios"
        :key="scenario.id"
        :scenario="scenario"
        @run="runTest"
      />
    </div>

    <!-- Completion Message -->
    <div v-if="allTestsCompleted" style="margin-top: 24px; background: linear-gradient(135deg, rgba(46, 125, 50, 0.05) 0%, rgba(46, 125, 50, 0.02) 100%); border: 2px solid #4caf50; border-radius: 8px; padding: 20px;">
      <h3 style="font-size: 18px; margin: 0 0 8px 0;">✓ All Tests Complete!</h3>
      <p style="margin: 0 0 16px 0; color: #666;">Your skill is performing well and ready for production use</p>
      <div style="display: flex; gap: 12px;">
        <dt-button importance="outlined" @click="resetTests()">Run Tests Again</dt-button>
        <dt-button importance="primary" @click="state.setCurrentPage('agent-detail')">Return to Agent Dashboard</dt-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DtButton, DtIcon } from '../components/ui'
import TestScenarioCard from '../components/testing/TestScenarioCard.vue'
import { testScenarios as testScenariosData } from '../config/workflowData.js'
import { state } from '../state.js'
import { useTestRunner } from '../composables/useTestRunner.js'

// Convert to ref for reactivity
const testScenarios = ref(testScenariosData)

const { allTestsCompleted, runTest, runAllTests, resetTests } = useTestRunner(testScenarios)
</script>
