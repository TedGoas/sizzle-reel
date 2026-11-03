<!--
  Active call bar, ported from design-studio
  (prototypes/dialpad-app/components/Callbar.vue, overlays/CallbarOverlay.vue,
  ContactInformation.vue, ContactCenterPill.vue). Connected state only.
-->
<template>
  <Transition name="callbar">
    <div v-if="show" class="callbar__wrapper">
      <div class="callbar">
        <div class="callbar__contact">
          <div class="callbar__avatar">{{ initials }}</div>
          <div class="callbar__caller">
            <div class="callbar__name-row">
              <h3 class="d-headline--lg-compact callbar__name">{{ name }}</h3>
              <span class="d-body--sm-compact callbar__time">{{ formattedTime }}</span>
            </div>
            <div class="callbar__meta">
              <span class="d-body--sm-compact callbar__nowrap">{{ phone }}</span>
              <svg width="4" height="5" viewBox="0 0 4 5" aria-hidden="true">
                <circle cx="2" cy="2.5" r="2" fill="currentColor" />
              </svg>
              <span v-if="contactCenter" class="callbar__contact-center">
                <span class="callbar__contact-center-indicator" />
                <span class="d-body--sm callbar__nowrap">{{ contactCenter }}</span>
              </span>
            </div>
          </div>
        </div>

        <div class="callbar__controls">
          <CallbarControlButton label="Ai On">
            <template #icon>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M7.89063 7.96195H2.5M10.0521 3.8667H2.5M10.6667 12.0572H2.5M13.1642 16.1525H2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  fill="var(--dt-callbar-color-ai)"
                  d="M14.9023 4.07487C14.8009 3.85175 14.5784 3.7085 14.3333 3.7085C14.0882 3.7085 13.8658 3.85175 13.7644 4.07487L12.8197 6.15317L10.7414 7.09785C10.5183 7.19927 10.375 7.42174 10.375 7.66683C10.375 7.91192 10.5183 8.13439 10.7414 8.23581L12.8197 9.18049L13.7644 11.2588C13.8658 11.4819 14.0882 11.6252 14.3333 11.6252C14.5784 11.6252 14.8009 11.4819 14.9023 11.2588L15.847 9.18049L17.9253 8.23581C18.1484 8.13439 18.2917 7.91192 18.2917 7.66683C18.2917 7.42174 18.1484 7.19927 17.9253 7.09785L16.7795 6.57702L15.847 6.15317L14.9023 4.07487ZM13.8606 6.88379L14.3333 5.84388L14.806 6.88379C14.8686 7.02136 14.9788 7.13161 15.1164 7.19414L16.1563 7.66683L15.1164 8.13952C14.9788 8.20205 14.8686 8.3123 14.806 8.44987L14.3333 9.48978L13.8606 8.44987C13.7981 8.3123 13.6879 8.20205 13.5503 8.13952L12.5104 7.66683L13.5503 7.19414C13.6879 7.13161 13.7981 7.02136 13.8606 6.88379ZM18.2917 12C18.2917 11.6548 18.0118 11.375 17.6667 11.375C17.3215 11.375 17.0417 11.6548 17.0417 12V13.0417H16C15.6548 13.0417 15.375 13.3215 15.375 13.6667C15.375 14.0118 15.6548 14.2917 16 14.2917H17.0417V15.3333C17.0417 15.6785 17.3215 15.9583 17.6667 15.9583C18.0118 15.9583 18.2917 15.6785 18.2917 15.3333V14.2917L19.3333 14.2917C19.6785 14.2917 19.9583 14.0118 19.9583 13.6667C19.9583 13.3215 19.6785 13.0417 19.3333 13.0417H18.2917V12Z"
                />
              </svg>
            </template>
          </CallbarControlButton>
          <CallbarControlButton label="Mute" active-label="Unmute" icon="mic" active-icon="mic-off" kind="critical" toggleable />
          <CallbarControlButton label="Hold" active-label="Resume" icon="hold" toggleable />
          <CallbarControlButton label="Transfer" icon="transfer" />
          <CallbarControlButton label="Record" icon="record-filled" />
          <CallbarControlButton label="Keypad" icon="keypad" />
          <CallbarControlButton label="Park" icon="park" />
          <CallbarControlButton label="Add" icon="user-plus" />
          <CallbarControlButton label="Share" icon="share-screen" />
        </div>

        <div class="callbar__end">
          <button class="callbar__end-button" @click="emit('end-call')">
            <DtIcon name="phone-hang-up" :size="16" />
            <span class="d-label--md-compact">End</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import DtIcon from '@/components/icons/DtIcon.vue'
