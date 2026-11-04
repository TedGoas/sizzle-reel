<template>
  <div class="analytics">
    <header class="head">
      <div>
        <h2>Agentic AI</h2>
        <p>Track conversation volume, topics, quality, transfer paths, and skill performance.</p>
      </div>
      <div class="range">
        <button type="button" class="sd-btn sd-btn--outlined sd-btn--sm" @click="open = !open">
          {{ current.label }}
          <Icon name="chevron-down" :size="12" />
        </button>
        <div v-if="open" class="sd-menu" role="menu">
          <button
            v-for="range in analyticsRanges"
            :key="range.id"
            type="button"
            role="menuitem"
            :aria-current="range.id === rangeId ? 'true' : undefined"
            @click="pick(range.id)"
          >
            {{ range.label }}
          </button>
        </div>
      </div>
    </header>

    <section>
      <h3>Performance</h3>
      <article class="sd-card performance">
        <div class="performance-chart">
          <PerformanceChart :points="data.days" :colors="strokeColors" />
        </div>
        <div class="legend">
          <span v-for="series in seriesList" :key="series.key" class="legend-item">
            <i class="swatch" :class="{ faint: series.key !== 'total' }" :style="{ background: series.color }" />
            {{ series.label }}
            <strong>{{ series.total }}</strong>
          </span>
        </div>
      </article>
    </section>

    <section>
      <h3>Quality</h3>
      <div class="row row--3">
        <article v-for="card in data.quality" :key="card.id" class="sd-card kpi">
          <h4>{{ card.label }}</h4>
          <p class="value">{{ card.value }} <span v-if="card.unit">{{ card.unit }}</span></p>
          <p class="note">{{ card.note }}</p>
        </article>
      </div>
    </section>

    <section>
      <h3>Breakdowns</h3>
      <div class="row row--3">
        <article class="sd-card chart-card">
          <h4>Conversation purpose</h4>
          <div class="chart"><RankChart :labels="labels(data.purposes)" :values="values(data.purposes)" suffix="%" :color="strokeColors.total" /></div>
        </article>
        <article class="sd-card chart-card">
          <h4>Transfer reasons</h4>
          <div class="chart"><RankChart :labels="labels(data.reasons)" :values="values(data.reasons)" suffix="%" :color="strokeColors.contained" /></div>
        </article>
        <article class="sd-card chart-card">
          <h4>Transfer destinations</h4>
          <div class="chart"><RankChart :labels="labels(data.destinations)" :values="values(data.destinations)" suffix="%" :color="strokeColors.transferred" /></div>
        </article>
      </div>
    </section>

    <section>
      <h3>Skills</h3>
      <article class="sd-card table-card">
        <table>
          <thead>
            <tr>
              <th v-for="column in columns" :key="column.key" :aria-sort="ariaSort(column.key)">
                <button type="button" @click="sortBy(column.key)">
                  {{ column.label }}
                  <span class="sort-mark" :class="{ on: sortKey === column.key }">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="skill in sortedSkills" :key="skill.name">
              <td>{{ skill.name }}</td>
              <td>{{ skill.volume.toLocaleString() }}</td>
              <td>{{ skill.containment }}%</td>
              <td>{{ skill.success }}%</td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Icon from '../Icon.vue'
import PerformanceChart from '../charts/PerformanceChart.vue'
import RankChart from '../charts/RankChart.vue'
import { analyticsRanges, periodTotal } from '../../mock/analyticsData.js'

const columns = [
  { key: 'name', label: 'Skill' },
  { key: 'volume', label: 'Volume' },
  { key: 'containment', label: 'Containment' },
  { key: 'success', label: 'Success' },
]

function token(name, fallback) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}

const strokeColors = {
  total: token('--dt-color-chart-categorical-01', 'oklch(0.5829 0.2426 287.41)'),
  contained: token('--dt-color-chart-categorical-02', 'oklch(0.7038 0.232 347.8)'),
  transferred: token('--dt-color-chart-categorical-03', 'oklch(0.6089 0.2128 259.28)'),
}

