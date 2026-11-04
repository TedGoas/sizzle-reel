<template>
  <div class="agent-list">
    <div class="list-header">
      <div>
        <h1>AI Agents</h1>
        <p>
          Create and customize virtual assistants that can handle customer questions and automate routine tasks.
          <a href="#" @click.prevent>Need help?</a>
        </p>
      </div>
      <button type="button" class="btn btn--primary" @click="emit('create')">
        Create AI Agent
      </button>
    </div>

    <div class="filters">
      <div class="search-field">
        <Icon name="search" :size="16" />
        <span>AI Agents</span>
      </div>
      <button type="button" class="btn btn--outlined">
        Published (1)
        <Icon name="chevron-down" :size="12" />
      </button>
      <button type="button" class="btn btn--outlined">
        All types
        <Icon name="chevron-down" :size="12" />
      </button>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Groups</th>
            <th>Resolution rate</th>
            <th>Usage</th>
            <th>Type</th>
            <th>Status</th>
            <th class="actions-head">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="agent in agents" :key="agent.id" class="agent-row" @click="emit('open', agent)">
            <td>
              <div class="agent-name">{{ agent.name }}</div>
              <div class="agent-meta">{{ agent.locale }}</div>
            </td>
            <td>
              <div>{{ agent.group }}</div>
              <div v-if="agent.additionalGroups" class="agent-meta">{{ agent.additionalGroups }}</div>
            </td>
            <td>{{ agent.resolutionRate }}</td>
            <td>
              <div class="usage">
                <span>{{ agent.usage }}</span>
                <svg width="60" height="24" aria-hidden="true">
                  <polygon :points="areaPoints(agent.sparkline)" fill="#C5DBEF" opacity="0.5" />
                  <polyline :points="agent.sparkline" fill="none" stroke="#5B9BD5" stroke-width="2" />
                </svg>
              </div>
            </td>
            <td>{{ agent.type }}</td>
            <td>{{ agent.status }}</td>
            <td @click.stop>
              <div class="row-actions">
                <button type="button" class="icon-btn" title="Edit" aria-label="Edit agent" @click="emit('edit', agent)">
                  <Icon name="pencil" :size="16" />
                </button>
                <span class="icon-btn" title="Play"><Icon name="play" :size="16" /></span>
                <span class="icon-btn" title="More"><Icon name="more-vertical" :size="16" /></span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import Icon from './Icon.vue'
import { agents } from '../agents.js'

const emit = defineEmits(['create', 'open', 'edit'])

function areaPoints(sparkline) {
  const points = sparkline.trim().split(' ')
  const lastX = points[points.length - 1].split(',')[0]
  return `${sparkline} ${lastX},24 0,24`
}
</script>

<style scoped>
.agent-list {
  padding: 24px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

h1 {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 8px;
  color: #1a1a1a;
}

p {
  margin: 0;
  max-width: 640px;
  color: #666;
  font-size: 14px;
  line-height: 1.45;
}

a {
  color: #9358ff;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-field {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 300px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid hsl(0 0% 11% / 0.17);
  border-radius: 6px;
  color: #808080;
  font-size: 15px;
  box-sizing: border-box;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 32px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid transparent;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  cursor: default;
}

.btn--primary {
  background: #7c52ff;
  color: #fff;
  cursor: pointer;
}

.btn--primary:active {
  filter: brightness(0.92);
}

.btn--outlined {
  background: #fff;
  color: #1a1a1a;
  border-color: hsl(0 0% 11% / 0.17);
  font-weight: 500;
}

.table-wrap {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 13px;
  color: #333;
  background: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
}

th:last-child,
td:last-child {
  border-right: none;
}

.actions-head {
  text-align: right;
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  font-size: 14px;
  color: #333;
  vertical-align: middle;
}

tr:last-child td {
  border-bottom: none;
}

.agent-name {
  font-weight: 500;
  margin-bottom: 2px;
}

.agent-meta {
  font-size: 12px;
  color: #999;
}

.usage {
  display: flex;
  align-items: center;
  gap: 12px;
}

.row-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  color: #808080;
}

.agent-row {
  cursor: pointer;
}

.agent-row:hover td {
  background: var(--dt-color-surface-secondary);
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font-family: inherit;
  cursor: pointer;
}
</style>
