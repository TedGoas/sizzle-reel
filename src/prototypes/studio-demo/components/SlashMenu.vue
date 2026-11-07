<template>
  <Teleport to="body">
    <div class="slash-host">
      <div v-if="showSlashMenu" class="slash-menu-overlay" @click="closeAll" />

      <div
        v-if="showSlashMenu"
        class="slash-command-menu"
        :style="slashMenuPositionStyle"
        @mousedown="keepEditorFocus"
      >
        <div class="slash-section-label">Actions</div>
        <div class="slash-actions-scroll">
          <div
            v-for="(action, index) in filteredActions"
            :key="action.id"
            class="slash-action-item"
            :class="{ selected: index === selectedMenuIndex && !activeSubmenu }"
            @click="handleActionClick(action)"
            @mouseenter="hoverAction(index)"
          >
            <span class="slash-source-icon" aria-hidden="true">
              <GoogleCalendarIcon v-if="action.source === 'google-calendar'" />
              <MessageCircleTextIcon v-else-if="action.source === 'message'" />
              <MailIcon v-else-if="action.source === 'mail'" />
              <ZoomIcon v-else-if="action.source === 'zoom'" />
            </span>
            <span>{{ action.label }}</span>
          </div>
          <div v-if="!filteredActions.length" class="slash-no-results">No actions found</div>
        </div>
        <div class="slash-divider" />
        <div
          v-for="command in menuCommands"
          :key="command.id"
          class="slash-menu-row"
          :class="{ selected: activeSubmenu === command.id }"
          @mouseenter="openSubmenu(command, $event)"
          @click="openSubmenu(command, $event)"
        >
          <svg v-if="command.id === 'transfer'" class="slash-row-icon" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2.5 5.5h9M9.5 3.2 12.2 5.5 9.5 7.8M13.5 10.5h-9M6.5 8.2 3.8 10.5 6.5 12.8" />
          </svg>
          <svg v-else class="slash-row-icon" viewBox="0 0 16 16" aria-hidden="true">
            <rect x="2.2" y="2.2" width="4.6" height="4.6" rx="1" />
            <rect x="9.2" y="2.2" width="4.6" height="4.6" rx="1" />
            <rect x="2.2" y="9.2" width="4.6" height="4.6" rx="1" />
            <rect x="9.2" y="9.2" width="4.6" height="4.6" rx="1" />
          </svg>
          <span class="slash-row-label">{{ command.label }}</span>
          <svg class="slash-chevron" viewBox="0 0 12 12" aria-hidden="true"><path d="M4.5 2.5 8 6 4.5 9.5" /></svg>
        </div>
      </div>

      <div
        v-if="activeSubmenu === 'transfer'"
        class="slash-submenu slash-transfer-submenu"
        :style="submenuPositionStyle"
        @mousedown="keepEditorFocus"
      >
        <div class="slash-section-label">Digital</div>
        <div
          v-for="item in transferSubmenu.digital"
          :key="item.id"
          class="slash-submenu-item"
          @click.stop="handleTransferItemClick(item, 'digital')"
        >{{ item.label }}</div>
        <div class="slash-divider" />
        <div class="slash-section-label slash-section-label--spaced">Voice</div>
        <div
          v-for="item in transferSubmenu.voice"
          :key="item.id"
          class="slash-submenu-item"
          @click.stop="handleTransferItemClick(item, 'voice')"
        >{{ item.label }}</div>
      </div>

      <div
        v-if="activeSubmenu === 'workflow'"
        class="slash-submenu slash-workflow-submenu"
        :style="submenuPositionStyle"
        @mousedown="keepEditorFocus"
      >
        <div class="slash-workflow-search">
          <input
            v-model="workflowSearch"
            class="slash-search-input"
            type="text"
            placeholder="Search workflows"
            aria-label="Search workflows"
            @keydown.escape.stop.prevent="clearSubmenu"
          />
        </div>
        <template v-if="!workflowSearch">
          <div class="slash-section-label slash-section-label--spaced">Digital</div>
          <div
            v-for="item in workflowSubmenu.digital"
            :key="item.id"
            class="slash-submenu-item"
            @click.stop="handleWorkflowItemClick(item, $event)"
            @mouseenter="clearTarget"
          >{{ item.label }}</div>
          <div class="slash-divider" />
          <div class="slash-section-label slash-section-label--spaced">Voice</div>
          <div
            v-for="item in workflowSubmenu.voice"
            :key="item.id"
            class="slash-submenu-item"
            :class="{ selected: activeTargetItem?.id === item.id }"
            @click.stop="handleWorkflowItemClick(item, $event)"
            @mouseenter="hoverWorkflowItem(item, $event)"
          >
            <span class="slash-submenu-label">{{ item.label }}</span>
            <template v-if="item.targets">
              <span class="slash-target-count">{{ item.targets.length }}</span>
              <svg class="slash-chevron" viewBox="0 0 12 12" aria-hidden="true"><path d="M4.5 2.5 8 6 4.5 9.5" /></svg>
            </template>
          </div>
        </template>
        <template v-else>
          <div
            v-for="item in filteredWorkflowItems"
            :key="item.id"
            class="slash-submenu-item"
            @click.stop="handleWorkflowItemClick(item, $event)"
          >
            <span class="slash-submenu-label">{{ item.label }}</span>
            <template v-if="item.targets">
              <span class="slash-target-count">{{ item.targets.length }}</span>
              <svg class="slash-chevron" viewBox="0 0 12 12" aria-hidden="true"><path d="M4.5 2.5 8 6 4.5 9.5" /></svg>
            </template>
          </div>
          <div v-if="!filteredWorkflowItems.length" class="slash-no-results">No workflows found</div>
        </template>
      </div>

      <div
        v-if="activeTargetItem"
        class="slash-submenu slash-targets-submenu"
        :style="targetSubmenuPositionStyle"
        @mousedown="keepEditorFocus"
      >
        <div class="slash-section-label">Targets</div>
        <div
          v-for="(target, index) in activeTargetItem.targets"
          :key="index"
          class="slash-submenu-item"
          @click.stop="handleTargetClick(target)"
        >{{ target }}</div>
      </div>

      <div v-if="showActionPanel && actionPanelItem" class="transfer-panel-scrim" @click="closeActionPanel">
        <div class="transfer-panel" @click.stop>
          <div class="transfer-panel-header">
            <div class="transfer-panel-meta">
              <span class="transfer-panel-eyebrow">{{ actionPanelItem.section }}</span>
              <span class="transfer-panel-title">{{ actionPanelItem.label }}</span>
            </div>
            <button type="button" class="transfer-close" aria-label="Close" @mousedown.stop @click="closeActionPanel">
              <svg viewBox="0 0 12 12"><path d="M3 3l6 6M9 3 3 9" /></svg>
            </button>
          </div>
          <div class="transfer-combobox">
            <div class="transfer-combobox-field">
              <input
                v-model="transferSearch"
                class="slash-search-input transfer-input"
                type="text"
                placeholder="Type or select..."
                aria-label="Transfer destination"
                @focus="onTransferFocus"
                @blur="onTransferBlur"
              />
              <svg class="transfer-combobox-chevron" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M5 6.2 8 3.5 11 6.2M5 9.8 8 12.5 11 9.8" />
              </svg>
            </div>
            <div v-if="showTransferDropdown" class="transfer-dropdown" @mousedown.prevent>
              <div
                v-for="option in filteredTransferOptions"
                :key="option.value"
                class="transfer-dropdown-row"
                @mousedown.prevent="selectTransferOption(option)"
              >
                <span class="transfer-dropdown-label">{{ option.label }}</span>
                <span v-if="option.role" class="transfer-dropdown-role">{{ option.role }}</span>
              </div>
              <div v-if="!filteredTransferOptions.length" class="transfer-dropdown-empty">No results</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useSlashCommand } from '../composables/useSlashCommand.js'
