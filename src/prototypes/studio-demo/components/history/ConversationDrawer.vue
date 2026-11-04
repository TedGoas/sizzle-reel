<template>
  <div
    v-if="conversation"
    class="drawer"
    :style="{ width: width + 'px' }"
    role="dialog"
    aria-labelledby="history-panel-title"
  >
    <button type="button" class="resize" aria-label="Resize conversation panel" @mousedown="startResize" />
    <header>
      <button type="button" class="close" aria-label="Close" @click="emit('close')">×</button>
      <h2 id="history-panel-title">{{ conversation.title }}</h2>
      <p class="meta">
        <span>{{ conversation.date }}, {{ conversation.time }}</span>
        <span class="dot" />
        <span>{{ conversation.channel }}</span>
      </p>
    </header>
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
    <div class="body">
      <section v-if="tab === 'recap'" class="stack">
        <div class="badges">
          <span class="sd-chip">{{ conversation.outcome }}</span>
          <span v-if="conversation.escalationReason" class="sd-chip">{{ conversation.escalationReason }}</span>
          <span class="sd-chip">AI CSAT {{ conversation.aiCsat }}</span>
          <span class="sd-chip">{{ conversation.handleTime }}</span>
        </div>
        <p>{{ conversation.extendedSummary }}</p>
        <h3>Action items</h3>
        <ol>
          <li v-for="item in conversation.actionItems" :key="item">{{ item }}</li>
        </ol>
        <h3>Call purposes</h3>
        <div class="badges">
          <span v-for="purpose in conversation.purposes" :key="purpose" class="sd-chip">{{ purpose }}</span>
        </div>
        <h3>Topics</h3>
        <button
          v-for="(topic, index) in conversation.topics"
          :key="topic.title"
          type="button"
          class="topic"
          @click="toggleTopic(index)"
        >
          <span>{{ openTopics.has(index) ? '▾' : '▸' }} {{ topic.title }}</span>
          <span v-if="openTopics.has(index)" class="topic-body">{{ topic.description }}</span>
        </button>
        <h3>Session context</h3>
        <p class="inline">
          <span>{{ conversation.traces.events.length }} items extracted</span>
          <button type="button" class="link" @click="emit('tab', 'traces')">View on Traces</button>
        </p>
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
              {{ node.label }}
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="tab === 'traces'" class="stack">
        <div class="stats">
          <article>
            <span>Resolution</span>
            <strong>{{ conversation.traces.resolution }}</strong>
            <em>{{ conversation.traces.resolutionSub }}</em>
          </article>
          <article>
            <span>Agent work</span>
            <strong>{{ conversation.traces.skills }} skills · {{ conversation.traces.actions }} actions</strong>
            <button v-if="conversation.traces.failedActions" type="button" class="link" @click="seekFail">
              {{ conversation.traces.failedActions }} action failed
            </button>
            <em v-else>No failed actions</em>
          </article>
          <article>
            <span>Audio quality</span>
            <strong>{{ conversation.traces.audio }}</strong>
            <em>{{ conversation.traces.audioSub }}</em>
          </article>
        </div>
        <div class="player">
          <div class="player-title">Recording</div>
          <button type="button" class="track" :aria-label="`Seek recording, ${timeLabel}`" @click="seekTrack">
            <span class="played" :style="{ width: timePct }" />
            <span
              v-for="event in conversation.traces.events"
              :key="event.t + event.label"
              class="dot"
              :class="event.kind + (event.ok === false ? ' fail' : '')"
              :style="{ left: pct(event.t) }"
            />
            <span class="playhead" :style="{ left: timePct }" />
          </button>
          <div class="ruler">
            <span>0:00</span>
            <span>{{ timeLabel }}</span>
            <span>{{ clock(conversation.traces.duration) }}</span>
          </div>
          <div class="badges">
            <button type="button" class="sd-chip" @click="seekKind('skill')">Skills</button>
            <button v-if="failEvent" type="button" class="sd-chip sd-chip--fail" @click="seekFail">Failures</button>
          </div>
        </div>
        <ul class="events">
          <li v-for="event in conversation.traces.events" :key="event.t + event.label" :class="{ current: event.t <= playhead }">
            <button type="button" @click="playhead = event.t">
              <span class="when">{{ clock(event.t) }}</span>
              <span class="kind">{{ event.kind }}</span>
              <span>{{ event.label }}</span>
              <span v-if="event.ok === false" class="fail-text">{{ event.detail }}</span>
              <span v-else-if="event.ok" class="ok">ok</span>
            </button>
          </li>
        </ul>
      </section>

      <section v-else-if="tab === 'transcript'" class="transcript">
        <article v-for="(line, index) in conversation.transcript" :key="index" :class="line.speaker === 'Agent' ? 'agent' : 'customer'">
          <span>{{ line.speaker }}</span>
          <p>{{ line.text }}</p>
        </article>
      </section>

      <section v-else class="meta-list">
        <div><span>Conversation ID</span><strong>{{ conversation.metadata.conversationId }}</strong></div>
        <div><span>Started</span><strong>{{ conversation.metadata.started }}</strong></div>
        <div><span>Call ID</span><strong>{{ conversation.metadata.callId }}</strong></div>
        <div><span>Agent ID</span><strong>{{ conversation.metadata.agentId }}</strong></div>
        <div><span>Office</span><strong>{{ conversation.metadata.office }}</strong></div>
        <div><span>Channel</span><strong>{{ conversation.channel }}</strong></div>
        <div><span>Entry point</span><strong>{{ conversation.entry }}</strong></div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { preferredDrawerWidth } from '../../mock/historyData.js'

