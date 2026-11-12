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

    <section ref="playerEl" class="player">
      <div class="player-title">
        Recording
        <span v-if="playing" class="wave" aria-hidden="true">
          <i /><i /><i /><i /><i />
        </span>
      </div>
      <div class="scroll" @scroll="tip = null">
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
            :aria-label="`${typeName(event.kind)}. ${event.summary || event.label}`"
            @click.stop="go(event.t)"
            @mouseenter="showTip(event, $event)"
            @mouseleave="tip = null"
            @focus="showTip(event, $event)"
            @blur="tip = null"
          />
          <div class="playhead" :style="{ left: pct(playhead) }" />
        </div>
      </div>

      <div
        v-if="tip"
        class="event-tip"
        role="tooltip"
        :style="{ left: `${tip.x}px`, top: `${tip.y}px` }"
      >
        <strong>{{ typeName(tip.event.kind) }}</strong>
        <span>{{ tip.event.summary || tip.event.label }}</span>
      </div>

      <div class="controls">
        <div class="transport">
          <button type="button" class="sd-btn sd-btn--outlined sd-btn--icon" aria-label="Back 10 seconds" @click="skip(-10)">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4.8 12a7.2 7.2 0 1 0 2.1-5.1" />
              <path d="M4.6 4.4V8h3.6" />
              <text x="12" y="14.6" font-size="8">10</text>
            </svg>
          </button>
          <button type="button" class="sd-btn sd-btn--primary sd-btn--icon" :aria-label="playing ? 'Pause' : 'Play'" @click="toggle">
            <svg v-if="playing" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="14" y="3" width="5" height="18" rx="1" />
              <rect x="5" y="3" width="5" height="18" rx="1" />
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
            </svg>
          </button>
          <button type="button" class="sd-btn sd-btn--outlined sd-btn--icon" aria-label="Forward 10 seconds" @click="skip(10)">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19.2 12a7.2 7.2 0 1 1-2.1-5.1" />
              <path d="M19.4 4.4V8h-3.6" />
              <text x="12" y="14.6" font-size="8">10</text>
            </svg>
          </button>
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
const playerEl = ref(null)
const tip = ref(null)
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
  tip.value = null
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

function showTip(event, domEvent) {
  const player = playerEl.value
  if (!player) return
  const playerRect = player.getBoundingClientRect()
  const rect = domEvent.currentTarget.getBoundingClientRect()
  const half = 110
  const center = rect.left + rect.width / 2 - playerRect.left - player.clientLeft
  tip.value = {
    event,
    x: Math.min(player.clientWidth - half - 8, Math.max(half + 8, center)),
    y: rect.top - playerRect.top - player.clientTop,
  }
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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
  padding: var(--dt-space-500);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: 8px;
}
.player-title {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  font-weight: 600;
}
.wave {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 14px;
}
.wave i {
  width: 3px;
  height: 6px;
  border-radius: 1px;
  background: var(--dt-color-foreground-primary);
  animation: wave 0.9s ease-in-out infinite;
}
.wave i:nth-child(2) { animation-delay: 0.12s; }
.wave i:nth-child(3) { animation-delay: 0.24s; }
.wave i:nth-child(4) { animation-delay: 0.36s; }
.wave i:nth-child(5) { animation-delay: 0.48s; }
@keyframes wave {
  0%, 100% { height: 6px; }
  50% { height: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .wave i { height: 10px; animation: none; }
}
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
.sd-btn--icon {
  width: var(--btn-height-sm);
  height: var(--btn-height-sm);
  padding: 0;
}
.transport svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.transport .sd-btn--primary svg {
  width: 14px;
  height: 14px;
}
.transport text {
  fill: currentColor;
  stroke: none;
  font-family: inherit;
  font-weight: 700;
  text-anchor: middle;
}
.transport .sd-btn:focus-visible {
  outline: 2px solid var(--dt-color-border-focus);
  outline-offset: 1px;
}
.time { color: var(--dt-color-foreground-secondary); font-size: var(--dt-font-size-100); }
.event-tip {
  position: absolute;
  z-index: 6;
  transform: translate(-50%, calc(-100% - var(--dt-space-200)));
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-200);
  width: max-content;
  max-width: 220px;
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
.event-tip strong { font-weight: 700; }
.player .event-tip > span {
  color: var(--dt-color-foreground-secondary-inverted);
  font-size: var(--dt-font-size-100);
  font-weight: 400;
}
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
