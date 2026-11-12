<template>
  <SideDrawer
    v-if="conversation"
    :title="conversation.title"
    title-id="history-panel-title"
    :content-key="conversation.id"
    @close="emit('close')"
    @resize="emit('resize', $event)"
    @resizing="emit('resizing', $event)"
  >
    <template #meta>
      <span>{{ conversation.date }}, {{ conversation.time }}</span>
      <span class="dot" />
      <span>{{ conversation.channel }}</span>
    </template>
    <template #nav>
      <div class="tabs" role="tablist">
        <button
          v-for="item in tabs"
          :key="item.id"
          type="button"
          role="tab"
          :aria-selected="tab === item.id"
          :class="{ active: tab === item.id }"
          @click="emit('tab', item.id)"
        >
          {{ item.label }}
        </button>
      </div>
    </template>

      <section v-if="tab === 'recap'" class="recap">
        <div class="badges">
          <span class="sd-chip">{{ conversation.outcome }}</span>
          <span v-if="conversation.escalationReason" class="sd-chip">{{ conversation.escalationReason }}</span>
          <span class="sd-chip">AI CSAT {{ conversation.aiCsat }}</span>
          <span class="sd-chip">{{ conversation.handleTime }}</span>
        </div>
        <p class="summary">{{ conversation.extendedSummary }}</p>
        <div class="recap-section">
          <h3>What happened</h3>
          <ul class="actions">
            <li v-for="moment in conversation.moments" :key="moment">{{ moment }}</li>
          </ul>
        </div>
        <div class="recap-section">
          <h3>Action items</h3>
          <ul class="actions">
            <li v-for="item in conversation.actionItems" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div class="recap-section">
          <h3>Call purposes</h3>
          <div class="badges">
            <span v-for="purpose in conversation.purposes" :key="purpose" class="sd-chip">{{ purpose }}</span>
          </div>
        </div>
        <div class="recap-section">
          <h3>Topics</h3>
          <div class="topics">
            <button
              v-for="(topic, index) in conversation.topics"
              :key="topic.title"
              type="button"
              class="topic"
              @click="toggleTopic(index)"
            >
              <span class="topic-title">{{ openTopics.has(index) ? '▾' : '▸' }} {{ topic.title }}</span>
              <span v-if="openTopics.has(index)" class="topic-body">{{ topic.description }}</span>
            </button>
          </div>
        </div>
        <div class="recap-section">
          <h3>Session context</h3>
          <p class="inline">
            <span>{{ conversation.traces.events.length }} items extracted</span>
            <button type="button" class="link" @click="emit('tab', 'traces')">View on Traces</button>
          </p>
        </div>
        <div class="recap-section">
          <h3>Skills</h3>
          <div class="badges">
            <button
              v-for="skill in conversation.skills"
              :key="skill"
              type="button"
              class="sd-chip"
              :class="{ 'sd-chip--fail': conversation.failedSkills.includes(skill) }"
              @click="conversation.failedSkills.includes(skill) && emit('tab', 'traces')"
            >
              {{ skill }}
            </button>
          </div>
        </div>
      </section>

      <section v-else-if="tab === 'flow'" class="flow">
        <div class="flow-bar">
          <span class="sd-chip">{{ conversation.flow.status }}</span>
          <span class="meta">{{ conversation.flow.meta }}</span>
          <button v-if="conversation.flow.failPath.length" type="button" class="sd-btn sd-btn--outlined sd-btn--sm" @click="showFail = !showFail">
            {{ showFail ? 'Hide failure path' : 'Show failure path' }}
          </button>
          <span v-if="showFail" class="fail-note">failure led to escalation</span>
        </div>
        <div
          class="canvas"
          :class="{ panning }"
          @mousedown="startPan"
        >
          <div class="canvas-inner" :style="{ transform: `translate(${pan.x}px, ${pan.y}px)` }">
            <svg class="wires" aria-hidden="true">
              <line
                v-for="edge in edges"
                :key="edge.key"
                :x1="edge.x1"
                :y1="edge.y1"
                :x2="edge.x2"
                :y2="edge.y2"
                :class="{ fail: showFail && edge.fail }"
              />
            </svg>
            <div
              v-for="node in conversation.flow.nodes"
              :key="node.id"
              class="node"
              :class="[node.kind, { hot: showFail && failIds.has(node.id) }]"
              :style="{ left: node.x + 'px', top: node.y + 'px' }"
            >
              <span class="node-kind">{{ kindName(node.kind) }}</span>
              <span>{{ node.label }}</span>
            </div>
          </div>
        </div>
      </section>

      <TracesPanel
        v-else-if="tab === 'traces'"
        :traces="conversation.traces"
        :focus-failure="focusFailure"
      />

      <section v-else-if="tab === 'logs'" class="logs">
        <input class="finder" type="search" placeholder="Search logs" aria-label="Search logs" />
        <table>
          <thead>
            <tr>
              <th><button type="button">Time <span aria-hidden="true">▾</span></button></th>
              <th><button type="button">Level <span aria-hidden="true">▾</span></button></th>
              <th><button type="button">Source <span aria-hidden="true">▾</span></button></th>
              <th><button type="button">Message <span aria-hidden="true">▾</span></button></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in conversation.logs" :key="index">
              <td>{{ row.time }}</td>
              <td>{{ row.level }}</td>
              <td>{{ row.source }}</td>
              <td>{{ row.message }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-else-if="tab === 'transcript'" class="transcript">
        <article v-for="(line, index) in conversation.transcript" :key="index" :class="line.speaker.toLowerCase()">
          <span>{{ line.time }} · {{ line.speaker }}</span>
          <p>{{ line.text }}</p>
        </article>
      </section>

      <section v-else class="details">
        <div class="meta-list">
          <div><span>Conversation ID</span><strong>{{ conversation.metadata.conversationId }}</strong></div>
          <div><span>Started</span><strong>{{ conversation.metadata.started }}</strong></div>
          <div><span>Call ID</span><strong>{{ conversation.metadata.callId }}</strong></div>
          <div><span>Agent ID</span><strong>{{ conversation.metadata.agentId }}</strong></div>
          <div><span>Office</span><strong>{{ conversation.metadata.office }}</strong></div>
          <div><span>Channel</span><strong>{{ conversation.channel }}</strong></div>
          <div><span>Entry point</span><strong>{{ conversation.entry }}</strong></div>
        </div>
        <div class="session">
          <button type="button" class="session-toggle" @click="sessionOpen = !sessionOpen">
            {{ sessionOpen ? '▾' : '▸' }} Session
          </button>
          <div v-if="sessionOpen" class="meta-list">
            <div><span>Audio</span><strong>{{ conversation.session.audio }}</strong></div>
            <div><span>Participants</span><strong>{{ conversation.session.participants.join(', ') }}</strong></div>
            <div><span>Tools</span><strong>{{ conversation.session.tools.join(', ') }}</strong></div>
            <div v-if="conversation.session.transfer"><span>Transfer</span><strong>{{ conversation.session.transfer }}</strong></div>
          </div>
        </div>
      </section>
  </SideDrawer>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import SideDrawer from '../SideDrawer.vue'
import TracesPanel from './TracesPanel.vue'

const props = defineProps({
  conversation: { type: Object, default: null },
  tab: { type: String, default: 'recap' },
  focusFailure: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'tab', 'resize', 'resizing'])

const tabs = [
  { id: 'recap', label: 'Recap' },
  { id: 'flow', label: 'Flow run' },
  { id: 'traces', label: 'Traces' },
  { id: 'logs', label: 'Logs' },
  { id: 'transcript', label: 'Transcript' },
  { id: 'metadata', label: 'Metadata' },
]

const openTopics = ref(new Set())
const sessionOpen = ref(true)
const showFail = ref(false)
const pan = ref({ x: 24, y: 12 })
const panning = ref(false)

watch(() => props.conversation?.id, () => {
  openTopics.value = new Set()
  showFail.value = false
  pan.value = { x: 24, y: 12 }
})

const nodeMap = computed(() => {
  const map = {}
  props.conversation?.flow.nodes.forEach((node) => { map[node.id] = node })
  return map
})

const failIds = computed(() => {
  const ids = new Set()
  props.conversation?.flow.failPath.forEach(([from, to]) => {
    ids.add(from)
    ids.add(to)
  })
  return ids
})

const NODE_W = 180
const NODE_H = 64

const kindNames = {
  start: 'Start',
  skill: 'Skill',
  tool: 'Action',
  end: 'End',
  fail: 'Failed',
}

function kindName(kind) {
  return kindNames[kind] || kind
}

const edges = computed(() => {
  if (!props.conversation) return []
  const fail = new Set(props.conversation.flow.failPath.map(([from, to]) => `${from}-${to}`))
  return props.conversation.flow.edges.map(([from, to]) => {
    const a = nodeMap.value[from]
    const b = nodeMap.value[to]
    const sideBySide = Math.abs(a.y - b.y) < NODE_H && b.x > a.x
    return {
      key: `${from}-${to}`,
      x1: sideBySide ? a.x + NODE_W : a.x + NODE_W / 2,
      y1: sideBySide ? a.y + NODE_H / 2 : a.y + NODE_H,
      x2: sideBySide ? b.x : b.x + NODE_W / 2,
      y2: sideBySide ? b.y + NODE_H / 2 : b.y,
      fail: fail.has(`${from}-${to}`),
    }
  })
})

function toggleTopic(index) {
  const next = new Set(openTopics.value)
  if (next.has(index)) next.delete(index)
  else next.add(index)
  openTopics.value = next
}

function startPan(event) {
  if (event.button !== 0 || event.target.closest('button')) return
  panning.value = true
  const originX = event.clientX - pan.value.x
  const originY = event.clientY - pan.value.y
  function move(moveEvent) {
    pan.value = { x: moveEvent.clientX - originX, y: moveEvent.clientY - originY }
  }
  function up() {
    panning.value = false
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}
</script>

<style scoped>
.meta .dot { width: 3px; height: 3px; border-radius: 50%; background: var(--dt-color-foreground-muted); }
.meta { display: flex; align-items: center; gap: var(--dt-space-300); margin: var(--dt-space-200) 0 0; color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-100); }

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-200);
  padding: 0 var(--dt-space-550);
  border-bottom: 1px solid var(--dt-color-border-subtle);
}
.tabs button {
  padding: var(--dt-space-400) var(--dt-space-200);
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--dt-color-foreground-tertiary);
  font-family: inherit;
  font-size: var(--dt-font-size-200);
  cursor: pointer;
}
.tabs button.active {
  border-bottom-color: var(--dt-color-surface-brand);
  color: var(--dt-color-foreground-primary);
  font-weight: 600;
}

