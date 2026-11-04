<template>
  <div class="analytics">
    <header class="head">
      <div>
        <h2>Agentic AI</h2>
        <p>Track conversation volume, topics, quality, transfer paths, and skill performance.</p>
        <p class="zone">All data is in Asia/Kolkata</p>
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
      <div class="row row--3">
        <article v-for="card in data.heroes" :key="card.id" class="sd-card kpi">
          <h4>{{ card.label }}</h4>
          <p class="value">{{ card.value }}</p>
          <p class="trend" :class="card.trend >= 0 ? 'up' : 'down'">
            {{ card.trend >= 0 ? '↑' : '↓' }} {{ Math.abs(card.trend).toFixed(1) }}%
          </p>
          <p class="note">{{ card.note }}</p>
        </article>
      </div>
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
          <div class="chart"><RankChart :labels="labels(data.purposes)" :values="values(data.purposes)" suffix="%" :color="brand" /></div>
        </article>
        <article class="sd-card chart-card">
          <h4>Transfer reasons</h4>
          <div class="chart"><RankChart :labels="labels(data.reasons)" :values="values(data.reasons)" suffix="%" :color="brand" /></div>
        </article>
        <article class="sd-card chart-card">
          <h4>Transfer destinations</h4>
          <div class="chart"><RankChart :labels="labels(data.destinations)" :values="values(data.destinations)" suffix="%" :color="brand" /></div>
        </article>
      </div>
    </section>

    <section>
      <h3>Skills</h3>
      <article class="sd-card table-card">
        <h4>Skill leaderboard</h4>
        <table>
          <thead>
            <tr>
              <th>Skill</th>
              <th>Volume</th>
              <th>Containment</th>
              <th>Success</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="skill in data.skills" :key="skill.name">
              <td>{{ skill.name }}</td>
              <td>{{ skill.volume }}</td>
              <td>{{ skill.containment }}</td>
              <td>{{ skill.success }}</td>
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
import RankChart from '../charts/RankChart.vue'
import { analyticsRanges } from '../../mock/analyticsData.js'

const rangeId = ref('past30')
const open = ref(false)
const current = computed(() => analyticsRanges.find((range) => range.id === rangeId.value))
const data = computed(() => current.value.data)
const brand = computed(() => (
  getComputedStyle(document.documentElement).getPropertyValue('--dt-color-surface-brand').trim() || '#7C52FF'
))

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
.zone { font-size: var(--dt-font-size-100); }

.range { position: relative; }

.row--3 { display: grid; grid-template-columns: repeat(3, 1fr); }

.kpi, .chart-card, .table-card { padding: var(--dt-space-500); }
.value {
  margin: var(--dt-space-300) 0 0;
  color: var(--dt-color-foreground-primary);
  font-size: var(--dt-font-size-400);
  font-weight: 600;
  line-height: 1.1;
}
.value span { color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-200); font-weight: 500; }
.trend { font-size: var(--dt-font-size-100); font-weight: 600; }
.up { color: var(--dt-color-foreground-success); }
.down { color: var(--dt-color-foreground-critical); }
.note { font-size: var(--dt-font-size-100); }
.chart { height: 180px; margin-top: var(--dt-space-400); }

table { width: 100%; margin-top: var(--dt-space-400); border-collapse: collapse; }
th, td {
  padding: var(--dt-space-400) var(--dt-space-450);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  text-align: left;
  font-size: var(--dt-font-size-200);
}
th { color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-100); font-weight: 600; }
tbody tr:last-child td { border-bottom: 0; }

@media (max-width: 1100px) {
  .row--3 { grid-template-columns: 1fr; }
}
</style>
