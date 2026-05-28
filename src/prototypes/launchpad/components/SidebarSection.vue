<template>
  <div class="sidebar-section">
    <button class="sidebar-section-header" @click="isOpen = !isOpen">
      <span class="sidebar-chevron-wrapper">
        <svg
          class="sidebar-chevron"
          :class="{ 'sidebar-chevron--closed': !isOpen }"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </span>
      <span class="sidebar-section-title d-label-compact-small">{{ title }}</span>
      <span v-if="statusLabel" class="sidebar-section-status">
        <span class="status-dot"></span>
        {{ statusLabel }}
      </span>
    </button>
    <div v-if="isOpen" class="sidebar-section-items">
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="sidebar-row"
        :class="{ 'sidebar-row--active': item.active }"
      >
        <div class="sidebar-row-left">
          <template v-if="item.avatar">
            <div class="sidebar-avatar" :style="{ background: item.avatarColor }">
              {{ item.avatar }}
            </div>
            <span v-if="item.status === 'busy'" class="sidebar-avatar-status sidebar-avatar-status--busy"></span>
          </template>
          <template v-else-if="item.icon === 'channel'">
            <span class="sidebar-icon">#</span>
          </template>
          <template v-else-if="item.icon === 'group'">
            <svg class="sidebar-icon-svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="7" cy="7" r="3" stroke="#666" stroke-width="1.5" fill="none"/>
              <circle cx="13" cy="7" r="3" stroke="#666" stroke-width="1.5" fill="none"/>
              <path d="M1 17c0-3 3-5 6-5s6 2 6 5" stroke="#666" stroke-width="1.5" fill="none"/>
            </svg>
          </template>
          <template v-else-if="item.icon === 'contact-center'">
            <svg class="sidebar-icon-svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 15v-2a6 6 0 0 1 12 0v2" stroke="#666" stroke-width="1.5" fill="none"/>
              <circle cx="10" cy="6" r="3" stroke="#666" stroke-width="1.5" fill="none"/>
            </svg>
          </template>
          <template v-else-if="item.icon === 'square'">
            <span class="sidebar-color-square" :style="{ background: item.iconColor }"></span>
          </template>
          <template v-else-if="item.icon === 'user'">
            <span class="sidebar-icon-svg">
              <DtIcon name="user" :size="16" />
            </span>
          </template>
          <div class="sidebar-row-text">
            <span class="sidebar-row-label d-body-small">{{ item.label }}</span>
            <span v-if="item.subtitle" class="sidebar-row-subtitle d-body-compact-small" style="color: var(--dt-color-foreground-secondary);">{{ item.subtitle }}</span>
          </div>
        </div>
      </div>
      <a v-if="footerLink" class="sidebar-footer-link d-body-compact-small" href="#">{{ footerLink }}</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DtIcon from '../../../components/icons/DtIcon.vue'

const props = defineProps({
  title: String,
  items: Array,
  defaultOpen: { type: Boolean, default: true },
  statusLabel: { type: String, default: '' },
  footerLink: { type: String, default: '' },
})

const isOpen = ref(props.defaultOpen)
</script>

<style scoped>
.sidebar-section {
  padding: 0 8px;
}

.sidebar-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 4px 8px;
  border: none;
  background: none;
  cursor: pointer;
  height: 28px;
}

.sidebar-chevron-wrapper {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-section-title {
  color: var(--dt-color-foreground-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-section-status {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #4CAF50;
  font-size: var(--dt-font-size-100);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4CAF50;
}

.sidebar-chevron {
  color: var(--dt-color-foreground-secondary);
  transition: transform 0.15s;
  flex-shrink: 0;
}

.sidebar-chevron--closed {
  transform: rotate(-90deg);
}

.sidebar-section-items {
  display: flex;
  flex-direction: column;
}

.sidebar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  min-height: 36px;
}

.sidebar-row:hover {
  background: var(--dt-color-surface-secondary);
}

.sidebar-row--active {
  background: var(--dt-color-surface-moderate);
}

.sidebar-row-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  position: relative;
}

.sidebar-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
}

.sidebar-avatar-status {
  position: absolute;
  bottom: 2px;
  left: 17px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid var(--dt-color-surface-primary);
}

.sidebar-avatar-status--busy {
  background: #E53935;
}

.sidebar-icon {
  width: 24px;
  text-align: center;
  color: var(--dt-color-foreground-secondary);
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

.sidebar-icon-svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.sidebar-color-square {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
  margin: 0 6px;
}

.sidebar-row-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sidebar-row-label {
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-row-subtitle {
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-footer-link {
  color: var(--dt-color-link-primary);
  padding: 6px 8px;
  text-decoration: none;
}

.sidebar-footer-link:hover {
  text-decoration: underline;
}
</style>
