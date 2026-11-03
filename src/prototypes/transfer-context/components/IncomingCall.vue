<!--
  Incoming call notification, ported from design-studio
  (prototypes/dialpad-app/components/incoming-call/IncomingCall.vue + IncomingCallButton.vue
  + overlays/IncomingCallOverlay.vue). The `summary` slot is kept for transfer context.
-->
<template>
  <Transition name="incoming-call">
    <div v-if="show" class="incoming-call__wrapper">
      <div class="incoming-call">
        <div class="incoming-call__main">
          <div class="incoming-call__avatar">{{ initials }}</div>
          <div class="incoming-call__details">
            <div class="incoming-call__name-row">
              <h3 class="incoming-call__name">{{ name || phone }}</h3>
              <!-- attestation: inline because it relies on a clip-path DtIcon doesn't support -->
              <svg class="incoming-call__attestation" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <clipPath id="incoming-call-attestation-clip"><rect width="12" height="12" rx="4" /></clipPath>
                <path
                  clip-path="url(#incoming-call-attestation-clip)"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 0H0v12h12V0ZM9.442 4.442a.625.625 0 1 0-.884-.884L5 7.116 3.442 5.558a.625.625 0 1 0-.884.884l2 2c.244.244.64.244.884 0l4-4Z"
                />
              </svg>
            </div>
            <p v-if="phone && name" class="d-body--md-compact">Mobile: {{ phone }}</p>
            <div v-if="$slots.summary" class="incoming-call__summary">
              <span class="incoming-call__summary-rule" />
              <div class="incoming-call__summary-content">
                <slot name="summary" />
              </div>
            </div>
          </div>
        </div>
        <div class="incoming-call__buttons">
          <button class="incoming-call__button incoming-call__button--success" @click="emit('answer')">
            <DtIcon name="phone" :size="16" />
            <span class="d-label--md-compact">Answer</span>
          </button>
          <button
            class="incoming-call__button incoming-call__button--danger"
            :class="{ 'incoming-call__button--timeout': !timedOut }"
            :style="{ '--timeout': `${timeout}ms` }"
            @click="emit('decline')"
            @animationend="timedOut = true"
          >
            <DtIcon name="close" :size="16" />
            <span class="d-label--md-compact">Decline</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import DtIcon from '@/components/icons/DtIcon.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  name: { type: String, default: '' },
  phone: { type: String, default: '' },
  // Decline progress duration. When it ends the card stays up and the fill is removed.
  timeout: { type: Number, default: 10000 },
})

const emit = defineEmits(['answer', 'decline'])

const timedOut = ref(false)
watch(() => props.show, (show) => { if (show) timedOut.value = false })

const initials = computed(() =>
  (props.name || '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
)
</script>

<style scoped>
.incoming-call__wrapper {
  --incoming-call-transition: cubic-bezier(0.34, 1.56, 0.64, 1);
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

.incoming-call {
  display: flex;
  flex-direction: column;
  width: 464px;
  min-width: 332px;
  max-width: 464px;
  overflow: hidden;
  border-radius: 24px 24px 32px 32px;
  background-color: var(--dt-callbar-color-surface-primary);
  backdrop-filter: blur(8px);
  color: var(--dt-color-foreground-primary-inverted);
}

.incoming-call__main {
  display: flex;
  align-items: flex-start;
  gap: var(--dt-space-450);
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
  background: var(--dt-avatar-color-background-1700);
  color: var(--dt-color-neutral-black);
  font: var(--dt-typography-label-sm-compact);
}

.incoming-call__details {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
}

.incoming-call__name-row {
  display: flex;
  align-items: baseline;
  gap: var(--dt-space-300);
}

.incoming-call__name {
  font: var(--dt-typography-headline-lg-compact);
}

.incoming-call__attestation {
  color: var(--dt-color-foreground-muted-inverted);
}

.incoming-call__summary {
  display: flex;
  gap: var(--dt-space-200);
  margin-top: var(--dt-space-400);
}

.incoming-call__summary-rule {
  width: 4px;
  flex-shrink: 0;
  align-self: stretch;
  border-radius: var(--dt-size-radius-pill);
  background: var(--dt-color-surface-strong);
}

.incoming-call__summary-content {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
  padding: 0 0 var(--dt-space-400) var(--dt-space-450);
}

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
  gap: var(--dt-space-400);
  min-height: var(--btn-height-call);
  padding: var(--dt-space-400);
  border-radius: var(--dt-size-radius-pill);
  color: var(--dt-color-neutral-black);
  transition: background-color var(--td300) var(--ttf-out-quint);
}

.incoming-call__button > * {
  position: relative;
  z-index: 2;
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
  background-color: var(--dt-color-red-300);
  opacity: 0.6;
  z-index: 1;
  animation: incoming-call-timer var(--timeout) linear forwards;
  pointer-events: none;
}
</style>
