<template>
  <Teleport to="body">
    <Transition name="wrap-up" @after-enter="dialogRef?.focus()">
      <div v-if="show" class="wrap-up-scrim">
        <div
          ref="dialogRef"
          class="wrap-up"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wrap-up-title"
          tabindex="-1"
        >
          <header class="wrap-up__header">
            <h2 id="wrap-up-title" class="d-headline--lg-compact">Wrap-Up</h2>
            <p class="wrap-up__subline d-body--sm">{{ caller.name }} · {{ caller.company }} · {{ duration }}</p>
          </header>

          <div class="wrap-up__body">
            <!-- Disposition: single-select combobox you can type into -->
            <div class="wrap-up__field">
              <label class="wrap-up__label d-label--md-compact" for="wrap-up-disposition">Disposition</label>
              <div class="wrap-up-combobox" :class="{ 'is-drafting': drafting }">
                <input
                  id="wrap-up-disposition"
                  ref="dispositionRef"
                  v-model="disposition"
                  class="wrap-up-combobox__input d-body--md-compact"
                  :class="{ 'is-filled': dispositionFilled }"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-controls="wrap-up-disposition-list"
                  :aria-expanded="listOpen"
                  :aria-activedescendant="listOpen && activeIndex >= 0 ? `wrap-up-option-${activeIndex}` : undefined"
                  :readonly="drafting"
                  placeholder="Select a disposition"
                  autocomplete="off"
                  @focus="openList"
                  @click="openList"
                  @input="onType"
                  @keydown="onKeydown"
                  @blur="listOpen = false"
                />
                <button
                  type="button"
                  class="wrap-up-combobox__toggle"
                  tabindex="-1"
                  aria-label="Show dispositions"
                  :disabled="drafting"
                  @mousedown.prevent="toggleList"
                >
                  <DtIcon name="chevron-down" :size="16" />
                </button>
                <ul
                  v-show="listOpen"
                  id="wrap-up-disposition-list"
                  class="wrap-up-combobox__list"
                  role="listbox"
                >
                  <li
                    v-for="(option, i) in filteredOptions"
                    :id="`wrap-up-option-${i}`"
                    :key="option"
                    class="wrap-up-combobox__option d-body--md-compact"
                    :class="{ 'is-active': i === activeIndex }"
                    role="option"
                    :aria-selected="option === disposition"
                    @mousedown.prevent="selectOption(option)"
                    @mouseenter="activeIndex = i"
                  >
                    <span>{{ option }}</span>
                    <DtIcon v-if="option === disposition" name="check" :size="16" />
                  </li>
                  <li v-if="!filteredOptions.length" class="wrap-up-combobox__empty d-body--sm">No matching dispositions</li>
                </ul>
              </div>
            </div>

            <div class="wrap-up__field">
              <label class="wrap-up__label d-label--md-compact" for="wrap-up-notes">Notes</label>
              <textarea
                id="wrap-up-notes"
                ref="notesRef"
                v-model="notes"
                class="wrap-up__notes d-body--md-compact"
                :class="{ 'is-drafting': drafting }"
                rows="6"
                :readonly="drafting"
                placeholder="What happened on the call?"
              />
            </div>
          </div>

          <footer class="wrap-up__footer">
            <p class="wrap-up__ai-status d-body--sm-compact" :class="{ 'is-drafting': drafting }" aria-live="polite">
              <DtIcon name="sparkle" :size="12" />
              {{ drafting ? 'Drafting with AI…' : 'Drafted by AI · Review before saving' }}
            </p>
            <button type="button" class="wrap-up__button wrap-up__button--secondary d-label--md-compact" :disabled="drafting" @click="clearFields">
              Clear
            </button>
            <button type="button" class="wrap-up__button wrap-up__button--primary d-label--md-compact" :disabled="drafting" @click="emit('done')">
              Done
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import DtIcon from '@/components/icons/DtIcon.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  caller: { type: Object, required: true },
  duration: { type: String, default: '00:00' },
  options: { type: Array, required: true },
  draft: { type: Object, required: true },
})
const emit = defineEmits(['done'])

// Pre-fill timing (~9s): shimmer, then the disposition lands, then notes stream in.
const DISPOSITION_AT_MS = 3000
const NOTES_DURATION_MS = 6000

const dialogRef = ref(null)
const dispositionRef = ref(null)
const notesRef = ref(null)

const disposition = ref('')
const dispositionFilled = ref(false)
const notes = ref('')
const drafting = ref(false)

const listOpen = ref(false)
const activeIndex = ref(-1)
// Filter only after the agent types; opening the list shows every option.
const query = ref('')

