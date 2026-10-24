<template>
  <div class="agent-table-container">
    <table class="agent-table">
      <thead>
        <tr class="table-header">
          <th class="table-header-cell">Name</th>
          <th class="table-header-cell">Groups</th>
          <th class="table-header-cell">Resolution rate</th>
          <th class="table-header-cell">Usage</th>
          <th class="table-header-cell">Type</th>
          <th class="table-header-cell">Status</th>
          <th class="table-header-cell actions-header">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="agent in agents"
          :key="agent.id"
          class="table-row"
          @click="$emit('agent-selected', agent)"
        >
          <td class="table-cell">
            <div class="agent-name">{{ agent.name }}</div>
            <div class="agent-locale">{{ agent.locale }}</div>
          </td>
          <td class="table-cell">
            <div class="group-primary">{{ agent.group }}</div>
            <div v-if="agent.additionalGroups" class="group-additional">{{ agent.additionalGroups }}</div>
          </td>
          <td class="table-cell table-cell-text">{{ agent.resolutionRate }}</td>
          <td class="table-cell">
            <div class="usage-container">
              <span class="usage-value">{{ agent.usage }}</span>
              <svg width="60" height="24" class="sparkline">
                <!-- Filled area underneath -->
                <polygon :points="getAreaPoints(agent.sparkline)" fill="#C5DBEF" opacity="0.5" />
                <!-- Line on top -->
                <polyline :points="agent.sparkline" fill="none" stroke="#5B9BD5" stroke-width="2" />
              </svg>
            </div>
          </td>
          <td class="table-cell table-cell-text">{{ agent.type }}</td>
          <td class="table-cell table-cell-text">{{ agent.status }}</td>
          <td class="table-cell actions-cell">
            <div class="actions-container">
              <button class="icon-button" title="Edit">
                <dt-icon name="edit" size="300" class="d-fc-muted" />
              </button>
              <button class="icon-button" title="Play">
                <dt-icon name="play" size="300" class="d-fc-muted" />
              </button>
              <button class="icon-button" title="More">
                <dt-icon name="more-vertical" size="300" class="d-fc-muted" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { DtIcon } from '../ui'

defineProps({
  agents: {
    type: Array,
    required: true
  }
})

defineEmits(['agent-selected'])

// Convert sparkline points to area polygon points
function getAreaPoints(sparkline) {
  // Parse the sparkline points to get the last x coordinate
  const points = sparkline.trim().split(' ')
  const lastPoint = points[points.length - 1].split(',')
  const lastX = lastPoint[0]

  // Create a closed polygon by adding bottom corners
  return `${sparkline} ${lastX},24 0,24`
}
</script>

<style scoped>
.agent-table-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.agent-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  background: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
}

.table-header-cell {
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 13px;
  color: #333;
  border-right: 1px solid #e0e0e0;
}

.table-header-cell:last-child {
  border-right: none;
}

.actions-header {
  text-align: right;
}

.table-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background: #fafafa;
}

.table-cell {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
}

.table-cell:last-child {
  border-right: none;
}

.table-cell-text {
  font-size: 14px;
  color: #333;
}

.agent-name {
  font-weight: 500;
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
}

.agent-locale {
  font-size: 12px;
  color: #999;
}

.group-primary {
  font-size: 14px;
  color: #333;
}

.group-additional {
  font-size: 12px;
  color: #999;
}

.usage-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.usage-value {
  font-size: 14px;
  color: #333;
}

.sparkline {
  display: block;
}

.actions-cell {
  border-right: none;
}

.actions-container {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.icon-button:hover {
  background-color: #f0f0f0;
}
</style>
