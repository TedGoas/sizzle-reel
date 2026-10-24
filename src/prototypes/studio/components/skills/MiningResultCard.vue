<template>
  <div style="border: 1px solid #e0e0e0; border-left: 3px solid #9358ff; border-radius: 8px; padding: 20px;">
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
      <div style="flex: 1;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <h3 style="font-size: 18px; margin: 0;">{{ skill.name }}</h3>
          <dt-badge type="success" text="High Confidence" />
        </div>
        <p style="margin: 0; color: #666;">{{ skill.description }}</p>
      </div>
    </div>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #666;">Found in <strong>{{ skill.occurrences }} conversations</strong></p>
    <dt-button importance="primary" @click="$emit('create', skill)">Create New Skill</dt-button>
  </div>
</template>

<script setup>
import { DtButton, DtBadge } from '../ui'

defineProps({
  skill: {
    type: Object,
    required: true
  }
})

defineEmits(['create'])
</script>
