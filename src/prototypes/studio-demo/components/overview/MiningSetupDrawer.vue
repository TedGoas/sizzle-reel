<template>
  <SideDrawer
    title="Skill mining"
    title-id="mining-setup-title"
    @close="emit('close')"
    :default-width="DRAWER_WIDTH"
  >
    <template #meta>
      <span>Find calls this agent couldn’t handle</span>
    </template>

    <div class="form">
      <p class="intro">
        We’ll read past conversations and group the ones this agent couldn’t handle. Each group is a skill you could add.
      </p>

      <fieldset>
        <legend>Call sources</legend>
        <p class="hint">Where this agent runs or will run. Calls already handled by AI are left out.</p>
        <label v-for="source in callSources" :key="source.id" class="option">
          <input v-model="sources" type="checkbox" :value="source.id" />
          <span class="option-text">
            <span>{{ source.label }}</span>
            <span class="option-hint">{{ source.detail }}</span>
          </span>
        </label>
      </fieldset>

      <fieldset>
        <legend>Call purposes</legend>
        <p class="hint">Pick up to {{ MAX_PURPOSES }}. Leave blank to include all.</p>
        <div class="chips">
          <button
            v-for="purpose in callPurposes"
            :key="purpose"
            type="button"
            class="sd-chip pick"
            :class="{ on: purposes.includes(purpose) }"
            :aria-pressed="purposes.includes(purpose)"
            :disabled="!purposes.includes(purpose) && purposes.length >= MAX_PURPOSES"
            @click="togglePurpose(purpose)"
          >
            {{ purpose }}
          </button>
        </div>
      </fieldset>

      <fieldset>
        <legend>Date range</legend>
        <label v-for="range in dateRanges" :key="range.id" class="option">
          <input v-model="dateRange" type="radio" name="mining-range" :value="range.id" />
          <span class="option-text">
            <span>{{ range.label }}</span>
            <span class="option-hint">{{ range.hint }}</span>
          </span>
        </label>
      </fieldset>

      <label class="toggle-row">
        <span class="option-text">
          <span class="legend">Email me when it’s done</span>
          <span class="option-hint">You can leave this page while it runs.</span>
        </span>
        <input v-model="emailMe" type="checkbox" class="switch" role="switch" />
      </label>
    </div>

    <template #footer>
      <button type="button" class="sd-btn sd-btn--clear" @click="emit('close')">Cancel</button>
      <button type="button" class="sd-btn sd-btn--primary" :disabled="!sources.length" @click="emit('start')">
        Mine for skills
      </button>
    </template>
  </SideDrawer>
</template>

<script setup>
import { ref } from 'vue'
import SideDrawer from '../SideDrawer.vue'
import { callSources, callPurposes, dateRanges, MAX_PURPOSES, DRAWER_WIDTH } from '../../mock/miningData.js'

const emit = defineEmits(['close', 'start'])

const sources = ref(callSources.slice(0, 2).map((source) => source.id))
const purposes = ref([])
const dateRange = ref(dateRanges[0].id)
const emailMe = ref(true)

function togglePurpose(purpose) {
  if (purposes.value.includes(purpose)) {
    purposes.value = purposes.value.filter((item) => item !== purpose)
  } else if (purposes.value.length < MAX_PURPOSES) {
    purposes.value = [...purposes.value, purpose]
  }
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-550);
}

.intro {
  margin: 0;
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-200);
}

fieldset {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
  margin: 0;
  padding: 0;
  border: 0;
}

legend,
.legend {
  padding: 0;
  color: var(--dt-color-foreground-primary);
  font-size: var(--dt-font-size-200);
  font-weight: 600;
}

.hint {
  margin: 0 0 var(--dt-space-200);
  color: var(--dt-color-foreground-tertiary);
  font-size: var(--dt-font-size-100);
}

.option {
  display: flex;
  align-items: flex-start;
  gap: var(--dt-space-400);
  padding: var(--dt-space-300) 0;
  cursor: pointer;
}

.option input {
  flex: none;
  width: 16px;
  height: 16px;
  margin: 2px 0 0;
  accent-color: var(--dt-color-surface-brand);
  cursor: pointer;
}

.option-text {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-100);
  min-width: 0;
  color: var(--dt-color-foreground-primary);
  font-size: var(--dt-font-size-200);
}

.option-hint {
  color: var(--dt-color-foreground-tertiary);
  font-size: var(--dt-font-size-100);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-300);
}

.pick {
  height: var(--btn-height-sm);
  padding: 0 var(--dt-space-450);
  border: 1px solid var(--dt-color-border-default);
  background: var(--dt-color-surface-primary);
  font-family: inherit;
  cursor: pointer;
}

.pick.on {
  border-color: var(--dt-color-surface-brand);
  background: var(--dt-color-surface-brand-subtle);
  color: var(--dt-color-link-primary);
}

.pick:disabled {
  opacity: 0.4;
  cursor: default;
}

.toggle-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--dt-space-500);
  padding-top: var(--dt-space-500);
  border-top: 1px solid var(--dt-color-border-subtle);
  cursor: pointer;
}

.switch {
  appearance: none;
  position: relative;
  flex: none;
  width: 32px;
  height: 18px;
  margin: 2px 0 0;
  border-radius: 999px;
  background: var(--dt-color-border-default);
  cursor: pointer;
  transition: background 0.2s ease;
}

.switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--dt-color-surface-primary);
  box-shadow: var(--dt-shadow-small);
  transition: transform 0.2s ease;
}

.switch:checked { background: var(--dt-color-surface-brand); }
.switch:checked::after { transform: translateX(14px); }
</style>
