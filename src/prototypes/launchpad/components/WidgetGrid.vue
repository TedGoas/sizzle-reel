<template>
  <div class="widget-grid">
    <!-- Row 1: Handled Calls (narrow ~40%) + Avg Call Duration (wide ~60%) -->
    <div class="widget-row">
      <div class="widget-card widget-card--narrow">
        <div v-if="loading" class="skeleton-donut">
          <div class="skeleton skeleton--text" style="width: 40%" />
          <div class="skeleton skeleton--circle skeleton-donut-circle" />
          <div class="skeleton-donut-legend">
            <div v-for="n in 3" :key="n" class="skeleton skeleton--text" :style="{ width: `${50 + n * 10}%` }" />
          </div>
        </div>
        <DonutWidget
          v-else
          :title="handledCalls.title"
          :segments="handledCalls.segments"
          :center-value="handledCalls.total"
          :center-label="handledCalls.centerLabel"
        />
      </div>
      <div class="widget-card widget-card--wide">
        <div v-if="loading" class="skeleton-linechart">
          <div class="skeleton skeleton--text" style="width: 30%" />
          <div class="skeleton skeleton--heading" style="width: 15%" />
          <div class="skeleton skeleton-linechart-chart" />
          <div class="skeleton skeleton--text" style="width: 80%" />
          <div class="skeleton skeleton--text" style="width: 60%" />
        </div>
        <LineChartWidget
          v-else
          :title="avgCallDuration.title"
          :value="avgCallDuration.value"
          :chart-data="avgCallDuration.chartData"
          :rankings="avgCallDuration.rankings"
        />
      </div>
    </div>

    <!-- Row 2: Ai Scorecards (wide ~60%) + Unanswered Calls (narrow ~40%) -->
    <div class="widget-row widget-row--flipped">
      <div class="widget-card widget-card--wide">
        <div v-if="loading" class="skeleton-linechart">
          <div class="skeleton skeleton--text" style="width: 30%" />
          <div class="skeleton skeleton--heading" style="width: 15%" />
          <div class="skeleton skeleton-linechart-chart" />
          <div class="skeleton skeleton--text" style="width: 80%" />
          <div class="skeleton skeleton--text" style="width: 60%" />
        </div>
        <LineChartWidget
          v-else
          :title="aiScorecards.title"
          :value="aiScorecards.value"
          :chart-data="aiScorecards.chartData"
          :rankings="aiScorecards.rankings"
        />
      </div>
      <div class="widget-card widget-card--narrow">
        <div v-if="loading" class="skeleton-donut">
          <div class="skeleton skeleton--text" style="width: 40%" />
          <div class="skeleton skeleton--circle skeleton-donut-circle" />
          <div class="skeleton-donut-legend">
            <div v-for="n in 4" :key="n" class="skeleton skeleton--text" :style="{ width: `${50 + n * 10}%` }" />
          </div>
        </div>
        <DonutWidget
          v-else
          :title="unansweredCalls.title"
          :segments="unansweredCalls.segments"
          :center-value="unansweredCalls.total"
          :center-label="unansweredCalls.centerLabel"
          :secondary-stat="unansweredCalls.secondaryStat"
        />
      </div>
    </div>

    <!-- Row 3: Ai Chatbot (narrow ~40%) + Ai CSAT (wide ~60%) -->
    <div class="widget-row">
      <div class="widget-card widget-card--narrow">
        <div v-if="loading" class="skeleton-donut">
          <div class="skeleton skeleton--text" style="width: 40%" />
          <div class="skeleton skeleton--circle skeleton-donut-circle" />
          <div class="skeleton-donut-legend">
            <div v-for="n in 4" :key="n" class="skeleton skeleton--text" :style="{ width: `${50 + n * 10}%` }" />
          </div>
        </div>
        <DonutWidget
          v-else
          :title="aiChatbot.title"
          :segments="aiChatbot.segments"
          :center-value="aiChatbot.total"
          :center-label="aiChatbot.centerLabel"
          :secondary-stat="aiChatbot.secondaryStat"
        />
      </div>
      <div class="widget-card widget-card--wide">
        <div v-if="loading" class="skeleton-linechart">
          <div class="skeleton skeleton--text" style="width: 30%" />
          <div class="skeleton skeleton--heading" style="width: 15%" />
          <div class="skeleton skeleton-linechart-chart" />
          <div class="skeleton skeleton--text" style="width: 80%" />
          <div class="skeleton skeleton--text" style="width: 60%" />
        </div>
        <LineChartWidget
          v-else
          :title="aiCsat.title"
          :value="aiCsat.value"
          :chart-data="aiCsat.chartData"
          :rankings="aiCsat.rankings"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import DonutWidget from './DonutWidget.vue'
import LineChartWidget from './LineChartWidget.vue'
import {
  handledCalls as defaultHandledCalls,
  avgCallDuration as defaultAvgCallDuration,
  aiScorecards as defaultAiScorecards,
  unansweredCalls as defaultUnansweredCalls,
  aiChatbot as defaultAiChatbot,
  aiCsat as defaultAiCsat,
  generateWidgetData,
} from '../data/mockData.js'

const loading = ref(true)

const handledCalls = ref(defaultHandledCalls)
const avgCallDuration = ref(defaultAvgCallDuration)
const aiScorecards = ref(defaultAiScorecards)
const unansweredCalls = ref(defaultUnansweredCalls)
const aiChatbot = ref(defaultAiChatbot)
const aiCsat = ref(defaultAiCsat)

function setTimeRange(timeRange) {
  const data = generateWidgetData(timeRange)
  handledCalls.value = data.handledCalls
  avgCallDuration.value = data.avgCallDuration
  aiScorecards.value = data.aiScorecards
  unansweredCalls.value = data.unansweredCalls
  aiChatbot.value = data.aiChatbot
  aiCsat.value = data.aiCsat
}

function startLoading() {
  loading.value = true
  setTimeout(() => { loading.value = false }, 2000)
}

onMounted(() => { startLoading() })

defineExpose({ startLoading, setTimeRange })
</script>

<style scoped>
.widget-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 16px 16px;
}

.widget-row {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  gap: 16px;
}

.widget-row--flipped {
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
}

.widget-card {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-default);
  border-radius: 12px;
  padding: 16px;
  min-height: 340px;
}

/* Skeleton: donut card */
.skeleton-donut {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  height: 100%;
}

.skeleton-donut-circle {
  width: 200px;
  height: 200px;
}

.skeleton-donut-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

/* Skeleton: line chart card */
.skeleton-linechart {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.skeleton-linechart-chart {
  width: 100%;
  height: 180px;
}
</style>
