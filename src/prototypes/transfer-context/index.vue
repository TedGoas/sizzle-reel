<template>
  <div class="transfer-context-app">
    <TopBar />
    <div class="transfer-context-body">
      <LeftSidebar :active-label="openConversation.label" :recent="callerRecent" />
      <main class="transfer-context-content">
        <ConversationView
          class="transfer-context-conversation"
          :class="{ 'transfer-context-conversation--with-callbar': callState === 'active' }"
          :name="openConversation.label"
          :phone="openConversation.phone"
          :initials="openConversation.initials"
          :avatar-color="openConversation.avatarColor"
          :avatar-text-color="openConversation.avatarTextColor"
        />

        <!-- Slides in on Accept and stays open after the call ends. -->
        <Transition name="sidebar">
          <div
            v-if="sidebarOpen"
            class="transfer-context-sidebar"
            :class="{ 'is-resizing': resizing }"
            :style="{ '--sidebar-width': `${sidebarWidth}px` }"
          >
            <button
              type="button"
              class="resize-handle"
              aria-label="Resize sidebar"
              @pointerdown="startResize"
            />
            <TransferSidebar
              :caller="caller"
              :context="transferContext"
              :salesforce="salesforce"
              @close="sidebarOpen = false"
            />
          </div>
        </Transition>

        <IncomingCall
          :show="callState === 'ringing'"
          :caller="caller"
          :context="transferContext"
          :timeout="TIMING.ringTimeoutMs"
          @accept="acceptCall"
          @decline="endCall"
        />

        <Callbar
          :show="callState === 'active'"
          :name="caller.name"
          :phone="caller.phone"
          :contact-center="transferContext.queue"
          :formatted-time="formattedTime"
          @end-call="endCallToWrapUp"
        />

        <WrapUpModal
          :show="callState === 'wrapup'"
          :caller="caller"
          :duration="formattedTime"
          :options="dispositions"
          :draft="wrapUpDraft"
          @done="callState = 'idle'"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import TopBar from '@/components/TopBar.vue'
import LeftSidebar from './components/LeftSidebar.vue'
import ConversationView from './components/ConversationView.vue'
import IncomingCall from './components/IncomingCall.vue'
import Callbar from './components/Callbar.vue'
import TransferSidebar from './components/TransferSidebar.vue'
import WrapUpModal from './components/WrapUpModal.vue'
import { caller, transferContext, salesforce, selectedContact, dispositions, wrapUpDraft, TIMING } from './data.js'

// 'idle' → 'ringing' → 'active' → 'wrapup' → 'idle'
// Declining while ringing skips wrap-up.
const callState = ref('idle')
const secondsElapsed = ref(0)
const sidebarOpen = ref(false)

// Accepting the call opens the caller's conversation and adds them to Recents.
const callerConnected = ref(false)
const callerRecent = computed(() => callerConnected.value ? {
  label: caller.name,
  initials: caller.initials,
  avatar: caller.initials,
  avatarColor: 'var(--dt-avatar-color-background-1600)',
  avatarTextColor: 'var(--dt-color-neutral-black)',
  phone: caller.phone,
} : null)
const openConversation = computed(() => callerRecent.value ?? {
  label: selectedContact.label,
  initials: selectedContact.initials,
  avatarColor: selectedContact.avatarColor,
})

// Sidebar width: drag its left edge between SIDEBAR_MIN and SIDEBAR_MAX.
const SIDEBAR_MIN = 340
const SIDEBAR_MAX = SIDEBAR_MIN * 2
const sidebarWidth = ref(560)
const resizing = ref(false)
let resizeStart = null

function startResize(event) {
  resizeStart = { x: event.clientX, width: sidebarWidth.value }
  resizing.value = true
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('pointermove', moveResize)
  document.addEventListener('pointerup', endResize)
  document.addEventListener('pointercancel', endResize)
}

