<template>
  <div class="overview">
    <button type="button" class="sd-btn sd-btn--outlined sd-btn--sm range">
      Past 7 days
      <Icon name="chevron-down" :size="12" />
    </button>

    <div class="grid">
      <article class="sd-card card metrics">
        <div class="card-head">
          <h2>Key metrics</h2>
          <div class="metric-tabs" role="tablist">
            <button
              v-for="series in metricSeries"
              :key="series.id"
              type="button"
              role="tab"
              :aria-selected="series.id === activeId"
              :class="{ active: series.id === activeId }"
              @click="activeId = series.id"
            >
              <span>{{ series.label }}</span>
              <strong>{{ series.rate }}</strong>
            </button>
          </div>
        </div>
        <div class="chart-box">
          <MetricChart :data="chartData" />
        </div>
      </article>

      <article class="sd-card card stat">
        <h2>Total conversations</h2>
        <p class="hero">{{ totalConversations.total.toLocaleString() }}</p>
        <div class="split">
          <span class="bar voice" :style="{ flex: totalConversations.voice }" />
          <span class="bar digital" :style="{ flex: totalConversations.digital }" />
        </div>
        <div class="split-labels">
          <span>Voice: {{ totalConversations.voice.toLocaleString() }}</span>
          <span>Digital: {{ totalConversations.digital.toLocaleString() }}</span>
        </div>
      </article>

      <article class="sd-card card stat">
        <h2>Guardian alerts</h2>
        <p class="hero">{{ guardianAlerts.total }}</p>
        <div class="split">
          <span class="bar caution" :style="{ flex: guardianAlerts.cautions }" />
          <span class="bar risk" :style="{ flex: guardianAlerts.highRisk }" />
        </div>
        <div class="split-labels">
          <span>Cautions: {{ guardianAlerts.cautions }}</span>
          <span>High risk: {{ guardianAlerts.highRisk }}</span>
        </div>
      </article>

      <article class="sd-card card stat">
        <h2>AI CSAT</h2>
        <p class="hero"><span class="quiet">{{ aiCsat.label }}</span> {{ aiCsat.score }}</p>
        <p class="sub">Voice: {{ aiCsat.voice }}, Digital: {{ aiCsat.digital }}</p>
      </article>

      <article class="sd-card card stat">
        <h2>Average handle time</h2>
        <p class="hero">{{ averageHandleTime.total }}</p>
        <p class="sub">Voice: {{ averageHandleTime.voice }}, Digital: {{ averageHandleTime.digital }}</p>
      </article>

      <article class="sd-card card skills">
        <h2>Most used skills</h2>
        <div class="chart-box">
          <RankChart :labels="skillLabels" :values="skillCounts" :color="brand" />
        </div>
      </article>
    </div>

    <h2 class="section-title">Improve and expand</h2>
    <article class="sd-card mining">
      <h3>Find the skills your customers actually need</h3>
      <p>
        Skill mining analyzes past conversations to uncover real customer scenarios that could be automated with AI skills.
      </p>
      <div class="mining-actions">
        <span class="sd-btn sd-btn--clear">Learn more</span>
        <span class="sd-btn sd-btn--primary">Start skill mining</span>
      </div>
    </article>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Icon from '../Icon.vue'
import MetricChart from '../charts/MetricChart.vue'
import RankChart from '../charts/RankChart.vue'
import {
  metricSeries,
  totalConversations,
  guardianAlerts,
  aiCsat,
  averageHandleTime,
  skillUsage,
} from '../../mock/overviewData.js'

const activeId = ref(metricSeries[0].id)
const active = computed(() => metricSeries.find((series) => series.id === activeId.value))

const brand = computed(() => (
  getComputedStyle(document.documentElement).getPropertyValue('--dt-color-surface-brand').trim() || '#7C52FF'
))
const neutral = computed(() => (
  getComputedStyle(document.documentElement).getPropertyValue('--dt-color-chart-neutral').trim() || '#CEC8C4'
))

