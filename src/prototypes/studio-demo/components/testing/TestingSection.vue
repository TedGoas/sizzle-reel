<template>
  <div>
    <div v-if="!selected" class="testing">
      <div class="head">
        <div>
          <h2>Testing</h2>
          <p>Test your agent before it handles real world scenarios</p>
        </div>
        <div class="actions">
          <div class="action-row">
            <button
              v-if="!scenarios.length"
              type="button"
              class="sd-btn sd-btn--primary"
              :disabled="generating || running"
              @click="generate"
            >
              Generate new test
            </button>
            <template v-else>
              <button type="button" class="sd-btn sd-btn--clear" :disabled="running" @click="generate">
                Regenerate scenarios
              </button>
              <div class="channel">
                <button type="button" class="sd-btn sd-btn--outlined" :disabled="running" @click="channelOpen = !channelOpen">
                  {{ state.channel }}
                  <Icon name="chevron-down" :size="12" />
                </button>
                <div v-if="channelOpen" class="sd-menu" role="menu">
                  <button
                    v-for="choice in channelChoices"
                    :key="choice"
                    type="button"
                    role="menuitem"
                    :aria-current="choice === state.channel ? 'true' : undefined"
                    @click="pickChannel(choice)"
                  >
                    {{ choice }}
                  </button>
                </div>
              </div>
              <button type="button" class="sd-btn sd-btn--primary" :disabled="!state.selected.length || running" @click="run">
                {{ testLabel }}
              </button>
            </template>
          </div>
        </div>
      </div>

      <div v-if="generating" class="banner" role="status">
        <div>
          <strong>Generating test scenarios</strong>
          <p>Our AI is analyzing your agent to create relevant test cases...</p>
        </div>
      </div>
      <div v-else-if="running" class="banner" role="status">
        <span class="spinner" aria-hidden="true" />
        <div>
          <strong>Running tests</strong>
          <p>This should take 5 to 10 minutes. You can leave this page. We’ll let you know when it’s done.</p>
        </div>
      </div>

      <div v-if="scenarios.length && !running" class="sd-card table-card">
        <div class="table-title">Generated scenarios — {{ today }}</div>
        <table>
          <thead>
            <tr>
              <th class="check">
                <input ref="allBox" type="checkbox" :checked="allSelected" aria-label="Select all scenarios" @change="toggleAll" />
              </th>
              <th>Scenario</th>
              <th>Skills</th>
              <th class="num">Complexity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="scenario in scenarios" :key="scenario.id" @click="toggle(scenario.id)">
              <td class="check" @click.stop>
                <input type="checkbox" :checked="state.selected.includes(scenario.id)" :aria-label="`Select ${scenario.description}`" @change="toggle(scenario.id)" />
              </td>
              <td>{{ scenario.description }}</td>
              <td>
                <span v-for="skill in scenario.skills" :key="skill" class="sd-chip">{{ skill }}</span>
              </td>
              <td class="num">{{ scenario.complexity }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!scenarios.length && !generating" class="filters">
        <label class="sd-field">
          <Icon name="search" :size="16" />
          <input placeholder="Search" disabled />
        </label>
        <button type="button" class="sd-btn sd-btn--outlined" disabled>All channels</button>
        <button type="button" class="sd-btn sd-btn--outlined" disabled>Sort by</button>
      </div>

      <h3>Testing Results</h3>
      <div class="timeline">
        <button
          v-for="(result, index) in state.results"
          :key="result.id"
          type="button"
          class="sd-card result"
          @click="selected = result"
        >
          <span class="ring" :style="ringStyle(result, index)">
            <span>{{ result.percentage }}%</span>
          </span>
          <span class="result-copy">
            <span class="result-title">
              {{ result.status }}
              <span v-if="result.isNew" class="sd-chip">New</span>
              <span class="meta">Task completion: {{ result.completion }}/{{ result.total }} ({{ result.percentage }}%)</span>
            </span>
            <span class="channels">{{ result.channels.join(' · ') }}</span>
            <span class="synopsis">{{ result.description }}</span>
          </span>
        </button>
      </div>
    </div>

    <div v-else class="testing" :style="scenario ? { marginRight: '420px' } : null">
      <h2>Testing</h2>
      <div class="detail-head">
        <span class="ring ring--lg" :style="ringStyle(selected)">
          <span>{{ selected.percentage }}%</span>
        </span>
        <div>
          <h3>{{ selected.date }}</h3>
          <p class="status-line">
            {{ selected.status }}
            <span class="meta">{{ selected.completion }}/{{ selected.total }} scenarios passed</span>
          </p>
          <p>{{ selected.description }}</p>
        </div>
      </div>
      <div class="sd-card table-card">
        <table>
          <thead>
            <tr>
              <th>Result</th>
              <th>Scenario</th>
              <th>Details</th>
              <th>Channel</th>
              <th>Skills</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in selected.scenarios" :key="row.id" @click="scenario = row">
              <td :class="row.passFail === 'Pass' ? 'pass' : 'fail'">{{ row.passFail }}</td>
              <td>{{ row.scenario }}</td>
              <td>{{ row.details }}</td>
              <td>{{ row.channel }}</td>
              <td>
                <span
                  v-for="skill in row.skills"
                  :key="skill.name"
                  class="sd-chip"
                  :class="{ 'sd-chip--fail': !skill.passed }"
                >
                  {{ skill.name }}
                </span>
              </td>
              <td>{{ row.difficulty }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <DrawerTransition>
      <ScenarioDrawer v-if="scenario" :scenario="scenario" @close="scenario = null" />
    </DrawerTransition>

    <div v-if="toast" class="toast" role="status">
      <div>
        <strong>Testing complete</strong>
        <p>{{ toast.status }} · {{ toast.percentage }}% passed</p>
      </div>
      <button type="button" class="sd-btn sd-btn--primary sd-btn--sm" @click="openToast">View results</button>
      <button type="button" class="toast-close" aria-label="Dismiss" @click="toast = null">×</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import Icon from '../Icon.vue'
import ScenarioDrawer from './ScenarioDrawer.vue'
import DrawerTransition from '../DrawerTransition.vue'
import { buildTestResult, channelChoices, generateScenarios, testingFor } from '../../mock/testingData.js'

const props = defineProps({
  agentId: { type: [Number, String], required: true },
})

const state = testingFor(props.agentId)
const allBox = ref(null)
const generating = ref(false)
const running = ref(false)
const channelOpen = ref(false)
const selected = ref(null)
const scenario = ref(null)
const toast = ref(null)
let timer = 0

const scenarios = computed(() => state.scenarios)
const allSelected = computed(() => scenarios.value.length > 0 && state.selected.length === scenarios.value.length)
const someSelected = computed(() => state.selected.length > 0 && !allSelected.value)
const testLabel = computed(() => {
  const count = state.selected.length
  if (!count) return 'Select scenarios to test'
  return `Test ${count} scenario${count === 1 ? '' : 's'}`
})
const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

watchEffect(() => {
  if (allBox.value) allBox.value.indeterminate = someSelected.value
})

onUnmounted(() => clearTimeout(timer))

function wait(ms) {
  return new Promise((resolve) => {
    timer = setTimeout(resolve, ms)
  })
}

async function generate() {
  generating.value = true
  channelOpen.value = false
  if (state.channel === 'Select channels') state.channel = 'Voice and Digital'
  state.scenarios = []
  state.selected = []
  await wait(1200)
  const next = generateScenarios()
  state.scenarios = next
  state.selected = next.map((scenario) => scenario.id)
  generating.value = false
}

function pickChannel(choice) {
  state.channel = choice
  channelOpen.value = false
}

function toggle(id) {
  if (state.selected.includes(id)) state.selected = state.selected.filter((item) => item !== id)
  else state.selected = [...state.selected, id]
}

function toggleAll() {
  state.selected = allSelected.value ? [] : scenarios.value.map((scenario) => scenario.id)
}

async function run() {
  const chosen = state.scenarios.filter((scenario) => state.selected.includes(scenario.id))
  running.value = true
  channelOpen.value = false
  await wait(5000 + Math.floor(Math.random() * 5001))
  const result = buildTestResult(chosen, state.channel)
  state.results = [result, ...state.results.map((item) => ({ ...item, isNew: false }))]
  state.scenarios = []
  state.selected = []
  running.value = false
  toast.value = result
}

function ringStyle(result, index = 0) {
  return {
    '--pct': `${result.percentage}%`,
    '--tone': result.color,
    '--delay': `${index * 70}ms`,
  }
}

function openToast() {
  scenario.value = null
  selected.value = toast.value
  toast.value = null
}
</script>

<style scoped>
.testing {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-500);
}

.head, .action-row, .detail-head, .result {
  display: flex;
  gap: var(--dt-space-500);
}

.head, .table-title, .result-title {
  justify-content: space-between;
  align-items: flex-start;
}

h2, h3 {
  margin: 0;
  font-weight: 600;
}

h2 { font-size: var(--dt-font-size-300); }
h3 { font-size: var(--dt-font-size-200); }

p { margin: var(--dt-space-200) 0 0; color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-200); }

