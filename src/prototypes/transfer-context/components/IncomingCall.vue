<!--
  Incoming call notification with AI transfer context.
  Base ported from design-studio (prototypes/dialpad-app/components/incoming-call/
  IncomingCall.vue + IncomingCallButton.vue + overlays/IncomingCallOverlay.vue);
  transfer strip, summary and table from Figma "Agentic Transfer (Human UX)" 185:1409.
-->
<template>
  <Transition name="incoming-call">
    <div v-if="show" class="incoming-call__wrapper">
      <div class="incoming-call">
        <header v-if="context" class="incoming-call__transfer">
          <span class="incoming-call__queue-indicator" />
          <div class="incoming-call__transfer-text">
            <p class="incoming-call__queue">{{ context.queue }}</p>
            <p class="incoming-call__source">Transferred from {{ context.source }}</p>
          </div>
        </header>

        <div class="incoming-call__main">
          <div class="incoming-call__avatar">{{ caller.initials }}</div>
          <div class="incoming-call__details">
            <div>
              <div class="incoming-call__name-row">
                <h3 class="d-headline--lg-compact incoming-call__name">{{ caller.name }}</h3>
                <span v-if="caller.verified" class="incoming-call__verified">
                  <DtIcon name="check" :size="14" />
                  <span class="d-label--sm-compact">Verified</span>
                </span>
                <span class="incoming-call__chip">
                  <DtIcon name="check" :size="14" />
                </span>
              </div>
              <p class="d-body--md-compact incoming-call__company">{{ caller.company }}</p>
            </div>

            <div v-if="context" class="incoming-call__context">
              <p class="d-body--md-compact">{{ context.summary }}</p>
              <table class="incoming-call__table">
                <tbody>
                  <tr v-for="field in context.cardFields" :key="field.label">
                    <th scope="row" class="d-body--md-compact">{{ field.label }}</th>
                    <td class="d-body--md-compact">
                      <span v-if="field.sentiment" class="incoming-call__sentiment" :class="`incoming-call__sentiment--${field.sentiment}`" />
                      {{ field.value }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="incoming-call__buttons">
          <button class="incoming-call__button incoming-call__button--success" @click="emit('accept')">
            <DtIcon name="phone" :size="18" />
            <span class="incoming-call__button-label">Accept</span>
          </button>
          <button
            class="incoming-call__button incoming-call__button--danger"
            :class="{ 'incoming-call__button--timeout': !timedOut }"
            :style="{ '--timeout': `${timeout}ms` }"
            @click="emit('decline')"
            @animationend="timedOut = true"
          >
            <DtIcon name="close" :size="18" />
            <span class="incoming-call__button-label">Decline</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import DtIcon from '@/components/icons/DtIcon.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  caller: { type: Object, required: true },
  // AI transfer context: { queue, source, summary, cardFields[] }
  context: { type: Object, default: null },
  // Decline progress duration. When it ends the card stays up and the fill is removed.
  timeout: { type: Number, required: true },
})

const emit = defineEmits(['accept', 'decline'])

const timedOut = ref(false)
watch(() => props.show, (show) => { if (show) timedOut.value = false })
</script>

<style scoped>
.incoming-call__wrapper {
  --incoming-call-transition: cubic-bezier(0.34, 1.56, 0.64, 1);
  /* Inverted-theme values from the Figma (Dialtone dark palette) */
  --incoming-call-verified-bg: rgba(132, 238, 11, 0.2);
  --incoming-call-verified-fg: #DBFFA9;
  --incoming-call-border: var(--dt-color-border-default-inverted);

  position: absolute;
  top: var(--dt-space-600);
  right: var(--dt-space-600);
  z-index: 300;
}

.incoming-call-enter-active {
  transition: transform 0.65s var(--incoming-call-transition), opacity var(--td300) var(--incoming-call-transition);
}

.incoming-call-leave-active {
  transition: transform 0.5s var(--incoming-call-transition), opacity 0.4s var(--incoming-call-transition);
}

.incoming-call-enter-from,
.incoming-call-leave-to {
  transform: translateX(50%);
  opacity: 0;
}

/* 2px AI gradient border: gradient on the border-box, solid fill on the padding-box. */
.incoming-call {
  display: flex;
  flex-direction: column;
  width: 464px;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: var(--dt-size-radius-600);
  background:
    linear-gradient(var(--dt-color-neutral-black), var(--dt-color-neutral-black)) padding-box,
    var(--dt-color-gradient-gold-red-magenta-purple) border-box;
  box-shadow: 0 4px 16px rgba(20, 23, 33, 0.1);
  color: var(--dt-color-foreground-primary-inverted);
}