.transcript, .meta-list { display: flex; flex-direction: column; gap: var(--dt-space-400); }
.badges { display: flex; flex-wrap: wrap; gap: var(--dt-space-200); }
.recap { display: flex; flex-direction: column; gap: var(--dt-space-600); }
.recap-section { display: flex; flex-direction: column; gap: var(--dt-space-300); }
.recap h3 {
  margin: 0;
  color: var(--dt-color-foreground-primary);
  font-size: var(--dt-font-size-200);
  font-weight: 700;
  line-height: 1.4;
}
.summary {
  margin: 0;
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-200);
  line-height: 1.6;
}
.actions {
  margin: 0;
  padding-left: 1.2em;
  list-style: disc;
}
.actions li {
  margin: 0;
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-200);
}
.actions li + li { margin-top: var(--dt-space-300); }
.topics {
  overflow: hidden;
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: 8px;
}
.topic {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--dt-space-200);
  width: 100%;
  padding: var(--dt-space-400);
  border: 0;
  border-bottom: 1px solid var(--dt-color-border-subtle);
  background: transparent;
  color: var(--dt-color-foreground-primary);
  font-family: inherit;
  font-size: var(--dt-font-size-200);
  text-align: left;
  cursor: pointer;
}
.topic:last-child { border-bottom: 0; }
.topic-title { font-weight: 600; }
.topic-body { color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-100); line-height: 1.5; }
.inline {
  display: flex;
  justify-content: space-between;
  gap: var(--dt-space-400);
  margin: 0;
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-200);
}
.link {
  border: 0;
  background: transparent;
  color: var(--dt-color-link-primary);
  font-family: inherit;
  font-size: var(--dt-font-size-100);
  cursor: pointer;
}
.badges .sd-chip { font-family: inherit; cursor: pointer; }

