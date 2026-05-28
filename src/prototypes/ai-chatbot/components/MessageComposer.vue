<template>
  <div class="message-composer">
    <button class="composer-btn" aria-label="Attach file">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M14 8.27l-5.66 5.66a4 4 0 01-5.66-5.66l5.66-5.66a2.67 2.67 0 013.77 3.77L6.44 12.05a1.33 1.33 0 01-1.88-1.88l5.3-5.3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <div class="composer-input-wrap">
      <span class="composer-input" :class="{ 'has-preview': displayText, 'is-typing': isTyping }">
        {{ displayText || 'New message...' }}
      </span>
    </div>
    <button class="composer-btn" aria-label="Emoji">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2"/>
        <circle cx="6" cy="7" r="0.75" fill="currentColor"/>
        <circle cx="10" cy="7" r="0.75" fill="currentColor"/>
        <path d="M5.5 10a3 3 0 005 0" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      </svg>
    </button>
    <button class="composer-send-btn" aria-label="Send">
      <svg width="16" height="16" viewBox="0 0 13 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M1.661 1.036a.5.5 0 0 1 .556-.083l9.546 4.597a.5.5 0 0 1 0 .9l-9.546 4.597a.5.5 0 0 1-.684-.63L3.233 6l-1.7-4.417a.5.5 0 0 1 .128-.547ZM4.111 6.5 2.92 9.599 9.355 6.5H4.11Zm5.244-1H4.11L2.92 2.401 9.355 5.5Z" fill-rule="evenodd" clip-rule="evenodd"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  previewText: {
    type: String,
    default: '',
  },
})

const displayText = ref('')
const isTyping = ref(false)
let intervalId = null

function clearTyping() {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
  isTyping.value = false
}

watch(() => props.previewText, (newVal) => {
  clearTyping()

  if (!newVal) {
    displayText.value = ''
    return
  }

  displayText.value = ''
  isTyping.value = true
  let i = 0

  intervalId = setInterval(() => {
    i++
    displayText.value = newVal.slice(0, i)
    if (i >= newVal.length) {
      clearTyping()
    }
  }, 50)
})

onUnmounted(() => {
  clearTyping()
})
</script>

<style scoped>
.message-composer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid #E8E8E8;
  background: #fff;
  border-radius: 0 0 16px 16px;
  flex-shrink: 0;
}

.composer-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9A9A9A;
  flex-shrink: 0;
  transition: color 0.15s;
}

.composer-btn:hover {
  color: #535353;
}

.composer-input-wrap {
  flex: 1;
  min-width: 0;
}

.composer-input {
  display: block;
  font-size: 13px;
  color: #BFBFBF;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.composer-input.has-preview {
  color: #1C1C1C;
}

.composer-input.is-typing::after {
  content: '';
  display: inline-block;
  width: 1px;
  height: 1em;
  background: #1C1C1C;
  margin-left: 1px;
  vertical-align: text-bottom;
  animation: blink-cursor 0.6s steps(1) infinite;
}

@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.composer-send-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #1B7D4E;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  transition: background-color 0.15s;
}

.composer-send-btn:hover {
  background: #15643E;
}
</style>
