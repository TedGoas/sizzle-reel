<template>
  <div style="padding: 24px;">
    <dt-button importance="clear" kind="muted" @click="state.setCurrentPage('agent-detail')" style="margin-bottom: 16px;">
      <dt-icon name="arrow-left" size="200" />
      Back to Agent
    </dt-button>

    <h1 style="font-size: 32px; margin: 0 0 8px 0;">Skill Mining Results</h1>
    <p style="color: #666; margin: 0 0 24px 0;">AI analyzed 50 transcripts and found 3 skill opportunities</p>

    <div style="display: flex; flex-direction: column; gap: 16px;">
      <mining-result-card
        v-for="skill in miningResults"
        :key="skill.id"
        :skill="skill"
        @create="createSkill"
      />
    </div>
  </div>
</template>

<script setup>
import { DtButton, DtIcon } from '../components/ui'
import MiningResultCard from '../components/skills/MiningResultCard.vue'
import { miningResults } from '../config/skillsData.js'
import { state } from '../state.js'
import { useNavigation } from '../composables/useNavigation.js'

const { createSkill } = useNavigation()
</script>
