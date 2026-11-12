<template>
  <div class="history">
    <header>
      <h2>History</h2>
      <p>Conversations this agent handled. Open a row to see the recap, flow, traces, logs, transcript, and metadata.</p>
    </header>

    <div class="toolbar">
      <label class="sd-field">
        <Icon name="search" :size="16" />
        <input v-model="query" type="search" placeholder="Search summary or skills" />
      </label>
      <label class="sd-field outcome">
        <select v-model="outcome">
          <option v-for="option in outcomeOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </label>
    </div>

    <div class="sd-card table-card">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Conversation summary</th>
            <th>Channel</th>
            <th>Entry</th>
            <th>Outcome</th>
            <th>CSAT</th>
            <th>Skills</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!rows.length">
            <td colspan="7" class="empty">No conversations match.</td>
          </tr>
          <tr v-for="row in rows" :key="row.id" :class="{ active: conversation?.id === row.id }" @click="open(row, 'recap')">
            <td class="nowrap">
              <div>{{ row.date }}</div>
              <div class="meta">{{ row.time }}</div>
            </td>
            <td>
              <div class="title">{{ row.title }}</div>
              <div class="meta">{{ row.summary }}</div>
            </td>
            <td>{{ row.channel }}</td>
            <td>{{ row.entry }}</td>
            <td>{{ row.outcome }}</td>
            <td>{{ row.aiCsat }}</td>
            <td>
              <button
                v-for="skill in row.skills"
                :key="skill"
                type="button"
                class="sd-chip"
                :class="{ 'sd-chip--fail': row.failedSkills.includes(skill) }"
                @click.stop="open(row, row.failedSkills.includes(skill) ? 'traces' : 'recap', row.failedSkills.includes(skill))"
              >
                {{ skill }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <DrawerTransition>
      <ConversationDrawer
        v-if="conversation"
        :conversation="conversation"
        :tab="tab"
        :focus-failure="focusFailure"
        @close="conversation = null"
        @tab="chooseTab"
      />
    </DrawerTransition>
  </div>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'
import Icon from '../Icon.vue'
import ConversationDrawer from './ConversationDrawer.vue'
import DrawerTransition from '../DrawerTransition.vue'
import { conversations, outcomeOptions } from '../../mock/historyData.js'

defineProps({
  agent: { type: Object, required: true },
})

const query = ref('')
const outcome = ref('All outcomes')
const conversation = ref(null)
const tab = ref('recap')
const focusFailure = ref(false)

const rows = computed(() => {
  const needle = query.value.trim().toLowerCase()
  return conversations.filter((row) => {
    const outcomeOk = outcome.value === 'All outcomes' || row.outcome === outcome.value
    if (!outcomeOk) return false
    if (!needle) return true
    const haystack = `${row.title} ${row.summary} ${row.skills.join(' ')}`.toLowerCase()
    return haystack.includes(needle)
  })
})

function open(row, nextTab, failed = false) {
  conversation.value = row
  tab.value = nextTab
  focusFailure.value = false
  if (failed) nextTick(() => { focusFailure.value = true })
}

function chooseTab(id) {
  tab.value = id
  focusFailure.value = false
}
</script>

<style scoped>
.history {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-500);
}
h2 { margin: 0; font-size: var(--dt-font-size-300); font-weight: 600; }
header p { margin: var(--dt-space-200) 0 0; color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-200); }
.toolbar { display: flex; gap: var(--dt-space-450); }
.sd-field { flex: 1; max-width: 320px; }
.outcome { flex: 0 0 180px; padding-right: var(--dt-space-200); }
select {
  width: 100%;
  border: 0;
  background: transparent;
  color: var(--dt-color-foreground-primary);
  font-family: inherit;
  font-size: var(--dt-font-size-200);
}
.table-card { overflow: auto; }
table { width: 100%; border-collapse: collapse; }
th, td {
  padding: var(--dt-space-400) var(--dt-space-450);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  text-align: left;
  vertical-align: top;
  font-size: var(--dt-font-size-100);
}
th { background: var(--dt-color-surface-secondary); font-weight: 600; }
tbody tr { cursor: pointer; }
tbody tr:hover { background: var(--dt-color-surface-secondary); }
tbody tr.active,
tbody tr.active:hover { background: var(--dt-color-surface-brand-subtle); }
.title { font-weight: 600; font-size: var(--dt-font-size-200); }
.meta { margin-top: 2px; color: var(--dt-color-foreground-tertiary); }
.nowrap { white-space: nowrap; }
td .sd-chip { margin: 0 var(--dt-space-200) var(--dt-space-200) 0; cursor: pointer; font-family: inherit; }
.empty { color: var(--dt-color-foreground-tertiary); cursor: default; }
</style>
