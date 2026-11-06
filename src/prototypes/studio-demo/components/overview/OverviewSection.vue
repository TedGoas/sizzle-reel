<template>
  <div class="overview">
    <button type="button" class="sd-btn sd-btn--outlined sd-btn--sm range">
      Past 7 days
      <Icon name="chevron-down" :size="12" />
    </button>

    <div class="grid">
      <article class="sd-card card metrics">
        <div class="widget-title">
          <h2>Key metrics</h2>
          <svg class="info" viewBox="0 0 12 12" aria-hidden="true">
            <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" />
            <path d="M6 5.25v3.1M6 3.55v.15" stroke="currentColor" stroke-linecap="round" />
          </svg>
        </div>
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
            <span class="tab-label">
              {{ series.label }}
              <svg class="info" viewBox="0 0 12 12" aria-hidden="true">
                <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" />
                <path d="M6 5.25v3.1M6 3.55v.15" stroke="currentColor" stroke-linecap="round" />
              </svg>
            </span>
            <span class="tab-metric">{{ metricRate(series.points) }}</span>
          </button>
        </div>
        <div class="chart-box">
          <MetricChart
            :points="active.points"
            :positive-color="metricColors.positive"
            :negative-color="metricColors.negative"
            :line-color="metricColors.line"
            :show-positive="visible.positive"
            :show-negative="visible.negative"
            :show-rate="visible.rate"
          />
        </div>
        <div class="legend">
          <button type="button" :class="{ inactive: !visible.positive }" @click="visible.positive = !visible.positive">
            <span class="swatch" :style="{ background: metricColors.positive }" />
            {{ active.positive }}
          </button>
          <button type="button" :class="{ inactive: !visible.negative }" @click="visible.negative = !visible.negative">
            <span class="swatch" :style="{ background: metricColors.negative }" />
            {{ active.negative }}
          </button>
          <button type="button" :class="{ inactive: !visible.rate }" @click="visible.rate = !visible.rate">
            <span class="swatch swatch--line" :style="{ background: metricColors.line }" />
            Rate
          </button>
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
          <RankChart :labels="skillLabels" :values="skillCounts" color="#6366F1" />
        </div>
      </article>
    </div>

    <h2 class="section-title">Improve and expand</h2>

    <article v-if="mining !== 'done'" class="sd-card mining" :class="{ 'is-running': mining === 'running' }">
      <MiningIllustration />
      <h3>Find the skills your customers actually need</h3>
      <p>
        Skill mining reads past conversations and finds the calls this agent couldn’t handle. Each group is a skill you could add.
      </p>
      <div v-if="mining === 'idle'" class="mining-actions">
        <span class="sd-btn sd-btn--clear">Learn more</span>
        <button type="button" class="sd-btn sd-btn--primary" @click="drawer = 'setup'">Start skill mining</button>
      </div>
      <div v-else class="mining-status" role="status">
        <span class="spinner" aria-hidden="true" />
        <span>Reading {{ miningSummary.analyzed.toLocaleString() }} conversations</span>
        <button type="button" class="sd-btn sd-btn--outlined sd-btn--sm" @click="cancelMining">Cancel</button>
      </div>
    </article>

    <article v-else class="sd-card results">
      <header class="results-header">
        <div>
          <h3>Calls this agent couldn’t handle</h3>
          <p class="sub">
            {{ miningSummary.uncovered }} of {{ miningSummary.analyzed.toLocaleString() }} conversations, {{ miningSummary.range }}
          </p>
        </div>
        <button type="button" class="sd-btn sd-btn--outlined sd-btn--sm" @click="drawer = 'setup'">Mine again</button>
      </header>
      <div class="results-body">
        <GapDonut
          :segments="donutSegments"
          :center-value="`${uncoveredShare}%`"
          center-label="of calls not handled"
          @select="openGap"
        />
        <ul class="gaps">
          <li v-for="gap in miningGaps" :key="gap.id">
            <button
              type="button"
              class="gap"
              :class="{ active: drawer === 'gap' && selectedGap?.id === gap.id }"
              @click="openGap(gap.id)"
            >
              <span class="gap-chip" :style="{ background: `var(${gap.colorToken})` }" />
              <span class="gap-text">
                <span class="gap-name">{{ gap.name }}</span>
                <span class="gap-desc">{{ gap.description }}</span>
              </span>
              <span class="gap-count">
                <strong>{{ gap.calls }}</strong>
                <span>{{ gapShare(gap) }}%</span>
              </span>
              <Icon name="chevron-down" :size="12" class="gap-chevron" />
            </button>
          </li>
        </ul>
      </div>
    </article>

    <DrawerTransition>
      <MiningSetupDrawer
        v-if="drawer === 'setup'"
        key="setup"
        @close="drawer = null"
        @start="startMining"
      />
      <MiningGapDrawer
        v-else-if="drawer === 'gap' && selectedGap"
        key="gap"
        :gap="selectedGap"
        @close="drawer = null"
      />
    </DrawerTransition>
  </div>
