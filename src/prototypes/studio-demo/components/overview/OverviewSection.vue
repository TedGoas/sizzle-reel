<template>
  <div class="overview">
    <button type="button" class="sd-btn sd-btn--outlined sd-btn--sm range">
      Past 7 days
      <Icon name="chevron-down" :size="12" />
    </button>

    <div class="grid">
      <article class="sd-card card metrics">
        <TileTitle title="Key metrics" :tip="overviewTips.metrics" />
        <div class="metric-tabs" role="tablist">
          <button
            v-for="series in metricSeries"
            :key="series.id"
            type="button"
            role="tab"
            :aria-selected="series.id === activeId"
            :class="{ active: series.id === activeId }"
            @click="activeId = series.id"
            @mouseenter="tabTip = series.id"
            @mouseleave="tabTip = null"
            @focus="tabTip = series.id"
            @blur="tabTip = null"
          >
            <span class="tab-label">{{ series.label }}</span>
            <span class="tab-metric">{{ metricRate(series.points) }}</span>
            <span v-if="tabTip === series.id" class="dark-tip" role="tooltip">
              <strong>{{ series.label }}</strong>
              <p>{{ series.tip }}</p>
            </span>
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
            :positive-label="active.positive"
            :negative-label="active.negative"
          />
        </div>
        <div class="legend">
          <button type="button" class="sd-legend-item" :class="{ inactive: !visible.positive }" @click="visible.positive = !visible.positive">
            <span class="swatch" :style="{ background: metricColors.positive }" />
            {{ active.positive }}
          </button>
          <button type="button" class="sd-legend-item" :class="{ inactive: !visible.negative }" @click="visible.negative = !visible.negative">
            <span class="swatch" :style="{ background: metricColors.negative }" />
            {{ active.negative }}
          </button>
          <button type="button" class="sd-legend-item" :class="{ inactive: !visible.rate }" @click="visible.rate = !visible.rate">
            <span class="swatch swatch--line" :style="{ background: metricColors.line }" />
            Rate
          </button>
        </div>
      </article>

      <CompositionStat
        title="Total conversations"
        :tip="totalConversations.tip"
        :total="totalConversations.total"
        :trend="totalConversations.trend"
        :caption="totalConversations.caption"
        :segments="totalConversations.segments"
      />

      <CompositionStat
        title="Guardian alerts"
        :tip="guardianAlerts.tip"
        :total="guardianAlerts.total"
        :trend="guardianAlerts.trend"
        :share="guardianAlerts.share"
        :caption="guardianAlerts.caption"
        :segments="guardianAlerts.segments"
        lower-is-better
      />

      <article class="sd-card card stat">
        <TileTitle title="AI CSAT" :tip="overviewTips.csat" />
        <p class="hero"><span class="quiet">{{ aiCsat.label }}</span> {{ aiCsat.score }}</p>
        <p class="sub">Voice: {{ aiCsat.voice }}, Digital: {{ aiCsat.digital }}</p>
      </article>

      <article class="sd-card card stat">
        <TileTitle title="Average handle time" :tip="overviewTips.aht" />
        <p class="hero">{{ averageHandleTime.total }}</p>
        <p class="sub">Voice: {{ averageHandleTime.voice }}, Digital: {{ averageHandleTime.digital }}</p>
      </article>

      <article class="sd-card card skills">
        <TileTitle title="Most used skills" :tip="overviewTips.skills" />
        <BreakdownDonut :segments="skillUsage" caption="starts" />
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
          :hovered-id="hoveredGapId || ''"
          :selected-id="drawer === 'gap' ? selectedGapId || '' : ''"
          @select="openGap"
          @hover="hoveredGapId = $event"
        />
        <ul class="gaps">
          <li v-for="gap in miningGaps" :key="gap.id">
            <button
              type="button"
              class="gap"
              :class="{
                active: drawer === 'gap' && selectedGap?.id === gap.id,
                hot: hoveredGapId === gap.id,
              }"
              @mouseenter="hoveredGapId = gap.id"
              @mouseleave="hoveredGapId = null"
              @click="openGap(gap.id)"
            >
              <span class="gap-chip" :style="{ background: `var(${gap.colorToken})` }" />
              <span class="gap-text">
                <span class="gap-name">{{ gap.name }}</span>
                <span class="gap-desc">{{ gap.description }}</span>
              </span>
              <span class="gap-count">
                <strong>{{ gap.calls }}</strong>
                <span>({{ gapShare(gap) }}%)</span>
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
import TileTitle from '../analytics/TileTitle.vue'
import CompositionStat from './CompositionStat.vue'
import MetricChart from '../charts/MetricChart.vue'
import BreakdownDonut from '../charts/BreakdownDonut.vue'
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
  overviewTips,
} from '../../mock/overviewData.js'

const activeId = ref(metricSeries[0].id)
const tabTip = ref(null)
const active = computed(() => metricSeries.find((series) => series.id === activeId.value))
const visible = reactive({ positive: true, negative: true, rate: true })

watch(activeId, () => {
  visible.positive = true
  visible.negative = true
  visible.rate = true
})

// Skill mining: idle -> running (TIMING.miningRun) -> done
const mining = ref('idle')
const drawer = ref(null) // null | 'setup' | 'gap'. Drawers overlay the page so the dashboard grid doesn't reflow.
const selectedGapId = ref(null)
const hoveredGapId = ref(null)
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
.skills :deep(.breakdown) { margin-top: 0; }

h2, h3 {
  margin: 0;
  font-size: var(--dt-font-size-200);
  font-weight: 600;
}

.tab-label {
  color: var(--dt-color-foreground-primary);
  font-size: var(--dt-font-size-100);
  line-height: 1.6;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-decoration-color: var(--dt-color-foreground-muted);
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.metric-tabs {
  display: flex;
  align-items: stretch;
  gap: var(--dt-space-500);
}

.metric-tabs button {
  position: relative;
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
  border-color: var(--dt-color-purple-500);
}

.dark-tip {
  position: absolute;
  z-index: 6;
  bottom: calc(100% + var(--dt-space-200));
  left: 0;
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
  width: max-content;
  max-width: 240px;
  padding: var(--dt-space-400) var(--dt-space-450);
  background: var(--dt-color-surface-contrast);
  border-radius: var(--dt-space-300);
  box-shadow: var(--dt-shadow-medium);
  color: var(--dt-color-foreground-primary-inverted);
  font-size: var(--dt-font-size-100);
  font-weight: 400;
  line-height: 1.4;
  text-align: left;
  pointer-events: none;
}

.dark-tip strong { font-weight: 700; }
.dark-tip p {
  margin: 0;
  color: var(--dt-color-foreground-secondary-inverted);
}

.tab-metric {
  margin-top: auto;
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

.sub {
  margin: 0;
  color: var(--dt-color-foreground-tertiary);
  font-size: var(--dt-font-size-100);
}

.section-title {
  font-size: var(--dt-font-size-300);
}

.mining {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--dt-space-500);
  width: calc((100% - 11 * var(--dt-space-525)) / 12 * 6 + 5 * var(--dt-space-525));
  max-width: 100%;
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
  justify-content: flex-start;
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

.gap:hover,
.gap.hot {
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
  align-items: baseline;
  gap: var(--dt-space-200);
  font-size: var(--dt-font-size-200);
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

.gap-count strong {
  width: 2ch;
  font-weight: 600;
  text-align: right;
}

.gap-count span {
  color: var(--dt-color-foreground-tertiary);
  font-weight: 400;
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

  .mining { width: 100%; }
}
</style>
