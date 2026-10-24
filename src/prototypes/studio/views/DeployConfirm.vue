<template>
  <div style="padding: 24px; display: flex; align-items: center; justify-content: center; min-height: 600px;">
    <div style="max-width: 600px; text-align: center;">
      <div style="width: 120px; height: 120px; margin: 0 auto 24px; background: linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(46, 125, 50, 0.05) 100%); border: 3px solid var(--dt-color-foreground-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--dt-color-foreground-success);">
        <dt-icon name="check-circle-filled" size="800" />
      </div>

      <h1 style="font-size: 32px; margin: 0 0 8px 0;">Skill Deployed Successfully!</h1>
      <p style="color: #666; font-size: 18px; margin: 0 0 32px 0;">{{ state.workflowData.skillName }} has been deployed to {{ state.selectedAgent.name }}</p>

      <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: left;">
        <div style="margin-bottom: 16px;">
          <div style="font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 4px;">Skill Name</div>
          <div>{{ state.workflowData.skillName }}</div>
        </div>
        <div style="margin-bottom: 16px;">
          <div style="font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 4px;">Deployment Status</div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #4caf50;"></div>
            <span>Active immediately</span>
          </div>
        </div>
        <div>
          <div style="font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 4px;">Assigned to</div>
          <div>{{ state.selectedAgent.name }}</div>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, rgba(147, 88, 255, 0.05) 0%, rgba(147, 88, 255, 0.02) 100%); border: 2px solid #9358ff; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: left;">
        <h3 style="font-size: 18px; margin: 0 0 8px 0;">Test Your Skill</h3>
        <p style="margin: 0 0 16px 0; color: #666;">Run automated tests in Proving Ground to validate your skill's performance</p>
        <dt-button importance="primary" @click="state.setCurrentPage('proving-ground')" style="width: 100%;">Launch Proving Ground</dt-button>
      </div>

      <dt-button importance="outlined" @click="state.setCurrentPage('agent-detail')">Back to Agent Dashboard</dt-button>
    </div>
  </div>
</template>

<script setup>
import { DtButton, DtIcon } from '../components/ui'
import { state } from '../state.js'
</script>
