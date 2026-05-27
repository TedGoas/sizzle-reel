<template>
  <table class="agent-table">
    <thead>
      <tr>
        <th class="agent-table-th agent-table-th--name">Groups</th>
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
        <td class="agent-table-td agent-table-td--grade">
          <div class="agent-grade-bar-wrap">
            <span class="agent-grade-value">{{ agent.avgGrade }}</span>
            <div class="agent-grade-bar-track">
              <div class="agent-grade-bar" :style="{ width: agent.avgGrade, background: gradeColor(agent) }"></div>
            </div>
          </div>
        </td>
        <td class="agent-table-td agent-table-td--change">
          <span class="agent-trend" :class="`agent-trend--${agent.changeDir}`">
            <ArrowUp v-if="agent.changeDir === 'up'" :size="16" class="agent-trend-arrow" />
            <ArrowDown v-else :size="16" class="agent-trend-arrow" />
            {{ agent.change.replace(/[+-]/, '') }}
          </span>
        </td>
        <td class="agent-table-td agent-table-td--calls">
          <div class="agent-calls-bar-wrap">
            <span class="agent-calls-value">{{ agent.callsGraded }}</span>
            <div class="agent-calls-bar-track">
              <div class="agent-dist-bar" :style="{ width: callsPct(agent) }">
                <div class="agent-dist-ai" :style="{ width: aiPct(agent) }"></div>
                <div class="agent-dist-human" :style="{ width: humanPct(agent) }"></div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { agentRows } from '../data/analyticsData.js'
import { ArrowUp, ArrowDown } from '@lucide/vue'

const sequentialColors = [
  'hsl(220, 45%, 96%)',  // 01: 0–10%
  'hsl(220, 45%, 92%)',  // 02: 10–20%
  'hsl(218, 45%, 88%)',  // 03: 20–30%
  'hsl(216, 45%, 84%)',  // 04: 30–40%
  'hsl(214, 45%, 80%)',  // 05: 40–50%
  'hsl(212, 45%, 76%)',  // 06: 50–60%
  'hsl(210, 45%, 72%)',  // 07: 60–70%
  'hsl(208, 45%, 68%)',  // 08: 70–80%
  'hsl(206, 45%, 64%)',  // 09: 80–90%
  'hsl(204, 45%, 58%)',  // 10: 90–100%
]

function gradeColor (agent) {
  const pct = parseInt(agent.avgGrade)
  const idx = Math.min(Math.floor(pct / 10), 9)
  return sequentialColors[idx]
}

const maxCalls = Math.max(...agentRows.map(a => a.callsGraded))

function callsPct (agent) {
  return `${(agent.callsGraded / maxCalls * 100).toFixed(1)}%`
}

function aiPct (agent) {
  const total = agent.gradeDistribution.ai + agent.gradeDistribution.human
  return `${(agent.gradeDistribution.ai / total * 100).toFixed(1)}%`
}

function humanPct (agent) {
  const total = agent.gradeDistribution.ai + agent.gradeDistribution.human
  return `${(agent.gradeDistribution.human / total * 100).toFixed(1)}%`
}
</script>

<style scoped>
.agent-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.agent-table-th {
  padding: 16px;
  font-size: 12px;
  font-weight: 700;
  color: black;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.agent-table-th--name,
.agent-table-th--grade,
.agent-table-th--change {
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}

.agent-table-th--grade {
  text-align: left;
  width: 240px;
}

.agent-table-th--change {
  text-align: right;
  width: 120px;
}

.agent-table-th--calls {
  text-align: left;
  width: 240px;
}

.agent-table-td {
  padding: 16px;
  font-size: 15px;
  color: black;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.agent-table-row:last-child .agent-table-td {
  border-bottom: none;
}

.agent-table-td--name,
.agent-table-td--grade,
.agent-table-td--change {
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}

.agent-table-td--grade {
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

.agent-table-td--change {
  text-align: right;
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

.agent-table-td--calls {
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

.agent-name-link {
  text-decoration: underline;
  cursor: default;
}

/* Inline bar next to calls graded */
.agent-calls-bar-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.agent-calls-value {
  width: 24px;
  flex-shrink: 0;
  text-align: right;
}

.agent-calls-bar-track {
  flex: 1;
  min-width: 0;
}

.agent-trend {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.agent-trend--up {
  color: #1AA340;
}

.agent-trend--down {
  color: #EC0E0E;
}

.agent-trend-arrow {
  flex-shrink: 0;
}

/* Inline thin bar next to average grade */
.agent-grade-bar-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.agent-grade-value {
  width: 40px;
  flex-shrink: 0;
  text-align: right;
}

.agent-grade-bar-track {
  flex: 1;
  min-width: 0;
}

.agent-grade-bar {
  height: 8px;
  border-radius: 4px;
}

/* Grade distribution stacked bar */
.agent-dist-bar {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.agent-dist-ai {
  background: #CFDAF0;
  height: 100%;
}

.agent-dist-human {
  background: #ECF0F9;
  height: 100%;
}
</style>
