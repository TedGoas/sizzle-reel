<template>
  <div class="node-stage">
    <div class="world" :style="worldStyle">
      <svg class="wires" width="760" height="620" aria-hidden="true">
        <path
          v-for="(skill, i) in visibleSkills"
          :key="skill.name"
          :d="pathFor(skill)"
          :class="{ 'is-drawing': entering[i] || skill.entering }"
        />
      </svg>

      <article class="node node--agent">
        <header class="node-header">
          <span class="node-kind">
            <svg class="kind-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
              <path d="M20 2v4" />
              <path d="M22 4h-4" />
              <circle cx="4" cy="20" r="2" />
            </svg>
            AI Agent
          </span>
          <span class="node-menu"><Icon name="more-vertical" :size="14" /></span>
        </header>
        <div class="node-body">
          <h2>{{ agentName }}</h2>
          <p>{{ agentDescription }}</p>
        </div>
      </article>

      <article
        v-for="(skill, i) in visibleSkills"
        :key="skill.name"
        class="node node--skill"
        :class="{
          'is-entering': entering[i] || skill.entering,
          'is-shimmer': shimmering[i] || skill.shimmer,
        }"
        :style="{ left: `${skill.left}px`, top: `${skill.top}px` }"
        @click="emit('open-skill', skill.name)"
      >
        <header class="node-header">
          <span class="node-kind">Skill</span>
          <span class="node-menu"><Icon name="more-vertical" :size="14" /></span>
        </header>
        <div class="node-body">
          <h2>{{ skill.name }}</h2>
          <p>{{ skill.description }}</p>
          <span v-if="skill.actions" class="actions">
            {{ skill.actions }} {{ skill.actions === 1 ? 'Action' : 'Actions' }}
          </span>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Icon from './Icon.vue'

const emit = defineEmits(['open-skill'])

const props = defineProps({
  count: { type: Number, default: 0 },
  shimmering: { type: Array, default: () => [] },
  entering: { type: Array, default: () => [] },
  added: { type: Array, default: () => [] },
  removed: { type: Array, default: () => [] },
  panX: { type: Number, default: 0 },
  panY: { type: Number, default: 0 },
  agentName: { type: String, default: 'AI Receptionist' },
  agentDescription: {
    type: String,
    default: 'Greets callers professionally, routes to the right team, and captures messages when agents are unavailable.',
  },
})

// Tops are the Studio layout shifted down so the first skill stays on canvas.
const skills = [
  {
    name: 'Route Incoming Calls',
    description: 'Greets callers and intelligently routes them based on intent and department availability.',
    actions: 5,
    left: 420,
    top: 50,
  },
  {
    name: 'Take Messages',
    description: 'Captures caller name, number, and message details for agent follow-up.',
    actions: 3,
    left: 420,
    top: 210,
  },
  {
    name: 'Schedule Callbacks',
    description: 'Books callback time slots when live agents are busy or after-hours.',
    actions: 4,
    left: 420,
    top: 370,
  },
]

const visibleSkills = computed(() => {
  const gone = new Set(props.removed)
  const base = skills.slice(0, props.count).filter((skill) => !gone.has(skill.name))
  return [...base, ...props.added]
})

const worldStyle = computed(() => {
  const extra = Math.max(0, visibleSkills.value.length - 3)
  const x = -390 + props.panX
  const y = -300 - extra * 160 + props.panY
  return { transform: `translate(${x}px, ${y}px)` }
})

function pathFor(skill) {
  const agentX = 360
  const agentY = 280
  const skillX = skill.left
  const skillY = skill.top + 70
  const deltaY = skillY - agentY
  const curve = 24
  if (Math.abs(deltaY) < 5) return `M ${agentX} ${agentY} L ${skillX} ${skillY}`
  const midX = agentX + (skillX - agentX) / 2
  if (deltaY > 0) {
    return `M ${agentX} ${agentY} L ${midX - curve} ${agentY} Q ${midX} ${agentY} ${midX} ${agentY + curve} L ${midX} ${skillY - curve} Q ${midX} ${skillY} ${midX + curve} ${skillY} L ${skillX} ${skillY}`
  }
  return `M ${agentX} ${agentY} L ${midX - curve} ${agentY} Q ${midX} ${agentY} ${midX} ${agentY - curve} L ${midX} ${skillY + curve} Q ${midX} ${skillY} ${midX + curve} ${skillY} L ${skillX} ${skillY}`
}
</script>

<style scoped>
.node-stage {
  position: absolute;
  left: 50%;
  top: 46%;
  z-index: 1;
  width: 0;
  height: 0;
  pointer-events: none;
}

.world {
  position: absolute;
  width: 760px;
  height: 620px;
}

.wires {
  position: absolute;
  inset: 0;
  overflow: visible;
  pointer-events: none;
}

.wires path {
  fill: none;
  stroke: #d0d0d0;
  stroke-width: 2;
}

.wires path.is-drawing {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw-line 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes draw-line {
  to { stroke-dashoffset: 0; }
}

.node {
  position: absolute;
  width: 280px;
  display: flex;
  flex-direction: column;
  padding: 4px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}

.node--agent {
  left: 80px;
  top: 210px;
  outline: 2px solid rgba(71, 21, 113, 0.3);
  animation: agent-in 0.45s ease;
  pointer-events: auto;
  cursor: default;
}

.node--skill {
  outline: 2px solid rgba(255, 152, 0, 0.3);
  pointer-events: auto;
  cursor: pointer;
}

.node--skill.is-entering {
  animation: fade-in-spring 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
  transform: scale(0.8);
}

.node--skill.is-entering .node-header {
  animation: fade-in-element 0.3s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
}

.node--skill.is-entering .node-body {
  animation: fade-in-element 0.3s ease-out forwards;
  animation-delay: 0.35s;
  opacity: 0;
}

.node--skill.is-shimmer {
  overflow: hidden;
}

.node--skill.is-shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    110deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(147, 88, 255, 0.08) 20%,
    rgba(147, 88, 255, 0.2) 35%,
    rgba(236, 72, 153, 0.15) 45%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(236, 72, 153, 0.15) 55%,
    rgba(147, 88, 255, 0.2) 65%,
    rgba(147, 88, 255, 0.08) 80%,
    rgba(255, 255, 255, 0) 100%
  );
  filter: blur(8px);
  animation: node-shimmer 1.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes agent-in {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes fade-in-spring {
  0% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; }
  70% { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes fade-in-element {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes node-shimmer {
  from { left: -100%; }
  to { left: 100%; }
}

.node-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 4px 3px 10px;
  background: #f9f9f9;
  border-radius: 12px;
}

.node-kind {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6b6b6b;
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.06em;
  line-height: 16px;
  text-transform: uppercase;
}

.kind-icon {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: #7c52ff;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.node-menu {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #666;
}

.node-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
}

h2 {
  margin: 0;
  color: #000;
  font-size: 15px;
  font-weight: 600;
  line-height: 24px;
}

p {
  margin: 0;
  max-height: 42px;
  overflow: hidden;
  color: #535353;
  font-size: 12px;
  line-height: 14.4px;
}

.actions {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin-top: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f5f5f5;
  color: #666;
  font-size: 11px;
  font-weight: 500;
}
</style>
