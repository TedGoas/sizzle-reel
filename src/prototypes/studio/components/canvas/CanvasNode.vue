<template>
  <div
    class="canvas-node"
    :class="`canvas-node-${type}`"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
  >
    <div class="node-header">
      <div>
        <dt-icon :name="iconName" size="300" />
        <span class="node-type">{{ typeName }}</span>
      </div>
      <button class="node-menu-button">
        <dt-icon name="more-vertical" size="200" />
      </button>
    </div>
    <div class="node-content">
      <div class="node-title">{{ title }}</div>
      <div class="node-description">
        {{ description }}
      </div>
      <div v-if="badge" class="node-badge">
        <dt-icon :name="badge.icon" size="100" />
        <span>{{ badge.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DtIcon } from '../ui'
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['agent', 'skill', 'workflow'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  position: {
    type: Object,
    required: true,
    validator: (value) => value.x !== undefined && value.y !== undefined
  },
  badge: {
    type: Object,
    default: null
  }
})

const iconName = computed(() => {
  const icons = {
    agent: 'default-ai-agent-fab',
    skill: 'dialpad-star-mark',
    workflow: 'branch'
  }
  return icons[props.type]
})

const typeName = computed(() => {
  const names = {
    agent: 'AI Agent',
    skill: 'Skill',
    workflow: 'Workflow'
  }
  return names[props.type]
})
</script>