import GoogleCalendarIcon from './GoogleCalendarIcon.vue'
import MailIcon from './MailIcon.vue'
import MessageCircleTextIcon from './MessageCircleTextIcon.vue'
import ZoomIcon from './ZoomIcon.vue'

const {
  showSlashMenu,
  showActionPanel,
  activeSubmenu,
  activeTargetItem,
  actionPanelItem,
  selectedMenuIndex,
  workflowSearch,
  transferSearch,
  showTransferDropdown,
  menuCommands,
  transferSubmenu,
  workflowSubmenu,
  filteredActions,
  filteredWorkflowItems,
  filteredTransferOptions,
  slashMenuPositionStyle,
  submenuPositionStyle,
  targetSubmenuPositionStyle,
  onKeydown,
  keepEditorFocus,
  closeAll,
  closeActionPanel,
  openSubmenu,
  openTargetSubmenu,
  handleActionClick,
  handleTransferItemClick,
  handleWorkflowItemClick,
  handleTargetClick,
  selectTransferOption,
} = useSlashCommand()

function hoverAction(index) {
  selectedMenuIndex.value = index
  activeSubmenu.value = null
  activeTargetItem.value = null
}

function clearSubmenu() {
  activeSubmenu.value = null
}

function clearTarget() {
  activeTargetItem.value = null
}

function hoverWorkflowItem(item, event) {
  if (item.targets) openTargetSubmenu(item, event)
  else activeTargetItem.value = null
}