</template>

<script setup>
import { computed, onUnmounted, reactive, ref, watch } from 'vue'
import Icon from '../Icon.vue'
import MetricChart from '../charts/MetricChart.vue'
import RankChart from '../charts/RankChart.vue'
import MiningIllustration from './MiningIllustration.vue'
import DrawerTransition from '../DrawerTransition.vue'
import MiningSetupDrawer from './MiningSetupDrawer.vue'
import MiningGapDrawer from './MiningGapDrawer.vue'
import GapDonut from '../charts/GapDonut.vue'
import { TIMING, miningGaps, miningSummary, gapShare, uncoveredShare } from '../../mock/miningData.js'
import {
  metricColors,
  metricRate,
  metricSeries,
  totalConversations,
  guardianAlerts,
  aiCsat,
  averageHandleTime,
  skillUsage,
} from '../../mock/overviewData.js'

const activeId = ref(metricSeries[0].id)
const active = computed(() => metricSeries.find((series) => series.id === activeId.value))
const visible = reactive({ positive: true, negative: true, rate: true })

watch(activeId, () => {
  visible.positive = true
  visible.negative = true
  visible.rate = true
})

const skillLabels = skillUsage.map((skill) => skill.name)
const skillCounts = skillUsage.map((skill) => skill.count)

// Skill mining: idle -> running (TIMING.miningRun) -> done
const mining = ref('idle')
const drawer = ref(null) // null | 'setup' | 'gap'. Drawers overlay the page so the dashboard grid doesn't reflow.
const selectedGapId = ref(null)
const selectedGap = computed(() => miningGaps.find((gap) => gap.id === selectedGapId.value))
let miningTimer = 0

const donutSegments = [
  ...miningGaps.map((gap) => ({ id: gap.id, label: gap.name, value: gap.calls, colorToken: gap.colorToken })),
  {
    id: null,
    label: 'Handled by this agent',
    value: miningSummary.analyzed - miningSummary.uncovered,
    colorToken: '--dt-color-chart-neutral',
  },
]

function startMining() {
  drawer.value = null
  mining.value = 'running'
  clearTimeout(miningTimer)
  miningTimer = setTimeout(() => { mining.value = 'done' }, TIMING.miningRun)
}

function cancelMining() {
  clearTimeout(miningTimer)
  mining.value = 'idle'
}

function openGap(id) {
  selectedGapId.value = id
  drawer.value = 'gap'
}

onUnmounted(() => clearTimeout(miningTimer))
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

.widget-title {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
}

.widget-title h2 {
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-100);
  font-weight: 500;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-100);
  line-height: 1.2;
}

.info {
  width: 12px;
  height: 12px;
  color: var(--dt-color-foreground-tertiary);
  flex: none;
}