const seriesList = computed(() => [
  { key: 'total', label: 'Total conversations', color: 'var(--dt-color-chart-categorical-01)' },
  { key: 'contained', label: 'AI contained', color: 'var(--dt-color-chart-categorical-02)' },
  { key: 'transferred', label: 'Transferred', color: 'var(--dt-color-chart-categorical-03)' },
].map((series) => ({
  ...series,
  total: periodTotal(data.value.days, series.key).toLocaleString(),
})))

const rangeId = ref('past30')
const open = ref(false)
const sortKey = ref('volume')
const sortDir = ref('desc')
const current = computed(() => analyticsRanges.find((range) => range.id === rangeId.value))
const data = computed(() => current.value.data)
const sortedSkills = computed(() => {
  const direction = sortDir.value === 'asc' ? 1 : -1
  return [...data.value.skills].sort((a, b) => {
    const left = a[sortKey.value]
    const right = b[sortKey.value]
    if (typeof left === 'string') return left.localeCompare(right) * direction
    return (left - right) * direction
  })
})

function sortBy(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    return
  }
  sortKey.value = key
  sortDir.value = key === 'name' ? 'asc' : 'desc'
}

function ariaSort(key) {
  if (sortKey.value !== key) return 'none'
  return sortDir.value === 'asc' ? 'ascending' : 'descending'
}

function pick(id) {
  rangeId.value = id
  open.value = false
}

function labels(rows) {
  return rows.map((row) => row.label)
}

function values(rows) {
  return rows.map((row) => row.value)
}
</script>

<style scoped>
.analytics {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-600);
}

.head, .row {
  display: flex;
  gap: var(--dt-space-500);
}

.head { justify-content: space-between; align-items: flex-start; }

h2, h3, h4 { margin: 0; font-weight: 600; }
h2 { font-size: var(--dt-font-size-300); }
h3 { margin-bottom: var(--dt-space-400); font-size: var(--dt-font-size-200); }
h4 { font-size: var(--dt-font-size-200); }

p { margin: var(--dt-space-200) 0 0; color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-200); }

.range { position: relative; }

.row--3 { display: grid; grid-template-columns: repeat(3, 1fr); }

.kpi, .chart-card { padding: var(--dt-space-500); }
.performance { padding: var(--dt-space-500); }
.performance-chart { height: 280px; }
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-500);
  margin-top: var(--dt-space-400);
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-300);
  color: var(--dt-color-foreground-primary);
  font-size: var(--dt-font-size-100);
}
.legend-item strong { font-weight: 600; }
.swatch {
  width: 16px;
  height: 4px;
  border-radius: 2px;
}
.swatch.faint { opacity: 0.65; }
.value {
  margin: var(--dt-space-300) 0 0;
  color: var(--dt-color-foreground-primary);
  font-size: var(--dt-font-size-400);
  font-weight: 600;
  line-height: 1.1;
}
.value span { color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-200); font-weight: 500; }
.note { font-size: var(--dt-font-size-100); }
.chart { height: 180px; margin-top: var(--dt-space-400); }

.table-card { padding: 0; overflow: hidden; }
table { width: 100%; border-collapse: collapse; table-layout: fixed; }
th, td {
  padding: var(--dt-space-400) var(--dt-space-500);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  text-align: left;
  font-size: var(--dt-font-size-200);
  overflow: hidden;
  white-space: nowrap;
}
th:nth-child(1), td:nth-child(1) { width: 40%; }
th:nth-child(2), td:nth-child(2) { width: 20%; }
th:nth-child(3), td:nth-child(3) { width: 20%; }
th:nth-child(4), td:nth-child(4) { width: 20%; }
th { background: var(--dt-color-surface-secondary); }
th button {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-200);
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--dt-color-foreground-tertiary);
  font: inherit;
  font-size: var(--dt-font-size-100);
  font-weight: 600;
  cursor: pointer;
}
.sort-mark {
  width: 1em;
  color: var(--dt-color-foreground-primary);
  visibility: hidden;
}
.sort-mark.on { visibility: visible; }
tbody tr:last-child td { border-bottom: 0; }

@media (max-width: 1100px) {
  .row--3 { grid-template-columns: 1fr; }
}
</style>
