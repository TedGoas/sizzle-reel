<template>
  <div class="transfer-context-app">
    <TopBar />
    <div class="transfer-context-body">
      <LeftSidebar :active-label="selectedContact.label" />
      <main class="transfer-context-content" :class="{ 'transfer-context-content--with-callbar': callState === 'active' }">
        <ConversationView class="transfer-context-conversation" :name="selectedContact.label" :phone="selectedContact.phone" />

        <!-- Slides in on Accept and stays open after the call ends. -->
        <Transition name="sidebar">
          <div v-if="sidebarOpen" class="transfer-context-sidebar">
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
          :timeout="RING_TIMEOUT_MS"
          @accept="acceptCall"
          @decline="endCall"
        />

        <Callbar
          :show="callState === 'active'"
          :name="caller.name"
          :phone="caller.phone"
          :contact-center="caller.contactCenter"
          :formatted-time="formattedTime"
          @end-call="endCall"
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
import { caller, transferContext, salesforce, selectedContact, RING_DELAY_MS, RING_TIMEOUT_MS } from './data/mockData.js'

// 'idle' → 'ringing' → 'active' → 'idle'
const callState = ref('idle')
const secondsElapsed = ref(0)
const sidebarOpen = ref(false)
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
  secondsElapsed.value = 0
  callTimer = setInterval(() => { secondsElapsed.value += 1 }, 1000)
}

function endCall() {
  callState.value = 'idle'
  clearInterval(callTimer)
}

onMounted(() => {
  ringTimer = setTimeout(() => { callState.value = 'ringing' }, RING_DELAY_MS)
})

onBeforeUnmount(() => {
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
  transition: padding-bottom var(--td300) var(--ttf-out-quint);
}

.transfer-context-conversation {
  flex: 1;
  min-width: 0;
}

.transfer-context-sidebar {
  flex-shrink: 0;
  width: 340px;
  overflow: hidden;
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

/* Keep the composer clear of the callbar (84px bar + 16px inset). */
.transfer-context-content--with-callbar {
  padding-bottom: 100px;
}
</style>
