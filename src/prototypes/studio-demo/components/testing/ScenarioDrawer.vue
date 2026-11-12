<template>
  <div v-if="scenario" ref="root" class="drawer" role="dialog" tabindex="-1" aria-labelledby="scenario-title">
    <header>
      <button type="button" class="close" aria-label="Close" @click="emit('close')">×</button>
      <p class="eyebrow">Scenario result</p>
      <h2 id="scenario-title">{{ scenario.scenario }}</h2>
      <p class="meta">{{ scenario.channel }} · {{ scenario.difficulty }}</p>
    </header>
    <div class="body">
      <div class="banner" :class="passed ? 'banner--pass' : 'banner--fail'">
        <strong>{{ scenario.passFail }}</strong>
        <span>{{ scenario.channel }} channel</span>
      </div>

      <section>
        <h3>Skills</h3>
        <ul class="skills">
          <li v-for="skill in scenario.skills" :key="skill.name">
            <span class="sd-chip" :class="{ 'sd-chip--fail': !skill.passed }">{{ skill.name }}</span>
            <span v-if="!skill.passed" class="hint">May have contributed to failure</span>
          </li>
        </ul>
      </section>

      <section>
        <h3>Conversation transcript</h3>
        <div class="transcript">
          <article v-for="(line, index) in transcript" :key="index" :class="line.speaker === 'Agent' ? 'agent' : 'customer'">
            <span>{{ line.speaker }}</span>
            <p>{{ line.text }}</p>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useDrawerDismiss } from '../../composables/useDrawerDismiss.js'

const props = defineProps({
  scenario: { type: Object, default: null },
})

const emit = defineEmits(['close'])
const root = ref(null)

useDrawerDismiss(root, () => emit('close'))

const passed = computed(() => props.scenario?.passFail === 'Pass')
const transcript = computed(() => (
  props.scenario ? linesFor(props.scenario.scenario, props.scenario.channel, passed.value) : []
))

function linesFor(scenario, channel, pass) {
  const kind = kindFor(scenario.toLowerCase())
  const greeting = channel === 'Voice'
    ? 'Thanks for calling. How can I help?'
    : 'Hi, how can I help today?'
  const turns = {
    order: [
      'Can you tell me where my order is?',
      'I can look up the shipment. What is the order number?',
      'It is order 48219, placed on Monday.',
      'It is out for delivery today. I can text you the latest scan.',
    ],
    return: [
      'I need to start a return.',
      'I can start that. Which items should be included?',
      'There are two items, and one of them was a gift.',
      'Both items are eligible. I sent the label and the refund timing.',
    ],
    bill: [
      'I have a question about a charge on my account.',
      'I can pull up the invoice. Which charge looks wrong?',
      'The second line is the one I don’t recognize.',
      'I found the line and explained how it posts. The receipt is in your email.',
    ],
    visit: [
      'I need to change an appointment.',
      'I can check the calendar. What day works?',
      'Thursday afternoon would be best.',
      'Thursday at 2:30 is held. You’ll get a confirmation shortly.',
    ],
    general: [
      'I have a quick question.',
      'Let me look that up.',
      'Here are the details I have.',
      'That’s taken care of. I sent a confirmation with the details.',
    ],
  }
  const [ask, follow, detail, done] = turns[kind]
  return [
    { speaker: 'Customer', text: ask },
    { speaker: 'Agent', text: `${greeting} ${follow}` },
    { speaker: 'Customer', text: detail },
    { speaker: 'Agent', text: pass ? done : 'I can see part of this, but I can’t finish the request from here. I should hand this to a teammate.' },
  ]
}

function kindFor(text) {
  if (includes(text, ['return', 'exchange', 'refund'])) return 'return'
  if (includes(text, ['bill', 'charge', 'fee', 'tax', 'promo', 'discount', 'price', 'receipt'])) return 'bill'
  if (includes(text, ['appointment', 'visit', 'callback', 'fitting', 'book', 'reschedul', 'pickup'])) return 'visit'
  if (includes(text, ['order', 'package', 'shipment', 'deliver'])) return 'order'
  return 'general'
}

function includes(text, keys) {
  return keys.some((key) => text.includes(key))
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
  width: 420px;
  height: 100vh;
  background: var(--dt-color-surface-primary);
  border-left: 1px solid var(--dt-color-border-default);
  box-shadow: var(--dt-shadow-medium);
  outline: none;
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
  transition: background-color 120ms ease, color 120ms ease;
}
.close:hover { background: var(--dt-color-surface-secondary); color: var(--dt-color-foreground-primary); }
.close:active { transform: scale(0.94); }
.close:focus-visible { outline: 2px solid var(--dt-color-border-focus); outline-offset: 1px; }
.eyebrow {
  margin: 0;
  color: var(--dt-color-foreground-tertiary);
  font-size: var(--dt-font-size-100);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
h2 {
  margin: var(--dt-space-200) var(--dt-space-600) 0 0;
  font-size: var(--dt-font-size-300);
  font-weight: 600;
}
.meta { margin: var(--dt-space-200) 0 0; color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-100); }

.body {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-500);
  flex: 1;
  overflow: auto;
  padding: 0 var(--dt-space-550) var(--dt-space-600);
}

.banner {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-200);
  padding: var(--dt-space-450) var(--dt-space-500);
  border-radius: 8px;
}
.banner strong { font-size: var(--dt-font-size-200); }
.banner span { font-size: var(--dt-font-size-100); }
.banner--pass { background: var(--dt-color-surface-success); color: var(--dt-color-foreground-success); }
.banner--fail {
  background: color-mix(in srgb, var(--dt-color-foreground-critical) 12%, white);
  color: var(--dt-color-foreground-critical);
}

h3 { margin: 0 0 var(--dt-space-300); font-size: var(--dt-font-size-200); font-weight: 600; }
.skills { display: flex; flex-direction: column; gap: var(--dt-space-300); margin: 0; padding: 0; list-style: none; }
.skills li { display: flex; flex-wrap: wrap; align-items: center; gap: var(--dt-space-300); }
.hint { color: var(--dt-color-foreground-critical); font-size: var(--dt-font-size-100); }

.transcript { display: flex; flex-direction: column; gap: var(--dt-space-400); }
.transcript article {
  padding: var(--dt-space-400);
  border-radius: 8px;
  background: var(--dt-color-surface-secondary);
}
.transcript .agent { background: var(--dt-color-surface-brand-subtle); }
.transcript span { font-size: var(--dt-font-size-100); font-weight: 600; }
.transcript p { margin: var(--dt-space-200) 0 0; color: var(--dt-color-foreground-secondary); font-size: var(--dt-font-size-200); }
</style>