.flow { display: flex; flex-direction: column; gap: var(--dt-space-400); }
.flow-bar { display: flex; align-items: center; gap: var(--dt-space-400); flex-wrap: wrap; }
.canvas {
  position: relative;
  height: 560px;
  overflow: hidden;
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: 8px;
  background-color: var(--dt-color-surface-secondary);
  background-image: radial-gradient(var(--dt-color-border-default) 1px, transparent 1px);
  background-size: 16px 16px;
  cursor: grab;
}
.canvas.panning { cursor: grabbing; }
.canvas-inner { position: absolute; inset: 0; }
.wires { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.wires line { stroke: var(--dt-color-border-moderate); stroke-width: 2; }
.wires line.fail { stroke: var(--dt-color-foreground-critical); stroke-width: 3; }
.node {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  box-sizing: border-box;
  width: 180px;
  height: 64px;
  padding: 0 var(--dt-space-400);
  border: 1px solid var(--dt-color-border-default);
  border-radius: 8px;
  background: var(--dt-color-surface-primary);
  font-size: var(--dt-font-size-100);
  font-weight: 600;
}
.node-kind {
  color: var(--dt-color-foreground-tertiary);
  font-size: var(--dt-font-size-100);
  font-weight: 600;
}
.node.fail {
  border-color: var(--dt-color-foreground-critical);
  color: var(--dt-color-foreground-critical);
}
.node.fail .node-kind { color: var(--dt-color-foreground-critical); }
.node.hot { box-shadow: 0 0 0 3px color-mix(in srgb, var(--dt-color-foreground-critical) 25%, transparent); }
.fail-note {
  color: var(--dt-color-foreground-critical);
  font-size: var(--dt-font-size-100);
  font-weight: 600;
}

.transcript article {
  padding: var(--dt-space-400);
  border-radius: 8px;
  background: var(--dt-color-surface-secondary);
}
.transcript .agent { background: var(--dt-color-surface-brand-subtle); }
.transcript .system { background: transparent; border: 1px solid var(--dt-color-border-subtle); }
.transcript span { font-size: var(--dt-font-size-100); font-weight: 600; }
.transcript p {
  margin: var(--dt-space-200) 0 0;
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-200);
}
.finder {
  width: 100%;
  height: var(--btn-height-md);
  padding: 0 var(--dt-space-400);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-300);
  background: var(--dt-color-surface-primary);
  color: var(--dt-color-foreground-primary);
  font-family: inherit;
  font-size: var(--dt-font-size-100);
}
.logs { display: flex; flex-direction: column; gap: var(--dt-space-400); }
.logs table { width: 100%; border-collapse: collapse; }
.logs th, .logs td {
  padding: var(--dt-space-300) var(--dt-space-400);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-100);
  font-weight: 400;
  text-align: left;
  vertical-align: top;
}
.logs th button {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-200);
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--dt-color-foreground-tertiary);
  font-family: inherit;
  font-size: var(--dt-font-size-100);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: default;
}
.logs td:last-child { color: var(--dt-color-foreground-primary); }
.details { display: flex; flex-direction: column; align-items: stretch; gap: var(--dt-space-600); }
.session { display: flex; flex-direction: column; align-items: stretch; gap: var(--dt-space-300); }
.session-toggle {
  align-self: flex-start;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--dt-color-foreground-primary);
  font-family: inherit;
  font-size: var(--dt-font-size-200);
  font-weight: 700;
  cursor: pointer;
}
.meta-list > div {
  display: flex;
  justify-content: space-between;
  gap: var(--dt-space-500);
  padding: var(--dt-space-400) 0;
  border-bottom: 1px solid var(--dt-color-border-subtle);
  font-size: var(--dt-font-size-200);
}
.meta-list span { color: var(--dt-color-foreground-tertiary); }
</style>
