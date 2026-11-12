<template>
  <SideDrawer
    :title="gap.name"
    title-id="mining-gap-title"
    :content-key="gap.id"
    @close="emit('close')"
    :default-width="DRAWER_WIDTH"
  >
    <template #meta>
      <span>{{ gap.calls }} calls</span>
      <span class="dot" />
      <span>{{ gapShare(gap) }}% of conversations</span>
    </template>

    <div class="stack">
      <p>{{ gap.description }}</p>

      <div class="stats">
        <article>
          <span>Calls not handled</span>
          <strong>{{ gap.calls }}</strong>
          <em>of {{ miningSummary.analyzed.toLocaleString() }} analyzed</em>
        </article>
        <article>
          <span>Share of conversations</span>
          <strong>{{ gapShare(gap) }}%</strong>
          <em>{{ miningSummary.range }}</em>
        </article>
      </div>

      <h3>What customers said</h3>
      <ul class="quotes">
        <li v-for="quote in gap.quotes" :key="quote">
          <span>Customer</span>
          <p>“{{ quote }}”</p>
        </li>
      </ul>

      <h3>Most common path</h3>
      <p class="hint">The steps people took most often on these calls.</p>
      <ol class="steps">
        <li v-for="step in gap.steps" :key="step">{{ step }}</li>
      </ol>
    </div>

    <template #footer>
      <button type="button" class="sd-btn sd-btn--primary" @click="emit('close')">Create skill</button>
    </template>
  </SideDrawer>
</template>

<script setup>
import SideDrawer from '../SideDrawer.vue'
import { gapShare, miningSummary, DRAWER_WIDTH } from '../../mock/miningData.js'

defineProps({
  gap: { type: Object, required: true },
})

const emit = defineEmits(['close'])
</script>

<style scoped>
.dot { width: 3px; height: 3px; border-radius: 50%; background: var(--dt-color-foreground-muted); }

.stack { display: flex; flex-direction: column; gap: var(--dt-space-400); }
h3 { margin: var(--dt-space-400) 0 0; font-size: var(--dt-font-size-200); font-weight: 600; }
p { margin: 0; color: var(--dt-color-foreground-secondary); font-size: var(--dt-font-size-200); }
.hint { margin-top: calc(var(--dt-space-200) * -1); color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-100); }

.stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--dt-space-400); }
.stats article {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-100);
  padding: var(--dt-space-400);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: 8px;
}
.stats span,
.stats em { color: var(--dt-color-foreground-tertiary); font-size: var(--dt-font-size-100); font-style: normal; }
.stats strong { font: var(--dt-typography-headline-lg); color: var(--dt-color-foreground-primary); }

.quotes { display: flex; flex-direction: column; gap: var(--dt-space-300); margin: 0; padding: 0; list-style: none; }
.quotes li {
  padding: var(--dt-space-400);
  border-radius: 8px;
  background: var(--dt-color-surface-secondary);
}
.quotes span { font-size: var(--dt-font-size-100); font-weight: 600; }
.quotes p { margin-top: var(--dt-space-200); color: var(--dt-color-foreground-primary); }

.steps { display: flex; flex-direction: column; gap: var(--dt-space-300); margin: 0; padding-left: 1.4em; list-style: decimal; }
.steps li { padding-left: var(--dt-space-200); color: var(--dt-color-foreground-secondary); font-size: var(--dt-font-size-200); }
</style>