const props = defineProps({
  conversation: { type: Object, default: null },
  tab: { type: String, default: 'recap' },
})

const emit = defineEmits(['close', 'tab', 'resize'])

const tabs = [
  { id: 'recap', label: 'Recap' },
  { id: 'flow', label: 'Flow run' },
  { id: 'traces', label: 'Traces' },
  { id: 'transcript', label: 'Transcript' },
  { id: 'metadata', label: 'Metadata' },
]

const width = ref(preferredDrawerWidth())

onMounted(() => emit('resize', width.value))
const openTopics = ref(new Set())
const showFail = ref(false)
const playhead = ref(0)
const pan = ref({ x: 24, y: 12 })
const panning = ref(false)

watch(() => props.conversation?.id, () => {
  openTopics.value = new Set()
  showFail.value = false
  playhead.value = 0
  pan.value = { x: 24, y: 12 }
})

const failEvent = computed(() => props.conversation?.traces.events.find((event) => event.ok === false))
const timePct = computed(() => pct(playhead.value))
const timeLabel = computed(() => clock(playhead.value))

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

const edges = computed(() => {
  if (!props.conversation) return []
  const fail = new Set(props.conversation.flow.failPath.map(([from, to]) => `${from}-${to}`))
  return props.conversation.flow.edges.map(([from, to]) => {
    const a = nodeMap.value[from]
    const b = nodeMap.value[to]
    return {
      key: `${from}-${to}`,
      x1: a.x + 96,
      y1: a.y + 28,
      x2: b.x + 96,
      y2: b.y + 18,
      fail: fail.has(`${from}-${to}`),
    }
  })
})

function pct(seconds) {
  const duration = props.conversation?.traces.duration || 1
  return `${Math.min(100, (seconds / duration) * 100)}%`
}

