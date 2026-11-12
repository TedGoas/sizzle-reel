<template>
  <div class="traces">
    <div class="stats">
      <article>
        <span>Resolution</span>
        <strong>{{ traces.resolution }}</strong>
        <em>{{ traces.resolutionSub }}</em>
      </article>
      <article>
        <span>Agent work</span>
        <strong>{{ traces.skills }} skills · {{ traces.actions }} actions</strong>
        <button v-if="failEvent" type="button" class="link" @click="go(failEvent.t)">
          {{ traces.failedActions }} action failed
        </button>
        <em v-else>No failed actions</em>
      </article>
      <article>
        <span>Audio quality</span>
        <strong>{{ traces.audio }}</strong>
        <em>{{ traces.audioSub }}</em>
      </article>
    </div>

    <section class="player">
      <div class="player-title">Recording</div>
      <div class="scroll">
        <div
          class="lane"
          :style="{ width: `${zoom * 100}%` }"
          @click="seekLane"
        >
          <div
            v-for="band in silence"
            :key="band.id"
            class="silence"
            :style="{ left: pct(band.start), width: pct(band.end - band.start) }"
          >
            <span>{{ band.end - band.start }}s</span>
          </div>
          <div class="line"><div class="played" :style="{ width: pct(playhead) }" /></div>
          <button
            v-for="event in traces.events"
            :key="event.id"
            type="button"
            class="dot"
            :class="[event.kind, { on: event.id === active?.id }]"
            :style="{ left: pct(event.t) }"
            :aria-label="`${event.label}, ${clock(event.t)}`"
            @click.stop="go(event.t)"
          />
          <div class="playhead" :style="{ left: pct(playhead) }" />
        </div>
      </div>

      <div class="controls">
        <div class="transport">
          <button type="button" class="sd-btn sd-btn--outlined sd-btn--sm" @click="skip(-10)">Back 10s</button>
          <button type="button" class="sd-btn sd-btn--primary sd-btn--sm" @click="toggle">
            {{ playing ? 'Pause' : 'Play' }}
          </button>
          <button type="button" class="sd-btn sd-btn--outlined sd-btn--sm" @click="skip(10)">Forward 10s</button>
          <span class="time">{{ clock(playhead) }} / {{ clock(duration) }}</span>
        </div>
        <div class="zoom">
          <button type="button" class="sd-btn sd-btn--outlined sd-btn--sm" aria-label="Zoom out" @click="setZoom(zoom - 0.5)">−</button>
          <input v-model.number="zoom" type="range" min="1" max="8" step="0.5" aria-label="Zoom level" />
          <button type="button" class="sd-btn sd-btn--outlined sd-btn--sm" aria-label="Zoom in" @click="setZoom(zoom + 0.5)">+</button>
          <button type="button" class="sd-btn sd-btn--outlined sd-btn--sm" @click="zoom = 1">Fit</button>
        </div>
      </div>

      <ul class="legend">
        <li v-for="item in legend" :key="item.id">
          <span class="swatch"><i :class="item.id" /></span>
          {{ item.label }}
        </li>
      </ul>
    </section>

    <section v-if="skills.length || failures.length || anomalies.length" class="moments">
      <div v-if="skills.length" class="group">
        <span>Skills</span>
        <button
          v-for="item in skills"
          :key="item.id"
          type="button"
          class="sd-chip"
          :class="{ 'sd-chip--fail': !item.ok }"
          @click="go(item.t)"
        >
          {{ item.label }} · {{ item.meta }}
        </button>
      </div>
      <div v-if="failures.length" class="group">
        <span>Failures</span>
        <button
          v-for="item in failures"
          :key="item.id"
          type="button"
          class="sd-chip sd-chip--fail"
          @click="go(item.t)"
        >
          {{ item.label }}<template v-if="item.detail"> · {{ item.detail }}</template>
        </button>
      </div>
      <div v-if="anomalies.length" class="group">
        <span>Anomalies</span>
        <button
          v-for="item in anomalies"
          :key="item.id"
          type="button"
          class="sd-chip"
          @click="go(item.t)"
        >
          {{ item.label }}
        </button>
      </div>
    </section>

    <div class="event-log">
      <input class="finder" type="search" placeholder="Search events" aria-label="Search events" />
      <table>
        <thead>
          <tr>
            <th><button type="button">Time <span aria-hidden="true">▾</span></button></th>
            <th><button type="button">Type <span aria-hidden="true">▾</span></button></th>
            <th><button type="button">Summary <span aria-hidden="true">▾</span></button></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="event in traces.events"
            :key="event.id"
            :class="{ on: event.id === active?.id, fail: event.ok === false || event.kind === 'fail' }"
            tabindex="0"
            @click="go(event.t)"
            @keydown.enter="go(event.t)"
          >
            <td>{{ clock(event.t) }}</td>
            <td>{{ typeName(event.kind) }}</td>
            <td>{{ event.summary || event.label }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="active" class="detail">
      <h3>{{ active.label }}</h3>
      <p>{{ clock(active.t) }}<template v-if="active.meta"> · {{ active.meta }}</template></p>
      <div v-if="active.input?.length">
        <span>Input</span>
        <p v-for="row in active.input" :key="row.k">{{ row.k }}: {{ row.v }}</p>
      </div>
      <div v-if="active.output?.length">
        <span>Output</span>
        <p v-for="row in active.output" :key="row.k">{{ row.k }}: {{ row.v }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  traces: { type: Object, required: true },
  focusFailure: { type: Boolean, default: false },
})

