<template>
  <!-- Top Left: Minimize & Agent Info -->
    <div class="floating-control top-left" :class="{ 'control-visible': !isTransitioning }">
      <button @click="$emit('exit-fullscreen')" class="floating-icon-button" title="Exit full screen">
        <dt-icon name="minimize" size="300" />
      </button>
      <div class="floating-agent-info">
        <span class="floating-agent-name">{{ agentName }}</span>
        <dt-badge type="default" text="Draft" size="sm" />
      </div>
    </div>

    <!-- Top Right: Action Buttons -->
    <div class="floating-control top-right" :class="{ 'control-visible': !isTransitioning }">
      <button class="floating-icon-button" title="More options">
        <dt-icon name="more-vertical" size="300" />
      </button>
      <button class="floating-icon-button" title="Settings">
        <dt-icon name="settings" size="300" />
      </button>
      <div class="control-divider"></div>
      <dt-button importance="clear" size="sm">
        <dt-icon name="play" size="200" style="margin-right: 4px;" />
        Test
      </dt-button>
      <dt-button importance="clear" size="sm">Save</dt-button>
      <dt-button
        ref="publishButtonRef"
        importance="outlined"
        kind="muted"
        size="sm"
        :disabled="!hasUnsavedChanges"
        @click="handlePublishClick"
      >
        Publish
      </dt-button>
    </div>

    <!-- Bottom Left: Agent Assist Button -->
    <div class="floating-control bottom-left-assist" :class="{ 'control-visible': !isTransitioning }">
      <button class="agent-assist-button" title="Agent assist">
        <dt-icon name="agent-assist" size="400" />
      </button>
    </div>

    <!-- Bottom Left: Zoom Controls -->
    <div class="floating-control bottom-left-zoom" :class="{ 'control-visible': !isTransitioning }">
      <button @click="$emit('zoom-out')" title="Zoom out" :disabled="zoomLevel <= 0.5">
        <dt-icon name="zoom-out" size="300" />
      </button>
      <button @click="$emit('zoom-in')" title="Zoom in" :disabled="zoomLevel >= 2">
        <dt-icon name="zoom-in" size="300" />
      </button>
      <button @click="$emit('reset-zoom')" title="Fit to view">
        <dt-icon name="scan" size="300" />
      </button>
      <button title="Fullscreen">
        <dt-icon name="maximize" size="300" />
      </button>
      <button title="Help">
        <dt-icon name="help-circle" size="300" />
      </button>
    </div>

    <!-- Bottom Right: Add Button -->
    <div class="floating-control bottom-right" :class="{ 'control-visible': !isTransitioning }">
      <button class="floating-add-button" title="Add element">
        <dt-icon name="plus" size="300" />
      </button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { DtIcon, DtButton, DtBadge } from '../ui'

defineProps({
  agentName: {
    type: String,
    default: ''
  },
  zoomLevel: {
    type: Number,
    required: true
  },
  isTransitioning: {
    type: Boolean,
    required: true
  },
  hasUnsavedChanges: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['exit-fullscreen', 'zoom-in', 'zoom-out', 'reset-zoom', 'publish'])

const publishButtonRef = ref(null)

function handlePublishClick() {
  const btnEl = publishButtonRef.value?.$el || publishButtonRef.value
  emit('publish', btnEl)
}
</script>
