<template>
  <div class="agent-table-wrap">
    <table class="agent-table">
      <thead>
        <tr>
          <th class="agent-table-th agent-table-th--name">Teams & Groups</th>
          <th class="agent-table-th agent-table-th--grade">Average grade</th>
          <th class="agent-table-th agent-table-th--change">% change</th>
          <th class="agent-table-th agent-table-th--calls">Calls graded</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="agent in agentRows" :key="agent.name" class="agent-table-row">
          <td class="agent-table-td agent-table-td--name">
            <span class="agent-name-link">{{ agent.name }}</span>
          </td>
          <td class="agent-table-td agent-table-td--grade">{{ agent.avgGrade }}</td>
          <td class="agent-table-td agent-table-td--change">
            <span class="agent-trend" :class="`agent-trend--${agent.changeDir}`">
              <DtIcon
                :name="agent.changeDir === 'up' ? 'arrow-up' : 'arrow-down'"
                :size="16"
                class="agent-trend-arrow"
              />
              {{ agent.change }}
            </span>
          </td>
          <td class="agent-table-td agent-table-td--calls">
            <span class="agent-calls-link">{{ agent.callsGraded }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { agentRows } from '../data/analyticsData.js'
import DtIcon from '../../../components/icons/DtIcon.vue'
</script>

<style scoped>
.agent-table-wrap {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-space-400);
  overflow: hidden;
}

.agent-table {
  width: 100%;
  border-collapse: collapse;
}

.agent-table-th {
  padding: var(--dt-space-500);
  font: var(--dt-typography-label-sm-compact);
  color: var(--dt-color-foreground-primary);
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  border-bottom: 1px solid var(--dt-color-border-subtle);
  white-space: nowrap;
}

.agent-table-th--grade,
.agent-table-th--change,
.agent-table-th--calls {
  text-align: right;
}

.agent-table-th--grade { width: 160px; }
.agent-table-th--change { width: 110px; }
.agent-table-th--calls { width: 140px; }

.agent-table-td {
  padding: var(--dt-space-500);
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-primary);
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.agent-table-row:last-child .agent-table-td {
  border-bottom: none;
}

.agent-table-td--grade {
  text-align: right;
  font-weight: 600;
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

.agent-table-td--change,
.agent-table-td--calls {
  text-align: right;
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

.agent-name-link,
.agent-calls-link {
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: default;
}

.agent-trend {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--dt-space-200);
}

.agent-trend--up { color: var(--dt-color-foreground-success); }
.agent-trend--down { color: var(--dt-color-foreground-critical); }

.agent-trend-arrow {
  flex-shrink: 0;
}
</style>
