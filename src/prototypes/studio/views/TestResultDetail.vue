<template>
  <div style="padding: 24px;">
    <!-- Back to Tests Button -->
    <dt-button importance="clear" kind="muted" size="xs" icon-position="left" @click="backToTests" style="margin-bottom: 4px;">
      <template #icon><dt-icon name="arrow-left" size="200" /></template>
      Back to Tests
    </dt-button>

    <!-- Test Results Header -->
    <div style="margin-bottom: 32px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <span style="font-size: 12px; text-transform: uppercase; color: #999;">TEST RESULTS</span>
          <h1 style="font-size: 28px; font-weight: 600; margin: 8px 0 0 0;">{{ state.selectedTestResult.date }}</h1>
        </div>
        <div style="display: flex; gap: 12px;">
          <dt-button importance="clear">Share</dt-button>
          <dt-button importance="outlined">Download CSV</dt-button>
        </div>
      </div>

      <!-- Chart, Sentiment, and Synopsis Row -->
      <div style="display: flex; gap: 20px; align-items: flex-start;">
        <!-- Progress Circle -->
        <concentric-circle-chart :percentage="state.selectedTestResult.percentage" :size="64" />

        <!-- Sentiment, Completion, and Synopsis -->
        <div style="flex: 1; display: flex; flex-direction: column; gap: 12px;">
          <div>
            <span style="font-size: 18px; font-weight: 600;">{{ state.selectedTestResult.status }}</span>
            <span style="font-size: 14px; color: #666;"> • Task completion: {{ state.selectedTestResult.completion }}/{{ state.selectedTestResult.total }} ({{ state.selectedTestResult.percentage }}%)</span>
            <dt-icon name="phone" size="200" class="d-fc-muted" style="margin-left: 8px;" />
            <dt-icon name="message" size="200" class="d-fc-muted" style="margin-left: 8px;" />
          </div>
          <p style="font-size: 14px; color: #333; margin: 0;">{{ state.selectedTestResult.description }}</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div style="display: flex; gap: 12px; margin-bottom: 24px;">
      <dt-input placeholder="Search" style="flex: 1;">
        <template #leftIcon>
          <dt-icon name="search" size="300" />
        </template>
      </dt-input>
      <dt-select-menu v-model="state.selectedChannel" :options="channelOptions" />
      <dt-select-menu v-model="state.selectedSort" :options="sortOptions" />
    </div>

    <!-- Test Results Table -->
    <test-results-table :scenarios="state.selectedTestResult.scenarios" />
  </div>
</template>

<script setup>
import { DtButton, DtIcon, DtInput, DtSelectMenu } from '../components/ui'
import ConcentricCircleChart from '../components/charts/ConcentricCircleChart.vue'
import TestResultsTable from '../components/testing/TestResultsTable.vue'
import { channelOptions, sortOptions } from '../config/tabsConfig.js'
import { state } from '../state.js'
import { useNavigation } from '../composables/useNavigation.js'

const { backToTests } = useNavigation()
</script>