function moveResize(event) {
  if (!resizeStart) return
  const next = resizeStart.width + (resizeStart.x - event.clientX)
  sidebarWidth.value = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, next))
}

function endResize() {
  resizeStart = null
  resizing.value = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  document.removeEventListener('pointermove', moveResize)
  document.removeEventListener('pointerup', endResize)
  document.removeEventListener('pointercancel', endResize)
}
let ringTimer = null
let callTimer = null

const formattedTime = computed(() => {
  const m = String(Math.floor(secondsElapsed.value / 60)).padStart(2, '0')
  const s = String(secondsElapsed.value % 60).padStart(2, '0')
  return `${m}:${s}`
})

function acceptCall() {
  callState.value = 'active'
  sidebarOpen.value = true
  callerConnected.value = true
  secondsElapsed.value = 0
  callTimer = setInterval(() => { secondsElapsed.value += 1 }, 1000)
}

function endCall() {
  callState.value = 'idle'
  clearInterval(callTimer)
}

// End in the callbar opens Wrap-up; the timer freezes at the final duration.
function endCallToWrapUp() {
  callState.value = 'wrapup'
  clearInterval(callTimer)
}

onMounted(() => {
  ringTimer = setTimeout(() => { callState.value = 'ringing' }, TIMING.ringDelayMs)
})

onBeforeUnmount(() => {
  endResize()
  clearTimeout(ringTimer)
  clearInterval(callTimer)
})
</script>

<style scoped>
.transfer-context-app {
  /* Callbar tokens, scoped as in design-studio's Callbar.vue [callbar-tokens] */
  --dt-callbar-color-neon-green: hsla(137, 100%, 59%, 1);
  --dt-callbar-color-critical-red: hsla(0, 89%, 49%, 1);
  --dt-callbar-color-decline-red: hsla(0, 100%, 67%, 1);
  --dt-callbar-color-ai: hsla(277, 62%, 75%, 1);
  --dt-callbar-color-surface-primary: hsla(0, 0%, 5%, 0.94);
  --dt-callbar-color-surface-secondary: hsla(0, 0%, 12%, 1);

  display: grid;
  grid-template-rows: 60px 1fr;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: var(--dt-font-family-body);
}

.transfer-context-body {
  display: grid;
  grid-template-columns: 300px 1fr;
  overflow: hidden;
}

.transfer-context-content {
  position: relative;
  display: flex;
  min-height: 0;
  overflow: hidden;
}

.transfer-context-conversation {
  flex: 1;
  min-width: 0;
  transition: padding-bottom var(--td300) var(--ttf-out-quint);
}

.transfer-context-sidebar {
  position: relative;
  flex-shrink: 0;
  width: var(--sidebar-width);
  overflow: hidden;
}

.resize-handle {
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  left: 0;
  width: 10px;
  cursor: col-resize;
  touch-action: none;
}

.resize-handle::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  background: transparent;
  transition: background-color var(--td150) var(--ttf-out-quint);
}

.resize-handle:hover::after,
.transfer-context-sidebar.is-resizing .resize-handle::after {
  background: var(--dt-color-border-moderate);
}

/* Width animates so the conversation reflows; the panel slides in from the right. */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: width var(--td300) var(--ttf-out-quint);
}

.sidebar-enter-active :deep(.transfer-sidebar),
.sidebar-leave-active :deep(.transfer-sidebar) {
  transition: transform var(--td300) var(--ttf-out-quint);
}

.sidebar-enter-from,
.sidebar-leave-to {
  width: 0;
}

.sidebar-enter-from :deep(.transfer-sidebar),
.sidebar-leave-to :deep(.transfer-sidebar) {
  transform: translateX(100%);
}

/* Keep the composer clear of the callbar (84px bar + 16px inset).
   The right sidebar stays full height and scrolls under the callbar instead. */
.transfer-context-conversation--with-callbar {
  padding-bottom: 100px;
}
</style>