const chartData = computed(() => {
  const series = active.value
  const positive = series.positiveValues
  const negative = series.negativeValues
  const rates = positive.map((value, index) => Math.round((value / (value + negative[index])) * 100))
  return {
    labels: series.labels,
    datasets: [
      { type: 'bar', label: series.positive, data: positive, backgroundColor: brand.value, stack: 'volume', borderRadius: 3 },
      { type: 'bar', label: series.negative, data: negative, backgroundColor: neutral.value, stack: 'volume', borderRadius: 3 },
      {
        type: 'line',
        label: 'Rate',
        data: rates,
        borderColor: '#1A1A1A',
        backgroundColor: '#1A1A1A',
        yAxisID: 'y1',
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  }
})

const skillLabels = skillUsage.map((skill) => skill.name)
const skillCounts = skillUsage.map((skill) => skill.count)
</script>

<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-525);
}

.range {
  align-self: flex-start;
  cursor: default;
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(148px, auto);
  gap: var(--dt-space-525);
}

.card {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
  padding: var(--dt-space-500);
  min-width: 0;
}

.metrics { grid-column: 1 / 7; grid-row: 1 / 4; }
.grid .stat:nth-child(2) { grid-column: 7 / 10; grid-row: 1; }
.grid .stat:nth-child(3) { grid-column: 10 / 13; grid-row: 1; }
.grid .stat:nth-child(4) { grid-column: 7 / 10; grid-row: 2; }
.grid .stat:nth-child(5) { grid-column: 7 / 10; grid-row: 3; }
.skills { grid-column: 10 / 13; grid-row: 2 / 4; }

h2, h3 {
  margin: 0;
  font-size: var(--dt-font-size-200);
  font-weight: 600;
}

.card-head {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
}

.metric-tabs {
  display: flex;
  gap: var(--dt-space-200);
}

.metric-tabs button {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  flex: 1;
  padding: var(--dt-space-300) var(--dt-space-400);
  border: 1px solid transparent;
  border-radius: 6px;
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-secondary);
  font-family: inherit;
  font-size: var(--dt-font-size-100);
  text-align: left;
  cursor: pointer;
}

.metric-tabs button.active {
  border-color: var(--dt-color-border-brand);
  background: var(--dt-color-surface-brand-subtle);
  color: var(--dt-color-foreground-primary);
}

.metric-tabs strong {
  font-size: var(--dt-font-size-200);
}

.chart-box {
  flex: 1;
  min-height: 180px;
}

.hero {
  margin: 0;
  font-size: var(--dt-font-size-400);
  font-weight: 600;
  line-height: 1.1;
}

.quiet {
  margin-right: var(--dt-space-300);
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-200);
  font-weight: 500;
}

.sub,
.split-labels {
  margin: 0;
  color: var(--dt-color-foreground-tertiary);
  font-size: var(--dt-font-size-100);
}

.split {
  display: flex;
  gap: var(--dt-space-200);
  height: 10px;
}

.bar {
  border-radius: 999px;
  min-width: 8px;
}

.voice, .caution { background: var(--dt-color-surface-brand); }
.digital { background: var(--dt-color-chart-neutral); }
.risk { background: var(--dt-color-foreground-critical); }

.split-labels {
  display: flex;
  justify-content: space-between;
  gap: var(--dt-space-400);
}

.section-title {
  font-size: var(--dt-font-size-300);
}

.mining {
  width: min(520px, 100%);
  padding: var(--dt-space-600) var(--dt-space-550);
  text-align: center;
}

.mining p {
  margin: var(--dt-space-400) 0 var(--dt-space-500);
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-200);
}

.mining-actions {
  display: flex;
  justify-content: center;
  gap: var(--dt-space-400);
}

.mining-actions .sd-btn {
  cursor: default;
}

@media (max-width: 1100px) {
  .metrics,
  .skills,
  .grid .stat {
    grid-column: 1 / -1;
    grid-row: auto;
  }
}
</style>