.metric-tabs {
  display: flex;
  gap: var(--dt-space-500);
}

.metric-tabs button {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--dt-space-400);
  padding: var(--dt-space-400);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400, 8px);
  background: var(--dt-color-surface-primary);
  color: var(--dt-color-foreground-primary);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.metric-tabs button:hover {
  border-color: var(--dt-color-border-moderate);
}

.metric-tabs button.active {
  border-color: #B794F6;
}

.tab-metric {
  font: var(--dt-typography-headline-xl);
}

.chart-box {
  flex: 1;
  min-height: 240px;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-400);
}

.legend button {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  padding: var(--dt-space-300) var(--dt-space-400);
  border: 0;
  border-radius: var(--dt-size-radius-300, 4px);
  background: var(--dt-color-surface-moderate);
  color: var(--dt-color-foreground-primary);
  font: var(--dt-typography-body-sm-compact);
  font-family: inherit;
  cursor: pointer;
}

.legend button.inactive {
  opacity: 0.4;
  text-decoration: line-through;
}

.swatch {
  width: 16px;
  height: 4px;
  border-radius: 2px;
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

.voice { background: #8AABDD; }
.digital { background: #AEC3E7; }
.caution { background: #4385CB; }
.risk { background: #D9524C; }

.split-labels {
  display: flex;
  justify-content: space-between;
  gap: var(--dt-space-400);
}

.section-title {
  font-size: var(--dt-font-size-300);
}

.mining {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--dt-space-500);
  width: min(520px, 100%);
  padding: var(--dt-space-600) var(--dt-space-550);
  text-align: center;
}

.mining p {
  margin: 0;
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-200);
}

.mining-actions {
  display: flex;
  justify-content: center;
  gap: var(--dt-space-400);
}

.mining-actions span.sd-btn {
  cursor: default;
}

.mining-status {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  min-height: var(--btn-height-md);
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-200);
}

.spinner {
  width: 16px;
  height: 16px;
  flex: none;
  border: 2px solid var(--dt-color-border-default);
  border-top-color: var(--dt-color-surface-brand);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.mining.is-running :deep(.illo--star) {
  animation: star-bounce 1.5s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes star-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.results {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-550);
  padding: var(--dt-space-550);
  container-type: inline-size;
  animation: rise 0.4s ease;
}

.results-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--dt-space-500);
}

.results-header .sub {
  margin-top: var(--dt-space-200);
}

.results-body {
  display: flex;
  align-items: center;
  gap: var(--dt-space-600);
}

.gaps {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.gap {
  display: flex;
  align-items: center;
  gap: var(--dt-space-450);
  width: 100%;
  padding: var(--dt-space-400) var(--dt-space-450);
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dt-color-foreground-primary);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}

.gap:hover {
  background: var(--dt-color-surface-secondary);
}

.gap.active {
  background: var(--dt-color-surface-brand-subtle);
}

.gap-chip {
  width: 12px;
  height: 12px;
  flex: none;
  border-radius: var(--dt-space-200);
}

.gap-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--dt-space-100);
  min-width: 0;
}

.gap-name {
  font-size: var(--dt-font-size-200);
  font-weight: 600;
}

.gap-desc {
  overflow: hidden;
  color: var(--dt-color-foreground-tertiary);
  font-size: var(--dt-font-size-100);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gap-count {
  display: flex;
  flex: none;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--dt-space-100);
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

.gap-count strong {
  font-size: var(--dt-font-size-200);
}

.gap-count span {
  color: var(--dt-color-foreground-tertiary);
  font-size: var(--dt-font-size-100);
}

.gap-chevron {
  flex: none;
  color: var(--dt-color-foreground-tertiary);
  transform: rotate(-90deg);
}

@keyframes rise {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@container (max-width: 760px) {
  .results-body {
    flex-direction: column;
    align-items: stretch;
  }

  .results-body > :first-child {
    align-self: center;
  }
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