const filteredOptions = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? props.options.filter(o => o.toLowerCase().includes(q)) : props.options
})

let dispositionTimer = null
let notesTimer = null

function clearTimers() {
  clearTimeout(dispositionTimer)
  clearInterval(notesTimer)
}

function finishDraft() {
  clearTimers()
  disposition.value = props.draft.disposition
  dispositionFilled.value = true
  notes.value = props.draft.notes
  drafting.value = false
}

function startDraft() {
  disposition.value = ''
  dispositionFilled.value = false
  notes.value = ''
  query.value = ''
  listOpen.value = false

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finishDraft()
    return
  }

  drafting.value = true
  dispositionTimer = setTimeout(() => {
    disposition.value = props.draft.disposition
    dispositionFilled.value = true

    const words = props.draft.notes.split(' ')
    let shown = 0
    notesTimer = setInterval(() => {
      shown += 1
      notes.value = words.slice(0, shown).join(' ')
      nextTick(() => {
        if (notesRef.value) notesRef.value.scrollTop = notesRef.value.scrollHeight
      })
      if (shown >= words.length) finishDraft()
    }, NOTES_DURATION_MS / words.length)
  }, DISPOSITION_AT_MS)
}

watch(() => props.show, (show) => {
  if (show) startDraft()
  else clearTimers()
})

onBeforeUnmount(clearTimers)

function openList() {
  if (drafting.value) return
  query.value = ''
  activeIndex.value = props.options.indexOf(disposition.value)
  listOpen.value = true
}

function toggleList() {
  if (listOpen.value) listOpen.value = false
  else {
    dispositionRef.value?.focus()
    openList()
  }
}

function onType() {
  query.value = disposition.value
  activeIndex.value = filteredOptions.value.length ? 0 : -1
  listOpen.value = true
}

function selectOption(option) {
  disposition.value = option
  query.value = ''
  listOpen.value = false
}

function onKeydown(event) {
  if (drafting.value) return
  const count = filteredOptions.value.length
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!listOpen.value) { openList(); return }
    if (!count) return
    const step = event.key === 'ArrowDown' ? 1 : -1
    activeIndex.value = (activeIndex.value + step + count) % count
  } else if (event.key === 'Enter' && listOpen.value) {
    event.preventDefault()
    if (activeIndex.value >= 0 && activeIndex.value < count) selectOption(filteredOptions.value[activeIndex.value])
  } else if (event.key === 'Escape' && listOpen.value) {
    event.preventDefault()
    listOpen.value = false
  }
}

function clearFields() {
  disposition.value = ''
  notes.value = ''
  query.value = ''
  dispositionRef.value?.focus()
}
</script>

<style scoped>
.wrap-up-scrim {
  position: fixed;
  inset: 0;
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--dt-space-500);
  background: var(--dt-color-surface-backdrop);
  font-family: var(--dt-font-family-body);
}

.wrap-up {
  display: flex;
  flex-direction: column;
  width: min(480px, 100%);
  max-height: 100%;
  background: var(--dt-color-surface-primary);
  border: var(--dt-size-border-100) solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-500);
  box-shadow: var(--dt-shadow-large);
  color: var(--dt-color-foreground-primary);
  outline: none;
}

.wrap-up__header {
  padding: var(--dt-space-500) var(--dt-space-500) 0;
}

.wrap-up__header h2 {
  margin: 0;
}

.wrap-up__subline {
  margin: var(--dt-space-200) 0 0;
  color: var(--dt-color-foreground-tertiary);
}

.wrap-up__body {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-500);
  padding: var(--dt-space-500);
}

.wrap-up__ai-status {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-200);
  margin: 0 auto 0 0;
  color: var(--dt-color-foreground-tertiary);
}

.wrap-up__ai-status.is-drafting {
  color: var(--dt-color-purple-500);
}

.wrap-up__ai-status.is-drafting :deep(svg) {
  animation: wrap-up-pulse 1s ease-in-out infinite;
}

.wrap-up__field {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-200);
}

.wrap-up__label {
  color: var(--dt-color-foreground-primary);
}

/* Shared input look: Disposition input and Notes textarea */
.wrap-up-combobox__input,
.wrap-up__notes {
  width: 100%;
  border: var(--dt-size-border-100) solid var(--dt-color-border-default);
  border-radius: var(--dt-size-radius-400);
  background-color: var(--dt-color-surface-primary);
  color: var(--dt-color-foreground-primary);
  outline: none;
  transition: border-color var(--td150) var(--ttf-out-quint), box-shadow var(--td150) var(--ttf-out-quint);
}