const legend = [
  { id: 'customer', label: 'Customer' },
  { id: 'agent', label: 'Agent' },
  { id: 'thinking', label: 'Thinking' },
  { id: 'skill', label: 'Skill' },
  { id: 'action', label: 'Action' },
  { id: 'fail', label: 'Failed' },
  { id: 'interrupt', label: 'Interruption' },
  { id: 'silence', label: 'Silence' },
]

const playhead = ref(0)
const playing = ref(false)
const zoom = ref(1)
let timer = 0

const duration = computed(() => props.traces.duration || 1)
const silence = computed(() => props.traces.silence || [])
const failEvent = computed(() => props.traces.events.find((event) => event.ok === false || event.kind === 'fail'))
const active = computed(() => {
  let current = null
  props.traces.events.forEach((event) => {
    if (event.t <= playhead.value) current = event
  })
  return current
})

const skills = computed(() => props.traces.events.filter((event) => event.kind === 'skill'))
const failures = computed(() => props.traces.events.filter((event) => event.ok === false || event.kind === 'fail'))
const anomalies = computed(() => {
  const items = []
  const groups = new Map()
  props.traces.events.filter((event) => event.kind === 'action').forEach((event) => {
    const list = groups.get(event.label) || []
    list.push(event)
    groups.set(event.label, list)
  })
  groups.forEach((list, label) => {
    if (list.length < 2) return
    const times = list.length === 2 ? 'twice' : `${list.length} times`
    items.push({ id: `repeat-${list[1].id}`, label: `${label} called ${times}`, t: list[1].t })
  })
  silence.value.forEach((band) => {
    const secs = band.end - band.start
    if (secs < 20) return
    items.push({ id: band.id, label: `${secs}s silence at ${clock(band.start)}`, t: band.start })
  })
  props.traces.events.filter((event) => event.kind === 'interrupt').forEach((event) => {
    items.push({ id: event.id, label: event.label, t: event.t })
  })
  return items
})

watch(() => props.traces, () => {
  stop()
  zoom.value = 1
  playhead.value = props.focusFailure ? (failEvent.value?.t || 0) : 0
})

watch(() => props.focusFailure, (focus) => {
  if (focus) go(failEvent.value?.t || 0)
})

onUnmounted(stop)

function pct(seconds) {
  return `${Math.min(100, (seconds / duration.value) * 100)}%`
}

function clock(seconds) {
  const whole = Math.max(0, Math.floor(seconds))
  const mins = Math.floor(whole / 60)
  const secs = whole % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

const typeNames = {
  customer: 'Customer',
  agent: 'Agent',
  thinking: 'Thinking',
  skill: 'Skill',
  action: 'Action',
  fail: 'Failed',
  interrupt: 'Interruption',
}

function typeName(kind) {
  return typeNames[kind] || kind
}

function setZoom(next) {
  zoom.value = Math.min(8, Math.max(1, next))
}

function go(seconds) {
  playhead.value = Math.min(duration.value, Math.max(0, seconds))
}

function skip(delta) {
  go(playhead.value + delta)
}

function seekLane(event) {
  if (event.target.closest('button')) return
  const rect = event.currentTarget.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
  go(ratio * duration.value)
}

function toggle() {
  if (playing.value) {
    stop()
    return
  }
  if (playhead.value >= duration.value) playhead.value = 0
  playing.value = true
  timer = window.setInterval(() => {
    if (playhead.value >= duration.value) {
      stop()
      return
    }
    playhead.value = Math.min(duration.value, playhead.value + 0.1)
  }, 100)
}

function stop() {
  playing.value = false
  window.clearInterval(timer)
  timer = 0
}
</script>

<style scoped>
.traces { display: flex; flex-direction: column; gap: var(--dt-space-500); }

.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--dt-space-400); }
.stats article {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--dt-space-400);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: 8px;
}
.stats span, .stats em, .link {
  color: var(--dt-color-foreground-tertiary);
  font-size: var(--dt-font-size-100);
  font-style: normal;
}
.stats strong { font-size: var(--dt-font-size-200); }
.link {
  align-self: flex-start;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--dt-color-foreground-critical);
  font-family: inherit;
  cursor: pointer;
}

