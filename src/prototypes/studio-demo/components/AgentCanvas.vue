<template>
  <div class="node-stage">
    <div class="world">
      <svg class="wires" width="760" height="620" aria-hidden="true">
        <path
          v-for="(skill, i) in visibleSkills"
          :key="skill.name"
          :d="pathFor(skill)"
          :class="{ 'is-drawing': entering[i] }"
        />
      </svg>

      <article class="node node--agent">
        <header class="node-header">
          <span class="node-kind">
            <svg class="kind-icon kind-icon--agent" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 1.2 9.1 5.4 13.4 6.2 9.1 7.1 8 11.3 6.9 7.1 2.6 6.2 6.9 5.4 8 1.2Z" />
              <path d="M12.2 9.2 12.7 10.8 14.3 11.2 12.7 11.7 12.2 13.3 11.7 11.7 10.1 11.2 11.7 10.8 12.2 9.2Z" />
            </svg>
            AI Agent
          </span>
          <span class="node-menu"><Icon name="more-vertical" :size="14" /></span>
        </header>
        <div class="node-body">
          <h2>AI Receptionist</h2>
          <p>Greets callers professionally, routes to the right team, and captures messages when agents are unavailable.</p>
        </div>
      </article>

      <article
        v-for="(skill, i) in visibleSkills"
        :key="skill.name"
        class="node node--skill"
        :class="{ 'is-entering': entering[i], 'is-shimmer': shimmering[i] }"
        :style="{ left: `${skill.left}px`, top: `${skill.top}px` }"
      >
        <header class="node-header">
          <span class="node-kind">
            <svg class="kind-icon kind-icon--skill" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 1.4 9.4 5.2 13.4 5.6 10.4 8.2 11.4 12.2 8 10.1 4.6 12.2 5.6 8.2 2.6 5.6 6.6 5.2 8 1.4Z" />
            </svg>
            Skill
          </span>
          <span class="node-menu"><Icon name="more-vertical" :size="14" /></span>
        </header>
        <div class="node-body">
          <h2>{{ skill.name }}</h2>
          <p>{{ skill.description }}</p>
          <span class="actions">
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <circle cx="2.2" cy="3" r="1.1" />
              <circle cx="2.2" cy="9" r="1.1" />
              <circle cx="9.2" cy="6" r="1.1" />
              <path d="M3.2 3.4 8 5.5M3.2 8.6 8 6.5" fill="none" stroke="currentColor" stroke-width="1" />
            </svg>
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

const props = defineProps({
  count: { type: Number, default: 0 },
  shimmering: { type: Array, default: () => [] },
  entering: { type: Array, default: () => [] },
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

const visibleSkills = computed(() => skills.slice(0, props.count))

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
  transform: translate(-390px, -300px);
}

.wires {
  position: absolute;
  inset: 0;
  overflow: visible;
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
}

.node--skill {
  outline: 2px solid rgba(255, 152, 0, 0.3);
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
  gap: 8px;
  color: #000;
  font-size: 15px;
  font-weight: 600;
  line-height: 24px;
}

.kind-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.kind-icon--agent { color: #7c52ff; }
.kind-icon--skill { color: #ff9800; }

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
  gap: 4px;
  width: fit-content;
  margin-top: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f5f5f5;
  color: #666;
  font-size: 11px;
  font-weight: 500;
}

.actions svg {
  width: 12px;
  height: 12px;
  fill: currentColor;
}
</style>