function clock(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${String(secs).padStart(2, '0')}`
}

function toggleTopic(index) {
  const next = new Set(openTopics.value)
  if (next.has(index)) next.delete(index)
  else next.add(index)
  openTopics.value = next
}

function seekTrack(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
  playhead.value = Math.round(ratio * props.conversation.traces.duration)
}

function seekKind(kind) {
  const event = props.conversation.traces.events.find((item) => item.kind === kind)
  if (event) playhead.value = event.t
}

function seekFail() {
  if (failEvent.value) playhead.value = failEvent.value.t
}

function startResize(event) {
  event.preventDefault()
  const startX = event.clientX
  const startWidth = width.value
  function move(moveEvent) {
    width.value = Math.min(1100, Math.max(400, startWidth + (startX - moveEvent.clientX)))
    emit('resize', width.value)
  }
  function up() {
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
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
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 25;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--dt-color-surface-primary);
  border-left: 1px solid var(--dt-color-border-default);
  box-shadow: var(--dt-shadow-medium);
}

.resize {
  position: absolute;
  top: 0;
  left: -4px;
  width: 8px;
  height: 100%;
  border: 0;
  background: transparent;
  cursor: ew-resize;
}

header { position: relative; padding: var(--dt-space-500) var(--dt-space-550) var(--dt-space-400); }
.close {
  position: absolute;
  top: var(--dt-space-400);
  right: var(--dt-space-400);
  width: var(--btn-height-icon);
  height: var(--btn-height-icon);
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dt-color-foreground-secondary);
  font-size: 20px;
  cursor: pointer;
}
h2 { margin: 0 var(--dt-space-600) 0 0; font-size: var(--dt-font-size-300); font-weight: 600; }
.meta { display: flex; align-items: center; gap: var(--dt-space-300); margin: var(--dt-space-200) 0 0; color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-100); }
.meta .dot { width: 3px; height: 3px; border-radius: 50%; background: var(--dt-color-foreground-muted); }

.tabs {
  display: flex;
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

.body { flex: 1; overflow: auto; padding: var(--dt-space-500) var(--dt-space-550) var(--dt-space-600); }
.stack, .transcript, .meta-list { display: flex; flex-direction: column; gap: var(--dt-space-400); }
.badges { display: flex; flex-wrap: wrap; gap: var(--dt-space-200); }
h3 { margin: var(--dt-space-300) 0 0; font-size: var(--dt-font-size-200); }
p, li { margin: 0; color: var(--dt-color-foreground-secondary); font-size: var(--dt-font-size-200); }
ol { margin: 0; padding-left: 1.2em; }
.topic {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--dt-space-200);
  padding: var(--dt-space-300) 0;
  border: 0;
  border-bottom: 1px solid var(--dt-color-border-subtle);
  background: transparent;
  color: var(--dt-color-foreground-primary);
  font-family: inherit;
  font-size: var(--dt-font-size-200);
  text-align: left;
  cursor: pointer;
}
.topic-body { color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-100); }
.inline { display: flex; justify-content: space-between; gap: var(--dt-space-400); }
.link {
  border: 0;
  background: transparent;
  color: var(--dt-color-link-primary);
  font-family: inherit;
  font-size: var(--dt-font-size-100);
  cursor: pointer;
}
.badges .sd-chip { font-family: inherit; cursor: pointer; }

.flow { display: flex; flex-direction: column; height: 100%; min-height: 420px; gap: var(--dt-space-400); }
.flow-bar { display: flex; align-items: center; gap: var(--dt-space-400); flex-wrap: wrap; }
.canvas {
  position: relative;
  flex: 1;
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
  width: 180px;
  padding: var(--dt-space-400);
  border: 1px solid var(--dt-color-border-default);
  border-radius: 8px;
  background: var(--dt-color-surface-primary);
  font-size: var(--dt-font-size-100);
  font-weight: 600;
}
.node.fail { border-color: var(--dt-color-foreground-critical); color: var(--dt-color-foreground-critical); }
.node.hot { box-shadow: 0 0 0 3px color-mix(in srgb, var(--dt-color-foreground-critical) 25%, transparent); }
.fail-note {
  color: var(--dt-color-foreground-critical);
  font-size: var(--dt-font-size-100);
  font-weight: 600;
}

.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--dt-space-400); }
.stats article {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--dt-space-400);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: 8px;
}
.stats span, .stats em { color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-100); font-style: normal; }
.stats strong { font-size: var(--dt-font-size-200); }
.player { display: flex; flex-direction: column; gap: var(--dt-space-300); }
.player-title { font-weight: 600; }
.track {
  position: relative;
  height: 28px;
  border: 0;
  border-radius: 999px;
  background: var(--dt-color-surface-secondary);
  cursor: pointer;
}
.played {
  position: absolute;
  left: 0;
  top: 10px;
  height: 8px;
  border-radius: 999px;
  background: var(--dt-color-surface-brand);
}
.track .dot {
  position: absolute;
  top: 9px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--dt-color-foreground-muted);
  transform: translateX(-50%);
}
.track .dot.skill { background: var(--dt-color-surface-brand); }
.track .dot.action { background: var(--dt-color-foreground-success); }
.track .dot.fail, .track .dot.action.fail { background: var(--dt-color-foreground-critical); }
.playhead {
  position: absolute;
  top: 2px;
  width: 2px;
  height: 24px;
  background: var(--dt-color-foreground-primary);
  transform: translateX(-50%);
}
.ruler { display: flex; justify-content: space-between; color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-100); }
.events { list-style: none; margin: 0; padding: 0; }
.events button {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-300);
  width: 100%;
  padding: var(--dt-space-300) 0;
  border: 0;
  border-bottom: 1px solid var(--dt-color-border-subtle);
  background: transparent;
  color: var(--dt-color-foreground-muted);
  font-family: inherit;
  font-size: var(--dt-font-size-100);
  text-align: left;
  cursor: pointer;
}
.events .current button { color: var(--dt-color-foreground-primary); }
.when { width: 36px; }
.kind { width: 64px; text-transform: capitalize; }
.fail-text { color: var(--dt-color-foreground-critical); }
.ok { color: var(--dt-color-foreground-success); }

.transcript article {
  padding: var(--dt-space-400);
  border-radius: 8px;
  background: var(--dt-color-surface-secondary);
}
.transcript .agent { background: var(--dt-color-surface-brand-subtle); }
.transcript span { font-size: var(--dt-font-size-100); font-weight: 600; }
.transcript p { margin-top: var(--dt-space-200); }
.meta-list div {
  display: flex;
  justify-content: space-between;
  gap: var(--dt-space-500);
  padding: var(--dt-space-400) 0;
  border-bottom: 1px solid var(--dt-color-border-subtle);
  font-size: var(--dt-font-size-200);
}
.meta-list span { color: var(--dt-color-foreground-tertiary); }
</style>