import CallbarControlButton from './CallbarControlButton.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  name: { type: String, default: '' },
  phone: { type: String, default: '' },
  contactCenter: { type: String, default: '' },
  formattedTime: { type: String, default: '00:00' },
})

const emit = defineEmits(['end-call'])

const initials = computed(() =>
  (props.name || '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
)
</script>

<style scoped>
.callbar__wrapper {
  --callbar-transition: cubic-bezier(0.34, 1.56, 0.64, 1);
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--dt-space-500);
  z-index: 200;
  pointer-events: none;
}

.callbar-enter-active {
  transition: transform 0.65s var(--callbar-transition), opacity var(--td300) var(--callbar-transition);
}

.callbar-leave-active {
  transition: transform 0.5s var(--callbar-transition), opacity 0.4s var(--callbar-transition);
}

.callbar-enter-from,
.callbar-leave-to {
  transform: translateY(50%);
  opacity: 0;
}

.callbar {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-400);
  width: 100%;
  min-width: 384px;
  max-width: 1340px;
  height: 84px;
  padding: var(--dt-space-200) var(--dt-space-550) var(--dt-space-200) var(--dt-space-400);
  border-radius: var(--dt-size-radius-pill);
  background-color: var(--dt-callbar-color-surface-primary);
  backdrop-filter: blur(2px);
  color: var(--dt-color-foreground-primary-inverted);
}

.callbar__contact {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  min-width: 0;
  flex-shrink: 1;
  padding: var(--dt-space-200) var(--dt-space-400);
  border-radius: var(--dt-size-radius-pill);
  transition: background-color var(--td200) var(--ttf-out-quint);
}

.callbar__contact:hover {
  background-color: hsla(0, 0%, 100%, 0.1);
}

.callbar__avatar {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dt-avatar-color-background-1100);
  color: var(--dt-color-neutral-black);
  font: var(--dt-typography-label-md-compact);
}

.callbar__caller {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-200);
  min-width: 0;
  padding-right: var(--dt-space-500);
}

.callbar__name-row {
  display: flex;
  align-items: baseline;
  gap: var(--dt-space-400);
}

.callbar__name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.callbar__time {
  color: var(--dt-color-foreground-tertiary-inverted);
  font-variant-numeric: tabular-nums;
}

.callbar__meta {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  color: var(--dt-color-foreground-tertiary-inverted);
}

.callbar__nowrap {
  white-space: nowrap;
}

.callbar__contact-center {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
}

.callbar__contact-center-indicator {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background-color: var(--dt-color-magenta-200);
}

/* Buttons that don't fit wrap onto a hidden second row, so only whole buttons show. */
.callbar__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  column-gap: var(--dt-space-400);
  flex: 1 1 auto;
  min-width: 0;
  height: 64px;
  overflow: hidden;
}

.callbar__end {
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.callbar__end-button {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-400);
  height: var(--btn-height-callbar);
  padding: 0 var(--dt-space-500);
  border-radius: var(--dt-size-radius-pill);
  background-color: var(--dt-action-color-background-critical-primary-default);
  color: var(--dt-color-neutral-white);
  transition: background-color var(--td200) var(--ttf-out-quint);
}

.callbar__end-button:hover {
  background-color: var(--dt-action-color-background-critical-primary-hover);
}
</style>
