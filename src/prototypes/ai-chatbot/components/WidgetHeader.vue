<template>
  <div class="widget-header">
    <div class="header-left">
      <Transition name="avatar-swap" mode="out-in">
        <div
          :key="config.name"
          class="header-avatar"
          :style="{ backgroundColor: config.avatarColor }"
        >
          <svg v-if="config.name === 'Aerobot'" width="20" height="10" viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M23.8682 7.14697L21.5409 0H15.9998L18.8574 8.77795C19.3785 10.378 20.6315 11.6322 22.2315 12.1556L32.0001 15.3465V9.80418L23.867 7.14812L23.8682 7.14697Z" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.13301 7.14706L10.4592 8.85725e-05H16.0003L13.1427 8.77804C12.6216 10.3781 11.3686 11.6322 9.76855 12.1557L0 15.3466V9.80427L8.13301 7.14821V7.14706Z" fill="white"/>
          </svg>
          <span v-else class="agent-initial">S</span>
        </div>
      </Transition>
      <Transition name="text-swap" mode="out-in">
        <div :key="config.name" class="header-info">
          <span class="header-name">{{ config.name }}</span>
          <span class="header-role">{{ config.role }}</span>
        </div>
      </Transition>
    </div>
    <div class="header-actions">
      <button class="header-btn" aria-label="Minimize">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 12h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
      <button class="header-btn" aria-label="Close" @click="$emit('close')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])

defineProps({
  config: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #E8E8E8;
  background: #fff;
  border-radius: 16px 16px 0 0;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.agent-initial {
  color: #fff;
  font-weight: 600;
  font-size: 15px;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.header-name {
  font-weight: 600;
  font-size: 14px;
  color: #1C1C1C;
  line-height: 1.2;
}

.header-role {
  font-size: 12px;
  color: #9A9A9A;
  line-height: 1.2;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.header-btn {
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
  transition: background-color 0.15s, color 0.15s;
}

.header-btn:hover {
  background: #F5F5F5;
  color: #535353;
}

/* Transition: avatar crossfade */
.avatar-swap-enter-active,
.avatar-swap-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.avatar-swap-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.avatar-swap-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Transition: text crossfade */
.text-swap-enter-active,
.text-swap-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.text-swap-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.text-swap-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