.actions { position: relative; }
.channel { position: relative; }

.banner {
  display: flex;
  align-items: center;
  gap: var(--dt-space-450);
  padding: var(--dt-space-500);
  border-radius: 8px;
  background: var(--dt-color-surface-brand-subtle);
}

.spinner {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border: 2px solid var(--dt-color-border-default);
  border-top-color: var(--dt-color-foreground-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.banner strong { display: block; }
.banner p { margin: var(--dt-space-200) 0 0; }

.filters { display: flex; gap: var(--dt-space-450); }
.filters .sd-field { flex: 1; max-width: 280px; }

.table-card { overflow: auto; }
.table-title {
  display: flex;
  padding: var(--dt-space-450) var(--dt-space-500);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  font-weight: 600;
}

table { width: 100%; border-collapse: collapse; }
th, td {
  padding: var(--dt-space-450) var(--dt-space-500);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  text-align: left;
  vertical-align: top;
  font-size: var(--dt-font-size-200);
}
th {
  background: var(--dt-color-surface-secondary);
  font-size: var(--dt-font-size-100);
}
tbody tr:last-child td { border-bottom: 0; }
.check { width: 40px; }
.num { text-align: right; }
td .sd-chip { margin: 0 var(--dt-space-200) var(--dt-space-200) 0; }
tbody tr { cursor: pointer; }

.timeline { display: flex; flex-direction: column; gap: var(--dt-space-450); }
.result {
  width: 100%;
  padding: var(--dt-space-500);
  text-align: left;
  font-family: inherit;
  color: inherit;
  cursor: pointer;
}
.result-copy { display: flex; flex-direction: column; gap: var(--dt-space-300); flex: 1; }
.result-title { display: flex; align-items: center; gap: var(--dt-space-300); font-weight: 600; }
.meta, .synopsis, .channels { color: var(--dt-color-foreground-tertiary); font-weight: 400; font-size: var(--dt-font-size-100); }
.channels { margin-left: auto; }

.ring {
  --pct: 0%;
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 50%;
  background: conic-gradient(var(--tone) var(--pct), var(--dt-color-surface-secondary) 0);
  animation: ring-fill 700ms cubic-bezier(0.65, 0, 0.35, 1) both;
  animation-delay: var(--delay, 0ms);
}
.ring span {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--dt-color-surface-primary);
  font-size: var(--dt-font-size-100);
  font-weight: 600;
}
.ring--lg { width: 84px; height: 84px; }
.ring--lg span { width: 64px; height: 64px; }

.detail-head { align-items: center; }
.status-line {
  display: flex;
  align-items: baseline;
  gap: var(--dt-space-300);
  margin: var(--dt-space-200) 0 0;
  font-weight: 600;
}
.pass { color: var(--dt-color-foreground-success); font-weight: 600; }
.fail { color: var(--dt-color-foreground-critical); font-weight: 600; }

.toast {
  position: fixed;
  right: var(--dt-space-550);
  bottom: var(--dt-space-550);
  z-index: 30;
  display: flex;
  align-items: center;
  gap: var(--dt-space-500);
  padding: var(--dt-space-450) var(--dt-space-500);
  background: var(--dt-color-foreground-primary);
  color: #fff;
  border-radius: 8px;
  box-shadow: var(--dt-shadow-medium);
}
.toast p { margin: 2px 0 0; color: #fff; font-size: var(--dt-font-size-100); }
.toast-close {
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

@keyframes ring-fill {
  from { --pct: 0%; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

<style>
@property --pct {
  syntax: '<percentage>';
  inherits: true;
  initial-value: 0%;
}
</style>