function onTransferFocus() {
  showTransferDropdown.value = true
}

function onTransferBlur() {
  showTransferDropdown.value = false
}

defineExpose({ onKeydown })
</script>

<style scoped>
.slash-host {
  display: contents;
}

.slash-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: transparent;
}

.slash-command-menu {
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 240px;
  padding: 8px;
  background: #f9f9f9;
  border: 1px solid rgba(28, 28, 28, 0.11);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.slash-section-label {
  padding: 2px 8px;
  color: #808080;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1.4;
  text-transform: uppercase;
}

.slash-section-label--spaced {
  padding-top: 4px;
}

.slash-actions-scroll {
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-height: 190px;
  overflow-y: auto;
}

.slash-action-item,
.slash-menu-row,
.slash-submenu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  color: #1c1c1c;
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
}

.slash-action-item {
  padding: 4px 8px;
}

.slash-menu-row,
.slash-submenu-item {
  padding: 5px 8px;
}

.slash-action-item:hover,
.slash-action-item.selected,
.slash-menu-row:hover,
.slash-menu-row.selected,
.slash-submenu-item:hover,
.slash-submenu-item.selected {
  background: rgba(28, 28, 28, 0.08);
}

.slash-source-icon {
  display: inline-flex;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.slash-source-icon svg {
  width: 16px;
  height: 16px;
}

.slash-divider {
  height: 1px;
  margin: 3px 0;
  background: rgba(28, 28, 28, 0.1);
}

.slash-row-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  fill: none;
  stroke: #555;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.slash-row-label,
.slash-submenu-label {
  flex: 1;
}

.slash-chevron {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  fill: none;
  stroke: #999;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.slash-no-results {
  padding: 8px;
  color: #999;
  font-size: 13px;
  text-align: center;
}

.slash-submenu {
  position: fixed;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 180px;
  max-height: calc(100vh - 32px);
  padding: 8px;
  overflow-y: auto;
  background: #f9f9f9;
  border: 1px solid rgba(28, 28, 28, 0.11);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.slash-submenu-item {
  gap: 4px;
}

.slash-target-count {
  padding: 0 2px;
  color: #999;
  font-size: 13px;
}

.slash-workflow-submenu {
  min-width: 240px;
  border-radius: 16px;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.03),
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 2px 16px rgba(0, 0, 0, 0.08);
}

.slash-workflow-search {
  padding: 4px 4px 8px;
}

.slash-search-input {
  width: 100%;
  height: 32px;
  padding: 0 10px;
  border: 1px solid rgba(28, 28, 28, 0.16);
  border-radius: 8px;
  background: #fff;
  color: #1c1c1c;
  font: inherit;
  font-size: 14px;
  outline: none;
}

.slash-search-input:focus {
  border-color: #7c52ff;
}

.slash-targets-submenu {
  z-index: 1002;
  min-width: 160px;
}

.transfer-panel-scrim {
  position: fixed;
  z-index: 1100;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
}

.transfer-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 320px;
  padding: 16px;
  overflow: visible;
  background: #fff;
  border: 1px solid rgba(28, 28, 28, 0.11);
  border-radius: 16px;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.03),
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 2px 16px rgba(0, 0, 0, 0.08);
}

.transfer-panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.transfer-panel-meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.transfer-panel-eyebrow {
  color: #535353;
  font-size: 12px;
  line-height: 1.4;
  text-transform: uppercase;
}

.transfer-panel-title {
  color: #3a3a3a;
  font-size: 15px;
  font-weight: 590;
  line-height: 1.4;
}

.transfer-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: #666;
  cursor: pointer;
}

.transfer-close svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
}

.transfer-combobox {
  position: relative;
}

.transfer-combobox-field {
  position: relative;
}

.transfer-input {
  padding-right: 28px;
}

.transfer-combobox-chevron {
  position: absolute;
  top: 50%;
  right: 8px;
  width: 16px;
  height: 16px;
  fill: none;
  stroke: #808080;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  transform: translateY(-50%);
  pointer-events: none;
}

.transfer-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  left: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 220px;
  padding: 8px;
  overflow-y: auto;
  background: #f9f9f9;
  border: 1px solid rgba(28, 28, 28, 0.11);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.transfer-dropdown-row {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
}

.transfer-dropdown-row:hover {
  background: rgba(28, 28, 28, 0.1);
}

.transfer-dropdown-label {
  flex: 1;
  color: #1c1c1c;
  font-size: 15px;
  line-height: 1.6;
}

.transfer-dropdown-role {
  color: #808080;
  font-size: 12px;
  line-height: 1.4;
}

.transfer-dropdown-empty {
  padding: 8px;
  color: #808080;
  font-size: 14px;
  text-align: center;
}
</style>