.incoming-call__transfer {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  height: 48px;
  padding: var(--dt-space-450) var(--dt-space-600);
  background: var(--dt-color-surface-contrast);
}

.incoming-call__queue-indicator {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  border-radius: var(--dt-size-radius-300);
  background: var(--dt-color-magenta-200);
}

.incoming-call__transfer-text {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-100);
  min-width: 0;
  font: var(--dt-typography-body-sm-compact);
}

.incoming-call__queue,
.incoming-call__source {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.incoming-call__queue {
  font-weight: 700;
  color: var(--dt-color-foreground-primary-inverted);
}

.incoming-call__source {
  color: var(--dt-color-foreground-tertiary-inverted);
}

.incoming-call__main {
  display: flex;
  align-items: flex-start;
  gap: var(--dt-space-350);
  padding: var(--dt-space-500) var(--dt-space-500) var(--dt-space-450);
}

.incoming-call__avatar {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dt-avatar-color-background-1600);
  color: var(--dt-color-neutral-black);
  font: 700 15px/1 var(--dt-font-family-body);
}

.incoming-call__details {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-450);
  flex: 1;
  min-width: 0;
}

.incoming-call__name-row {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  height: 21px;
}

.incoming-call__name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.incoming-call__verified {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-100);
  padding: var(--dt-space-100) var(--dt-space-300) var(--dt-space-100) var(--dt-space-100);
  border-radius: var(--dt-size-radius-300);
  background: var(--incoming-call-verified-bg);
  color: var(--incoming-call-verified-fg);
  white-space: nowrap;
}

.incoming-call__chip {
  display: inline-flex;
  padding: var(--dt-space-100);
  border-radius: var(--dt-size-radius-300);
  background: var(--dt-color-black-700);
}

.incoming-call__company {
  color: var(--dt-color-foreground-tertiary-inverted);
}

.incoming-call__context {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-450);
  padding-bottom: var(--dt-space-450);
}

/* Bordered key/value table; border-collapse: separate keeps the rounded corners. */
.incoming-call__table {
  width: 100%;
  border: 1px solid var(--incoming-call-border);
  border-radius: var(--dt-size-radius-400);
  border-spacing: 0;
  overflow: hidden;
}

.incoming-call__table th,
.incoming-call__table td {
  padding: var(--dt-space-400) var(--dt-space-450);
  text-align: left;
  font-weight: 400;
  border-bottom: 1px solid var(--incoming-call-border);
}

.incoming-call__table tr:last-child th,
.incoming-call__table tr:last-child td {
  border-bottom: 0;
}

.incoming-call__table th {
  width: 128px;
  border-right: 1px solid var(--incoming-call-border);
  white-space: nowrap;
}

.incoming-call__sentiment {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: var(--dt-space-350);
  border-radius: 50%;
  vertical-align: middle;
}

.incoming-call__sentiment--neutral { background: var(--dt-color-gold-300); }
.incoming-call__sentiment--positive { background: var(--dt-color-green-300); }
.incoming-call__sentiment--negative { background: var(--dt-color-foreground-critical); }

.incoming-call__buttons {
  display: flex;
  gap: var(--dt-space-400);
  padding: 0 var(--dt-space-500) var(--dt-space-500);
}

.incoming-call__button {
  position: relative;
  overflow: hidden;
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--dt-space-300);
  height: var(--btn-height-call);
  border-radius: var(--dt-size-radius-600);
  color: var(--dt-color-neutral-black);
  transition: background-color var(--td300) var(--ttf-out-quint);
}

.incoming-call__button > * {
  position: relative;
  z-index: 2;
}

.incoming-call__button-label {
  font: 510 15px/1.2 var(--dt-font-family-body);
}

.incoming-call__button--success {
  background-color: var(--dt-callbar-color-neon-green);
}
.incoming-call__button--success:hover {
  background-color: hsla(137, 100%, 59%, 0.7);
}

.incoming-call__button--danger {
  background-color: var(--dt-callbar-color-decline-red);
}
.incoming-call__button--danger:hover {
  background-color: hsla(0, 100%, 67%, 0.8);
}

/* Ring countdown: a fill sweeps across Decline once, then is removed. */
@keyframes incoming-call-timer {
  from { width: 0%; }
  to { width: 100%; }
}

.incoming-call__button--timeout::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--dt-color-foreground-critical);
  opacity: 0.6;
  z-index: 1;
  animation: incoming-call-timer var(--timeout) linear forwards;
  pointer-events: none;
}
</style>