.wrap-up-combobox__input:focus-visible,
.wrap-up__notes:focus-visible {
  border-color: var(--dt-color-border-focus);
  box-shadow: var(--dt-shadow-focus);
}

.wrap-up-combobox__input::placeholder,
.wrap-up__notes::placeholder {
  color: var(--dt-color-foreground-tertiary);
}

/* AI drafting: a soft purple sweep across the field; the border stays as is */
.wrap-up-combobox.is-drafting .wrap-up-combobox__input,
.wrap-up__notes.is-drafting {
  background-image: linear-gradient(90deg, transparent 30%, color-mix(in srgb, var(--dt-color-purple-500) 14%, transparent) 50%, transparent 70%);
  background-size: 300% 100%;
  animation: wrap-up-shimmer 1.2s linear infinite;
  cursor: progress;
}

.wrap-up-combobox {
  position: relative;
}

.wrap-up-combobox__input {
  height: var(--btn-height-md);
  padding: 0 var(--btn-height-md) 0 var(--dt-space-400);
}

.wrap-up-combobox__input.is-filled {
  animation: wrap-up-fade-in var(--td300) var(--ttf-out-quint);
}

.wrap-up-combobox__toggle {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--btn-height-md);
  height: var(--btn-height-md);
  color: var(--dt-color-foreground-tertiary);
}

.wrap-up-combobox__toggle:disabled {
  cursor: progress;
}

.wrap-up-combobox__list {
  position: absolute;
  z-index: 1;
  top: calc(100% + var(--dt-space-200));
  left: 0;
  right: 0;
  max-height: 240px;
  margin: 0;
  padding: var(--dt-space-200);
  overflow-y: auto;
  list-style: none;
  background: var(--dt-color-surface-primary);
  border: var(--dt-size-border-100) solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  box-shadow: var(--dt-shadow-medium);
}

.wrap-up-combobox__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-400);
  min-height: var(--btn-height-md);
  padding: 0 var(--dt-space-400);
  border-radius: var(--dt-size-radius-300);
  cursor: pointer;
}

.wrap-up-combobox__option.is-active {
  background: var(--dt-color-surface-moderate);
}

.wrap-up-combobox__option :deep(svg) {
  flex-shrink: 0;
  color: var(--dt-color-purple-500);
}

.wrap-up-combobox__empty {
  padding: var(--dt-space-400);
  color: var(--dt-color-foreground-tertiary);
}

.wrap-up__notes {
  display: block;
  padding: var(--dt-space-400);
  resize: vertical;
  min-height: 120px;
}

.wrap-up__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--dt-space-400);
  padding: 0 var(--dt-space-500) var(--dt-space-500);
}

.wrap-up__button {
  height: var(--btn-height-md);
  padding: 0 var(--dt-space-500);
  border-radius: var(--dt-size-radius-400);
  transition: background-color var(--td150) var(--ttf-out-quint), opacity var(--td150) var(--ttf-out-quint);
}

.wrap-up__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.wrap-up__button--primary {
  background: var(--dt-action-color-background-base-primary-default);
  color: var(--dt-color-neutral-white);
}

.wrap-up__button--primary:not(:disabled):hover {
  background: var(--dt-action-color-background-base-primary-hover);
}

.wrap-up__button--secondary {
  color: var(--dt-color-foreground-primary);
}

.wrap-up__button--secondary:not(:disabled):hover {
  background: var(--dt-color-surface-secondary);
}

.wrap-up__button:focus-visible {
  outline: none;
  box-shadow: var(--dt-shadow-focus);
}

/* Enter / leave */
.wrap-up-enter-active,
.wrap-up-leave-active {
  transition: opacity var(--td300) var(--ttf-out-quint);
}

.wrap-up-enter-active .wrap-up,
.wrap-up-leave-active .wrap-up {
  transition: transform var(--td300) var(--ttf-out-quint);
}

.wrap-up-enter-from,
.wrap-up-leave-to {
  opacity: 0;
}

.wrap-up-enter-from .wrap-up,
.wrap-up-leave-to .wrap-up {
  transform: scale(0.96);
}

@keyframes wrap-up-shimmer {
  0%   { background-position: 100% 0; }
  100% { background-position: 0% 0; }
}

@keyframes wrap-up-fade-in {
  from { color: transparent; }
}

@keyframes wrap-up-pulse {
  50% { opacity: 0.4; }
}

@media (prefers-reduced-motion: reduce) {
  .wrap-up-enter-active,
  .wrap-up-leave-active,
  .wrap-up-enter-active .wrap-up,
  .wrap-up-leave-active .wrap-up {
    transition: none;
  }
}
</style>