.player {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
  padding: var(--dt-space-500);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: 8px;
}
.player-title { font-weight: 600; }
.scroll { overflow-x: auto; }
.lane {
  --track: 48px;
  position: relative;
  height: 88px;
  min-width: 100%;
  cursor: pointer;
}
.silence {
  position: absolute;
  top: var(--track);
  height: 24px;
  background: var(--dt-color-surface-secondary);
  transform: translateY(-50%);
}
.silence span {
  position: absolute;
  bottom: calc(100% + var(--dt-space-200));
  left: 50%;
  color: var(--dt-color-foreground-tertiary);
  font-size: var(--dt-font-size-100);
  white-space: nowrap;
  transform: translateX(-50%);
}
.line {
  position: absolute;
  top: var(--track);
  right: 0;
  left: 0;
  height: 4px;
  border-radius: 999px;
  background: var(--dt-color-border-subtle);
  transform: translateY(-50%);
}
.played { height: 100%; border-radius: 999px; background: var(--dt-color-chart-categorical-01); }
.dot {
  position: absolute;
  top: var(--track);
  width: 12px;
  height: 12px;
  padding: 0;
  border: 2px solid var(--dt-color-surface-primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
.dot.customer { background: var(--dt-color-chart-categorical-02); }
.dot.agent, .dot.thinking { background: var(--dt-color-chart-categorical-01); }
.dot.skill { border-radius: 3px; background: var(--dt-color-chart-categorical-05); }
.dot.action { border-radius: 3px; background: var(--dt-color-chart-categorical-04); }
.dot.fail { background: var(--dt-color-chart-critical); }
.dot.interrupt {
  border-radius: 2px;
  background: var(--dt-color-foreground-secondary);
  transform: translate(-50%, -50%) rotate(45deg);
}
.dot.on { box-shadow: 0 0 0 2px var(--dt-color-foreground-primary); }
.playhead {
  position: absolute;
  top: var(--track);
  width: 2px;
  height: 40px;
  background: var(--dt-color-foreground-primary);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.controls, .transport, .zoom { display: flex; align-items: center; gap: var(--dt-space-300); }
.controls { justify-content: space-between; flex-wrap: wrap; }
.time { color: var(--dt-color-foreground-secondary); font-size: var(--dt-font-size-100); }
.zoom input { width: 88px; }

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-500);
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-100);
}
.legend li { display: inline-flex; align-items: center; gap: var(--dt-space-200); }
.swatch {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 8px;
  height: 8px;
}
.legend i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.legend .customer { background: var(--dt-color-chart-categorical-02); }
.legend .agent, .legend .thinking { background: var(--dt-color-chart-categorical-01); }
.legend .skill { border-radius: 2px; background: var(--dt-color-chart-categorical-05); }
.legend .action { border-radius: 2px; background: var(--dt-color-chart-categorical-04); }
.legend .fail { background: var(--dt-color-chart-critical); }
.legend .interrupt {
  border-radius: 1px;
  background: var(--dt-color-foreground-secondary);
  transform: rotate(45deg);
}
.legend .silence { border-radius: 2px; background: var(--dt-color-surface-secondary); box-shadow: inset 0 0 0 1px var(--dt-color-border-default); }

.moments { display: flex; flex-direction: column; gap: var(--dt-space-400); }
.group { display: flex; flex-wrap: wrap; align-items: center; gap: var(--dt-space-300); }
.group > span {
  width: 72px;
  color: var(--dt-color-foreground-tertiary);
  font-size: var(--dt-font-size-100);
  font-weight: 600;
}
.group .sd-chip { font-family: inherit; cursor: pointer; }

.event-log { display: flex; flex-direction: column; gap: var(--dt-space-400); }
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
.event-log table { width: 100%; border-collapse: collapse; }
.event-log th, .event-log td {
  padding: var(--dt-space-300) var(--dt-space-400);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-100);
  text-align: left;
  vertical-align: top;
}
.event-log th button {
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
.event-log tbody tr { cursor: pointer; }
.event-log tbody tr.on td {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-primary);
  font-weight: 600;
}
.event-log tbody tr.fail td:nth-child(2) { color: var(--dt-color-foreground-critical); }

.detail {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-200);
  padding: var(--dt-space-400);
  border-radius: 8px;
  background: var(--dt-color-surface-secondary);
}
.detail h3 { margin: 0; font-size: var(--dt-font-size-200); }
.detail span { color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-100); font-weight: 600; }
.detail p { margin: 0; color: var(--dt-color-foreground-secondary); font-size: var(--dt-font-size-100); }
</style>
