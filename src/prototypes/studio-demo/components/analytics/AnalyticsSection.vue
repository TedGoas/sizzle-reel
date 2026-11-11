<template>
  <div class="analytics">
    <header class="head">
      <div>
        <h2>Analytics</h2>
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
          <PerformanceChart :points="data.days" :colors="strokeColors" :visible="visible" />
        </div>
        <div class="legend">
          <button
            v-for="series in seriesList"
            :key="series.key"
            type="button"
            class="sd-legend-item"
            :class="{ inactive: !visible[series.key] }"
            :aria-pressed="visible[series.key]"
            @click="visible[series.key] = !visible[series.key]"
          >
            <i class="swatch" :class="{ faint: series.key !== 'total' }" :style="{ background: series.color }" />
            {{ series.label }}
            <strong>{{ series.total }}</strong>
          </button>
        </div>
      </article>
    </section>

    <section>
      <h3>Quality</h3>
      <div class="row row--3">
        <article v-for="card in data.quality" :key="card.id" class="sd-card kpi">
          <h4>{{ card.label }}</h4>
          <p class="value">
            <span class="value-num">
              <span class="value-ghost" aria-hidden="true">{{ card.value }}</span>
              <span class="value-live">{{ displays[card.id] }}</span>
            </span>
            <span v-if="card.unit" class="unit">{{ card.unit }}</span>
          </p>
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
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import Icon from '../Icon.vue'
import PerformanceChart from '../charts/PerformanceChart.vue'
import RankChart from '../charts/RankChart.vue'
import { TIMING, analyticsRanges, periodTotal } from '../../mock/analyticsData.js'

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

const visible = reactive({ total: true, contained: true, transferred: true })
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

const displays = ref({})
let countFrame = 0

function frameText(value, progress) {
  if (progress >= 1) return value
  return value.replace(/\d+(?:\.\d+)?/g, (raw) => {
    const [intPart, frac] = raw.split('.')
    const decimals = frac ? frac.length : 0
    const current = Number(raw) * progress
    const shown = decimals ? current.toFixed(decimals) : String(Math.round(current))
    const [shownInt, shownFrac] = shown.split('.')
    const padded = shownInt.padStart(intPart.length, '\u2007')
    return shownFrac != null ? `${padded}.${shownFrac}` : padded
  })
}

function playCounts() {
  cancelAnimationFrame(countFrame)
  const cards = data.value.quality
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    displays.value = Object.fromEntries(cards.map((card) => [card.id, card.value]))
    return
  }
  const start = performance.now()
  const step = (now) => {
    const t = Math.min(1, (now - start) / TIMING.qualityCount)
    const eased = 1 - (1 - t) ** 3
    const next = {}
    for (const card of cards) next[card.id] = frameText(card.value, eased)
    displays.value = next
    if (t < 1) countFrame = requestAnimationFrame(step)
  }
  countFrame = requestAnimationFrame(step)
}

onMounted(playCounts)
watch(rangeId, playCounts)
onUnmounted(() => cancelAnimationFrame(countFrame))
displays.value = Object.fromEntries(
  data.value.quality.map((card) => [card.id, frameText(card.value, 0)]),
)

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
  min-width: 0;
  max-width: 100%;
}

.head, .row {
  display: flex;
  gap: var(--dt-space-500);
  min-width: 0;
}

.head { justify-content: space-between; align-items: flex-start; }

h2, h3, h4 { margin: 0; font-weight: 600; }
h2 { font-size: var(--dt-font-size-300); }
h3 { margin-bottom: var(--dt-space-400); font-size: var(--dt-font-size-200); }
h4 { font-size: var(--dt-font-size-200); }

p { margin: var(--dt-space-200) 0 0; color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-200); }

.range { position: relative; }

.row--3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.kpi, .chart-card {
  min-width: 0;
  padding: var(--dt-space-500);
}
.performance { padding: var(--dt-space-500); }
.performance-chart { height: 280px; }
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-400);
  margin-top: var(--dt-space-400);
}
.sd-legend-item strong { font-weight: 600; }
.swatch {
  width: 16px;
  height: 4px;
  border-radius: 2px;
}
.swatch.faint { opacity: 0.65; }
.value {
  position: relative;
  margin: var(--dt-space-300) 0 0;
  color: var(--dt-color-foreground-primary);
  font-size: var(--dt-font-size-400);
  font-weight: 600;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
.value-num {
  display: inline-grid;
  vertical-align: baseline;
}
.value-ghost,
.value-live {
  grid-area: 1 / 1;
}
.value-ghost { visibility: hidden; }
.unit { color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-200); font-weight: 500; }
.note { font-size: var(--dt-font-size-100); }
.chart { height: 180px; min-width: 0; margin-top: var(--dt-space-400); }

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
