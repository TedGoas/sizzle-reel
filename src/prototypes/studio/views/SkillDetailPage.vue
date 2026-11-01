<template>
  <div class="skill-detail-page">
    <!-- ── Sticky Header ─────────────────────────────────────────────────── -->
    <div class="skill-detail-header">
      <!-- Left: back + title + badge -->
      <div class="skill-detail-header__left">
        <dt-button
          importance="clear"
          kind="muted"
          size="sm"
          circle
          @click="state.backFromSkillDetail()"
        >
          <template #icon>
            <dt-icon name="chevron-left" size="200" />
          </template>
        </dt-button>

        <div
          class="skill-detail-header__name-wrapper"
          :data-value="skillName || 'Untitled skill'"
        >
          <input
            v-model="skillName"
            class="skill-detail-header__name-input"
            placeholder="Untitled skill"
            size="1"
          />
        </div>

        <dt-badge type="default" class="skill-detail-header__status-badge">Draft</dt-badge>
      </div>

      <!-- Right: actions -->
      <div class="skill-detail-header__actions">
        <dt-button importance="outlined" size="sm" @click="handleSave">
          Save
        </dt-button>

        <!-- Validate button — changes based on validationState -->
        <dt-button
          v-if="validationState === null"
          importance="outlined"
          size="sm"
          @click="handleValidate"
        >
          <template #icon>
            <dt-icon name="sparkle-filled" size="200" />
          </template>
          Validate
        </dt-button>

        <dt-button
          v-else-if="validationState === 'checking'"
          importance="outlined"
          size="sm"
          disabled
        >
          <template #icon>
            <dt-icon name="loading" size="200" class="spin-icon" />
          </template>
          Validating...
        </dt-button>

        <dt-button
          v-else-if="validationState === 'issues'"
          importance="outlined"
          kind="danger"
          size="sm"
          @click="handleValidate"
        >
          <template #icon>
            <dt-icon name="alert-triangle" size="200" />
          </template>
          {{ remainingIssues.length }} Issues
        </dt-button>

        <dt-button
          v-else-if="validationState === 'improving'"
          importance="outlined"
          size="sm"
          disabled
        >
          <template #icon>
            <dt-icon name="loading" size="200" class="spin-icon" />
          </template>
          Improving...
        </dt-button>

        <dt-button
          v-else-if="validationState === 'validated'"
          importance="outlined"
          kind="success"
          size="sm"
        >
          <template #icon>
            <dt-icon name="check-circle" size="200" />
          </template>
          Validated
        </dt-button>

        <dt-button importance="primary" size="sm" @click="handlePublish">
          Publish
        </dt-button>
      </div>
    </div>

    <!-- ── Validation Banner ─────────────────────────────────────────────── -->
    <transition name="banner-fade">
      <div v-if="validationState === 'checking'" class="validation-banner validation-banner--checking">
        <dt-icon name="loading" size="200" class="spin-icon" />
        <span>Checking your skill for issues…</span>
      </div>
      <div v-else-if="validationState === 'improving'" class="validation-banner validation-banner--improving">
        <dt-icon name="loading" size="200" class="spin-icon" />
        <span>Applying improvements…</span>
      </div>
      <div v-else-if="validationState === 'validated'" class="validation-banner validation-banner--validated">
        <dt-icon name="check-circle" size="200" />
        <span>Skill validated — no issues found.</span>
      </div>
    </transition>

    <!-- ── Three-column body ────────────────────────────────────────────── -->
    <div class="skill-detail-body">

      <!-- Reserved left column (future panel functionality) -->
      <div class="skill-detail-left" />

      <!-- Center: editor fields (~1/3 width, centered) -->
      <div class="skill-detail-main">
        <div class="skill-form-content">

        <!-- Description -->
        <div class="form-section">
          <div class="form-label">
            <div class="label-text">Description</div>
            <div class="label-description">Briefly describe what this skill does.</div>
          </div>
          <div class="editor-container">
            <div class="editor-toolbar">
              <div class="toolbar-group">
                <button v-for="f in textFormats" :key="f.name" class="toolbar-button" :title="f.name" @click="applyFormat(f.name, 'description')">
                  <dt-icon :name="f.icon" size="200" />
                </button>
              </div>
              <div class="toolbar-divider" />
              <div class="toolbar-group">
                <button v-for="l in listFormats" :key="l.name" class="toolbar-button" :title="l.name" @click="applyFormat(l.name, 'description')">
                  <dt-icon :name="l.icon" size="200" />
                </button>
              </div>
              <div class="toolbar-divider" />
              <div class="toolbar-group">
                <button class="toolbar-button" title="Insert Link" @click="insertLink('description')"><dt-icon name="link-2" size="200" /></button>
                <button class="toolbar-button" title="Insert Code" @click="insertCode('description')"><dt-icon name="code" size="200" /></button>
              </div>
            </div>
            <div
              ref="descriptionEditor"
              class="editor-content"
              contenteditable="true"
              @input="currentEditor = 'description'"
              @keydown="handleKeydown"
              v-html="descriptionContent"
            />
          </div>
        </div>

        <!-- Instructions -->
        <div class="form-section">
          <div class="form-label">
            <div class="label-text">Instructions</div>
            <div class="label-description">Outline each step and action the agent should take to complete this task.</div>
          </div>
          <div class="editor-container" :class="{ 'editor-container--error': showInlineErrors && !hasInstructions }">
            <div class="editor-toolbar">
              <div class="toolbar-group">
                <button v-for="f in textFormats" :key="f.name" class="toolbar-button" :title="f.name" @click="applyFormat(f.name, 'instructions')">
                  <dt-icon :name="f.icon" size="200" />
                </button>
              </div>
              <div class="toolbar-divider" />
              <div class="toolbar-group">
                <button v-for="l in listFormats" :key="l.name" class="toolbar-button" :title="l.name" @click="applyFormat(l.name, 'instructions')">
                  <dt-icon :name="l.icon" size="200" />
                </button>
              </div>
              <div class="toolbar-divider" />
              <div class="toolbar-group">
                <button class="toolbar-button" title="Insert Link" @click="insertLink('instructions')"><dt-icon name="link-2" size="200" /></button>
                <button class="toolbar-button" title="Insert Code" @click="insertCode('instructions')"><dt-icon name="code" size="200" /></button>
              </div>
            </div>
            <div
              ref="instructionsEditor"
              class="editor-content"
              contenteditable="true"
              @input="currentEditor = 'instructions'"
              @keydown="handleKeydown"
              v-html="instructionsContent"
            />
          </div>
          <div v-if="showInlineErrors && !hasInstructions" class="inline-error">
            <dt-icon name="alert-circle" size="200" />
            You need to add connections to all actions before you can validate or publish
          </div>
        </div>

        <!-- Guardrails -->
        <div class="form-section">
          <div class="form-label">
            <div class="label-text">Guardrails</div>
            <div class="label-description">Add guidelines to ensure compliance and safety.</div>
          </div>
          <div class="editor-container" :class="{ 'editor-container--error': showInlineErrors && !hasGuardrails }">
            <div class="editor-toolbar">
              <div class="toolbar-group">
                <button v-for="f in textFormats" :key="f.name" class="toolbar-button" :title="f.name" @click="applyFormat(f.name, 'guardrails')">
                  <dt-icon :name="f.icon" size="200" />
                </button>
              </div>
              <div class="toolbar-divider" />
              <div class="toolbar-group">
                <button v-for="l in listFormats" :key="l.name" class="toolbar-button" :title="l.name" @click="applyFormat(l.name, 'guardrails')">
                  <dt-icon :name="l.icon" size="200" />
                </button>
              </div>
              <div class="toolbar-divider" />
              <div class="toolbar-group">
                <button class="toolbar-button" title="Insert Link" @click="insertLink('guardrails')"><dt-icon name="link-2" size="200" /></button>
                <button class="toolbar-button" title="Insert Code" @click="insertCode('guardrails')"><dt-icon name="code" size="200" /></button>
              </div>
            </div>
            <div
              ref="guardrailsEditor"
              class="editor-content"
              contenteditable="true"
              @input="currentEditor = 'guardrails'"
              @keydown="handleKeydown"
              v-html="guardrailsContent"
            />
          </div>
          <div v-if="showInlineErrors && !hasGuardrails" class="inline-error">
            <dt-icon name="alert-circle" size="200" />
            You need to add guardrails before you can validate or publish
          </div>
        </div>

        <!-- Labels -->
        <div class="form-section">
          <div class="form-label">
            <div class="label-text">Labels <span class="label-optional">(Optional)</span></div>
          </div>
          <dt-input v-model="labels" placeholder="Select a label or start typing" size="md" />
        </div>
        </div><!-- /.skill-form-content -->
      </div>

      <!-- Right: sidebar -->
      <div class="skill-detail-sidebar">
        <!-- "Improve skill" panel — shown after validation finds issues or during improving -->
        <div
          v-if="validationState === 'issues' || validationState === 'improving'"
          class="sidebar-panel sidebar-panel--improve"
        >
          <div class="sidebar-panel__header">
            <span class="sidebar-panel__title">Improve skill</span>
            <button class="sidebar-panel__close" @click="validationState = null">×</button>
          </div>
          <p class="sidebar-panel__summary">
            We've flagged <strong>{{ remainingIssues.length }} critical issues</strong> in your skill. Select the improvements you'd like to apply.
          </p>

          <!-- Instruction improvements -->
          <div v-if="instructionIssues.length" class="improve-section">
            <div class="improve-section__label">Instruction improvements</div>
            <div
              v-for="issue in instructionIssues"
              :key="issue.id"
              class="improve-item"
            >
              <label class="improve-item__check-wrap">
                <input
                  type="checkbox"
                  class="improve-item__checkbox"
                  :checked="selectedIssueIds.has(issue.id)"
                  @change="toggleIssue(issue.id)"
                />
                <span class="improve-item__title">{{ issue.title }}</span>
              </label>
              <dt-popover placement="left-start" :offset="[0, 8]" :show-close-button="true">
                <template #anchor="{ attrs }">
                  <button v-bind="attrs" class="improve-item__details-btn">
                    View details
                  </button>
                </template>
                <template #headerContent>
                  <span>{{ issue.title }}</span>
                </template>
                <template #content>
                  <div class="issue-detail-content">
                    <ul>
                      <li v-for="(s, i) in issue.suggestions" :key="i">{{ s }}</li>
                    </ul>
                    <p class="issue-detail-content__reasoning-label">Reasoning</p>
                    <p class="issue-detail-content__reasoning">{{ issue.reasoning }}</p>
                  </div>
                </template>
              </dt-popover>
            </div>
          </div>

          <!-- Guardrail improvements -->
          <div v-if="guardrailIssues.length" class="improve-section">
            <div class="improve-section__label">Guardrail improvements</div>
            <div
              v-for="issue in guardrailIssues"
              :key="issue.id"
              class="improve-item"
            >
              <label class="improve-item__check-wrap">
                <input
                  type="checkbox"
                  class="improve-item__checkbox"
                  :checked="selectedIssueIds.has(issue.id)"
                  @change="toggleIssue(issue.id)"
                />
                <span class="improve-item__title">{{ issue.title }}</span>
              </label>
              <dt-popover placement="left-start" :offset="[0, 8]" :show-close-button="true">
                <template #anchor="{ attrs }">
                  <button v-bind="attrs" class="improve-item__details-btn">
                    View details
                  </button>
                </template>
                <template #headerContent>
                  <span>{{ issue.title }}</span>
                </template>
                <template #content>
                  <div class="issue-detail-content">
                    <ul>
                      <li v-for="(s, i) in issue.suggestions" :key="i">{{ s }}</li>
                    </ul>
                    <p class="issue-detail-content__reasoning-label">Reasoning</p>
                    <p class="issue-detail-content__reasoning">{{ issue.reasoning }}</p>
                  </div>
                </template>
              </dt-popover>
            </div>
          </div>

          <!-- Selection error -->
          <div v-if="showImproveSelectionError" class="inline-error" style="margin-top: 8px;">
            <dt-icon name="alert-circle" size="200" />
            You must select at least one improvement
          </div>

          <!-- Improve button -->
          <dt-button
            importance="primary"
            size="sm"
            style="margin-top: 12px; width: 100%;"
            :disabled="validationState === 'improving'"
            @click="handleImprove"
          >
            <template #icon>
              <dt-icon name="sparkle-filled" size="200" />
            </template>
            Improve
          </dt-button>
        </div>

        <!-- Actions panel — collapsed when improve panel is visible -->
        <div
          class="sidebar-panel sidebar-panel--actions"
          :class="{ 'sidebar-panel--collapsed': actionsCollapsed }"
        >
          <div
            class="sidebar-panel__header sidebar-panel__header--clickable"
            @click="actionsCollapsed && (actionsCollapsed = false)"
          >
            <dt-icon :name="actionsCollapsed ? 'chevron-right' : 'chevron-down'" size="100" />
            <span class="sidebar-panel__title">Actions</span>
          </div>

          <template v-if="!actionsCollapsed">
            <!-- Grouped by connector -->
            <template v-if="sidebarActions.length">
              <div v-for="group in sidebarActions" :key="group.connector" class="action-group">
                <div class="action-group__header" @click="toggleConnector(group.connector)">
                  <slash-source-icon :source="group.source" />
                  <span class="action-group__name">{{ group.connector }}</span>
                  <dt-icon
                    :name="collapsedConnectors.has(group.connector) ? 'chevron-right' : 'chevron-down'"
                    size="100"
                    class="action-group__chevron"
                  />
                </div>
                <template v-if="!collapsedConnectors.has(group.connector)">
                  <div class="action-group__connection">
                    <select class="connection-select">
                      <option value="">Select a connection</option>
                      <option value="default">Default connection</option>
                    </select>
                  </div>
                  <div v-for="action in group.actions" :key="action.id" class="action-item">
                    <span class="connection-badge connection-badge--action">{{ action.label }}</span>
                  </div>
                </template>
              </div>
            </template>

            <!-- Empty state -->
            <div v-else class="sidebar-empty">
              <dt-icon name="zap" size="300" class="sidebar-empty__icon" />
              <p class="sidebar-empty__text">
                Type <code>/</code> followed by an action name in the Instructions field to add actions here.
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Slash Command Menu ───────────────────────────────────────────────── -->
  <div
    v-if="showSlashMenu"
    class="slash-command-menu"
    :style="slashMenuPositionStyle"
    @mousedown.prevent
  >
    <div class="slash-section-label">Actions</div>
    <div class="slash-actions-scroll">
      <div
        v-for="(action, i) in filteredActions"
        :key="action.id"
        class="slash-action-item"
        :class="{ selected: i === selectedMenuIndex && !activeSubmenu }"
        @click="handleActionClick(action)"
        @mouseenter="selectedMenuIndex = i; activeSubmenu = null"
      >
        <slash-source-icon :source="action.source" />
        <span>{{ action.label }}</span>
      </div>
      <div v-if="!filteredActions.length" class="slash-no-results">No actions found</div>
    </div>
    <div class="slash-divider" />
    <div
      v-for="cmd in menuCommands"
      :key="cmd.id"
      class="slash-menu-row"
      :class="{ selected: activeSubmenu === cmd.id }"
      @mouseenter="openSubmenu(cmd, $event)"
      @click="openSubmenu(cmd, $event)"
    >
      <dt-icon :name="cmd.icon" size="200" class="slash-row-icon" />
      <span class="slash-row-label">{{ cmd.label }}</span>
      <dt-icon name="chevron-right" size="100" class="slash-chevron" />
    </div>
  </div>

  <!-- Transfer submenu -->
  <div
    v-if="activeSubmenu === 'transfer'"
    class="slash-submenu slash-transfer-submenu"
    :style="submenuPositionStyle"
    @mousedown.prevent
  >
    <div class="slash-section-label">Digital</div>
    <div v-for="item in transferSubmenu.digital" :key="item.id" class="slash-submenu-item" @click.stop="handleTransferItemClick(item, 'Digital', $event)">{{ item.label }}</div>
    <div class="slash-divider" />
    <div class="slash-section-label slash-section-label--spaced">Voice</div>
    <div v-for="item in transferSubmenu.voice" :key="item.id" class="slash-submenu-item" @click.stop="handleTransferItemClick(item, 'Voice', $event)">{{ item.label }}</div>
  </div>

  <!-- Workflow submenu -->
  <div
    v-if="activeSubmenu === 'workflow'"
    class="slash-submenu slash-workflow-submenu"
    :style="submenuPositionStyle"
    @mousedown.prevent
  >
    <div class="slash-workflow-search">
      <dt-input v-model="workflowSearch" placeholder="Search workflows" size="sm" />
    </div>
    <template v-if="!workflowSearch">
      <div class="slash-section-label slash-section-label--spaced">Digital</div>
      <div v-for="item in workflowSubmenu.digital" :key="item.id" class="slash-submenu-item" @click.stop="handleWorkflowItemClick(item, $event)" @mouseenter="activeTargetItem = null">{{ item.label }}</div>
      <div class="slash-divider" />
      <div class="slash-section-label slash-section-label--spaced">Voice</div>
      <div
        v-for="item in workflowSubmenu.voice"
        :key="item.id"
        class="slash-submenu-item"
        :class="{ selected: activeTargetItem?.id === item.id }"
        @click.stop="handleWorkflowItemClick(item, $event)"
        @mouseenter="item.targets ? openTargetSubmenu(item, $event) : (activeTargetItem = null)"
      >
        <span class="slash-submenu-label">{{ item.label }}</span>
        <template v-if="item.targets">
          <span class="slash-target-count">{{ item.targets.length }}</span>
          <dt-icon name="chevron-right" size="100" class="slash-chevron" />
        </template>
      </div>
    </template>
    <template v-else>
      <div v-for="item in filteredWorkflowItems" :key="item.id" class="slash-submenu-item" @click.stop="handleWorkflowItemClick(item, $event)">
        <span class="slash-submenu-label">{{ item.label }}</span>
        <template v-if="item.targets">
          <span class="slash-target-count">{{ item.targets.length }}</span>
          <dt-icon name="chevron-right" size="100" class="slash-chevron" />
        </template>
      </div>
      <div v-if="!filteredWorkflowItems.length" class="slash-no-results">No workflows found</div>
    </template>
  </div>

  <!-- Targets submenu -->
  <div
    v-if="activeTargetItem"
    class="slash-submenu slash-targets-submenu"
    :style="targetSubmenuPositionStyle"
    @mousedown.prevent
  >
    <div class="slash-section-label">Targets</div>
    <div v-for="(target, i) in activeTargetItem.targets" :key="i" class="slash-submenu-item" @click.stop="handleTargetClick(target)">{{ target }}</div>
  </div>

  <!-- Overlay to close menus -->
  <div v-if="showSlashMenu" class="slash-menu-overlay" @click="closeAll" />

  <!-- Transfer Action Panel -->
  <div v-if="showActionPanel && actionPanelItem"
       class="transfer-panel-scrim"
       @click="closeActionPanel">
    <div class="transfer-panel" @click.stop>
      <div class="transfer-panel-header">
        <div class="transfer-panel-meta">
          <span class="transfer-panel-eyebrow">{{ actionPanelItem.section }}</span>
          <span class="transfer-panel-title">{{ actionPanelItem.label }}</span>
        </div>
        <dt-button size="sm" importance="clear" kind="muted"
                   @click="closeActionPanel" @mousedown.stop>
          <template #icon><dt-icon name="close" size="200" /></template>
        </dt-button>
      </div>
      <div class="transfer-combobox">
        <div class="transfer-combobox-field">
          <dt-input
            v-model="transferSearch"
            placeholder="Type or select..."
            size="xs"
            :show-messages="false"
            @focus="showTransferDropdown = true"
            @blur="showTransferDropdown = false"
          />
          <dt-icon name="chevrons-up-down" size="200" class="transfer-combobox-chevron" />
        </div>
        <div v-if="showTransferDropdown" class="transfer-dropdown" @mousedown.prevent>
          <div v-for="opt in filteredTransferOptions" :key="opt.value"
               class="transfer-dropdown-row"
               :class="{ 'transfer-dropdown-row--selected': actionPanelValue === opt.label }"
               @mousedown.prevent="selectTransferOption(opt)">
            <span class="transfer-dropdown-label">{{ opt.label }}</span>
            <span v-if="opt.role" class="transfer-dropdown-role">{{ opt.role }}</span>
          </div>
          <div v-if="!filteredTransferOptions.length" class="transfer-dropdown-empty">
            No results
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Publish without validating modal ──────────────────────────────────── -->
  <div v-if="showPublishModal" class="modal-scrim" @click.self="showPublishModal = false">
    <div class="modal-dialog">
      <div class="modal-header">
        <dt-icon name="alert-triangle" size="300" class="d-fc-warning" />
        <h3 class="modal-title">Publish without validating?</h3>
      </div>
      <p class="modal-body">
        Your skill hasn't been validated yet. Unvalidated skills may contain issues that affect
        agent performance. We recommend validating before publishing.
      </p>
      <div class="modal-actions">
        <dt-button importance="clear" kind="muted" @click="showPublishModal = false">
          Cancel
        </dt-button>
        <dt-button importance="outlined" @click="goValidateFirst">
          Validate first
        </dt-button>
        <dt-button importance="primary" @click="publishAnyway">
          Publish anyway
        </dt-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { DtButton, DtIcon, DtBadge, DtInput, DtPopover } from '../components/ui'
import { state } from '../state.js'
import { archivedSkills } from '../config/skillsData.js'

// ── Inline source icon (same as SkillPanel) ──────────────────────────────────
const SlashSourceIcon = {
  props: { source: String },
  components: { DtIcon },
  template: `
    <span class="slash-source-icon">
      <span v-if="source === 'google-calendar'">
        <svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="12" height="12" rx="1" fill="white"/>
          <rect x="7.42" y="7.43" width="2.58" height="2.57" fill="#EA4335"/>
          <rect y="7.43" width="2.61" height="2.57" fill="#188038"/>
          <rect x="7.42" width="2.58" height="2.59" fill="#1967D2"/>
          <rect x="7.63" y="2.37" width="2.37" height="5.26" fill="#FBBC04"/>
          <rect x="2.37" y="7.63" width="5.26" height="2.37" fill="#34A853"/>
          <rect width="7.63" height="7.63" fill="#4285F4"/>
        </svg>
      </span>
      <span v-else-if="source === 'dialpad'">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7.5" fill="#7C3FFF" stroke="none"/>
          <path d="M8 4.5L9.5 7.2H12L10 8.8L10.8 11.5L8 9.8L5.2 11.5L6 8.8L4 7.2H6.5L8 4.5Z" fill="white"/>
        </svg>
      </span>
      <dt-icon v-else name="zap" size="200" />
    </span>
  `,
}

// ── Mock validation issues ───────────────────────────────────────────────────
const VALIDATION_ISSUES = [
  {
    id: 'contradiction-requery',
    category: 'instruction',
    title: 'Fix logical contradiction (re-querying)',
    suggestions: [
      'After checking for availability, present up to 3–5 of the most suitable time slots',
      'If the user selects a time, proceed to book the appointment',
      'If the user requests different times, return to checking for available time slots a maximum of two consecutive sets',
    ],
    reasoning: "The 'Scheduling an Appointment' workflow instructs the agent to 'return to checking for available time slots' if the user requests different times. However, the 'Guardrails' strictly forbid re-querying after two rejections and instead require offering a search on a different day or changing the appointment duration.",
  },
  {
    id: 'fallback-calendar',
    category: 'instruction',
    title: 'Add missing error fallback (calendar tools)',
    suggestions: [
      'Handle cases where List Events returns no results',
      'Provide fallback message if Create Event fails',
    ],
    reasoning: 'No error handling defined for Google Calendar API failures.',
  },
  {
    id: 'fallback-comms',
    category: 'instruction',
    title: 'Add missing error fallback (communication tools)',
    suggestions: [
      'Handle SMS send failure gracefully',
      'Offer alternative confirmation method if SMS unavailable',
    ],
    reasoning: 'Send SMS action has no fallback if Dialpad service is unavailable.',
  },
  {
    id: 'contradiction-availability',
    category: 'instruction',
    title: 'Fix logical contradiction (availability check)',
    suggestions: ['Clarify re-query limits before offering alternative date/time'],
    reasoning: 'Conflict between instructions step and guardrail on re-query limits.',
  },
  {
    id: 'price-disclaimer',
    category: 'guardrail',
    title: 'Mandate price disclaimer',
    suggestions: ['Always inform customers of any booking fees before confirming'],
    reasoning: 'No pricing transparency requirement exists in the current guardrails.',
  },
]

// ── Skill data ───────────────────────────────────────────────────────────────
const liveSkill = computed(() =>
  state.skillNodes.find(s => s.id === state.selectedSkillId) ??
  archivedSkills.find(s => s.id === state.selectedSkillId) ??
  null
)

const skillName = ref(liveSkill.value?.name || '')
const labels = ref('')

const descriptionContent = ref(
  liveSkill.value?.description
    ? `<p>${liveSkill.value.description}</p>`
    : `<p>Helps customers with all booking-related requests.</p>`
)

const instructionsContent = ref(
  liveSkill.value?.instructions ||
  `<p><strong>Retrieve Calendars</strong> — Use <span class="connection-badge">List Events</span> to get all calendar IDs and the primary time zone.</p>
<p><strong>Collect Details</strong> — Gather necessary information (purpose, preferred date/time, contact info).</p>
<p><strong>Check Availability</strong> — Use <span class="connection-badge">List Event</span> to find open slots within business hours.</p>
<p><strong>Execute Action</strong> — Schedule: use <span class="connection-badge">Create Events</span>, Modify: use <span class="connection-badge">Update Events</span>, Cancel: use <span class="connection-badge">Delete Events</span>.</p>
<p><strong>Send Confirmation</strong> — Deliver confirmation via <span class="connection-badge">Send SMS</span> or <span class="connection-badge">Send Email</span>.</p>`
)

const guardrailsContent = ref(
  liveSkill.value?.guardrails ||
  `<p>Never share personal information with unauthorized parties.</p>
<p>Always verify customer identity before modifying bookings.</p>
<p>Comply with cancellation policy at all times.</p>`
)

// ── Validation state machine ─────────────────────────────────────────────────
// null → 'checking' → 'issues' → 'improving' → 'validated'
const validationState = ref(null)
const resolvedIssueIds = ref(new Set())
const selectedIssueIds = ref(new Set())
const showPublishModal = ref(false)
const actionsCollapsed = ref(false)

watch(validationState, (newVal) => {
  if (newVal === 'issues' || newVal === 'improving') {
    actionsCollapsed.value = true
  } else {
    actionsCollapsed.value = false
  }
})
const showInlineErrors = ref(false)
const showImproveSelectionError = ref(false)

const remainingIssues = computed(() =>
  VALIDATION_ISSUES.filter(i => !resolvedIssueIds.value.has(i.id))
)
const instructionIssues = computed(() =>
  remainingIssues.value.filter(i => i.category === 'instruction')
)
const guardrailIssues = computed(() =>
  remainingIssues.value.filter(i => i.category === 'guardrail')
)

// ── Editor state ─────────────────────────────────────────────────────────────
const descriptionEditor = ref(null)
const instructionsEditor = ref(null)
const guardrailsEditor = ref(null)
const currentEditor = ref('instructions')

const hasInstructions = computed(() => {
  const el = instructionsEditor.value
  return el ? el.innerText.trim().length > 0 : instructionsContent.value.trim().length > 0
})

const hasGuardrails = computed(() => {
  const el = guardrailsEditor.value
  return el ? el.innerText.trim().length > 0 : guardrailsContent.value.trim().length > 0
})

// ── Sidebar actions (parsed from editor content) ─────────────────────────────
// For the prototype we show the hardcoded action list grouped by connector
const sidebarActions = computed(() => [
  {
    connector: 'Google Calendar',
    source: 'google-calendar',
    actions: [
      { id: 'gcal-list',   label: 'List Events'   },
      { id: 'gcal-create', label: 'Create Events'  },
      { id: 'gcal-update', label: 'Update Events'  },
      { id: 'gcal-delete', label: 'Delete Events'  },
    ],
  },
  {
    connector: 'Dialpad',
    source: 'dialpad',
    actions: [
      { id: 'dp-sms',   label: 'Send SMS'   },
      { id: 'dp-email', label: 'Send Email' },
    ],
  },
])

const collapsedConnectors = ref(new Set())

function toggleConnector(name) {
  const next = new Set(collapsedConnectors.value)
  if (next.has(name)) {
    next.delete(name)
  } else {
    next.add(name)
  }
  collapsedConnectors.value = next
}

// ── Header actions ───────────────────────────────────────────────────────────
function handleSave() {
  const skillIndex = state.skillNodes.findIndex(s => s.id === state.selectedSkillId)
  if (skillIndex !== -1) {
    state.skillNodes[skillIndex].name = skillName.value
    state.hasUnsavedChanges = false
  }
}

function handleValidate() {
  if (!hasInstructions.value || !hasGuardrails.value) {
    showInlineErrors.value = true
    return
  }
  showInlineErrors.value = false
  validationState.value = 'checking'

  setTimeout(() => {
    validationState.value = 'issues'
    // Reset selections for a fresh run
    selectedIssueIds.value = new Set()
    showImproveSelectionError.value = false
  }, 2000)
}

function handlePublish() {
  if (validationState.value !== 'validated') {
    showPublishModal.value = true
  } else {
    publishDirect()
  }
}

function goValidateFirst() {
  showPublishModal.value = false
  handleValidate()
}

function publishAnyway() {
  showPublishModal.value = false
  publishDirect()
}

function publishDirect() {
  state.showPublishedToast = true
  state.backFromSkillDetail()
}

// ── Improve flow ─────────────────────────────────────────────────────────────
function toggleIssue(id) {
  const next = new Set(selectedIssueIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  selectedIssueIds.value = next
  showImproveSelectionError.value = false
}

function handleImprove() {
  if (selectedIssueIds.value.size === 0) {
    showImproveSelectionError.value = true
    return
  }
  showImproveSelectionError.value = false
  validationState.value = 'improving'

  setTimeout(() => {
    // Mark selected issues as resolved
    const next = new Set(resolvedIssueIds.value)
    selectedIssueIds.value.forEach(id => next.add(id))
    resolvedIssueIds.value = next
    selectedIssueIds.value = new Set()

    if (remainingIssues.value.length === 0) {
      validationState.value = 'validated'
    } else {
      validationState.value = 'issues'
    }
  }, 2000)
}

// ── Slash command state ───────────────────────────────────────────────────────
const showSlashMenu = ref(false)
const slashMenuPosition = ref({ top: 0, left: 0 })
const submenuPosition = ref({ top: 0, left: 0 })
const activeSubmenu = ref(null)
const selectedMenuIndex = ref(0)
const searchQuery = ref('')
const workflowSearch = ref('')
const activeTargetItem = ref(null)
const targetSubmenuPosition = ref({ top: 0, left: 0 })
const savedRange = ref(null)
const showActionPanel      = ref(false)
const actionPanelItem      = ref(null)
const actionPanelValue     = ref('')
const transferSearch       = ref('')
const showTransferDropdown = ref(false)

const slashMenuPositionStyle = computed(() => ({
  top: slashMenuPosition.value.top + 'px',
  left: slashMenuPosition.value.left + 'px',
}))
const submenuPositionStyle = computed(() => ({
  top: submenuPosition.value.top + 'px',
  left: submenuPosition.value.left + 'px',
}))
const targetSubmenuPositionStyle = computed(() => ({
  top: targetSubmenuPosition.value.top + 'px',
  left: targetSubmenuPosition.value.left + 'px',
}))

// ── Slash command data (same as SkillPanel) ──────────────────────────────────
const actionItems = [
  { id: 'gcal-create',   label: 'Create event',          source: 'google-calendar' },
  { id: 'gcal-cancel',   label: 'Cancel event',          source: 'google-calendar' },
  { id: 'gcal-delete',   label: 'Delete event',          source: 'google-calendar' },
  { id: 'gcal-list',     label: 'List events',           source: 'google-calendar' },
  { id: 'o365-cancel',   label: 'Cancel events',         source: 'o365-calendar'   },
  { id: 'o365-create',   label: 'Create events',         source: 'o365-calendar'   },
  { id: 'o365-list',     label: 'List events',           source: 'o365-calendar'   },
  { id: 'dp-sms',        label: 'Send SMS',              source: 'dialpad'         },
  { id: 'dp-email',      label: 'Send email',            source: 'dialpad'         },
  { id: 'dp-calendar',   label: 'Create calendar event', source: 'dialpad'         },
  { id: 'dp-video',      label: 'Join video call',       source: 'dialpad'         },
]

const transferSubmenu = {
  digital: [
    { id: 'agents',         label: 'Agents',         needsPanel: false },
    { id: 'contact-center', label: 'Contact Center', needsPanel: true  },
    { id: 'team-member-d',  label: 'Team Member',    needsPanel: true  },
  ],
  voice: [
    { id: 'voicemail',     label: 'Voicemail',   needsPanel: false },
    { id: 'operators',     label: 'Operators',   needsPanel: false },
    { id: 'groups',        label: 'Groups',      needsPanel: false },
    { id: 'team-member-v', label: 'Team Member', needsPanel: false },
    { id: 'room-phone',    label: 'Room Phone',  needsPanel: false },
  ],
}

const transferOptionsMap = {
  'contact-center': [
    { value: 'general',   label: 'General Support'     },
    { value: 'technical', label: 'Technical Support'   },
    { value: 'billing',   label: 'Billing & Payments'  },
    { value: 'sales',     label: 'Sales'               },
    { value: 'success',   label: 'Customer Success'    },
    { value: 'returns',   label: 'Returns & Exchanges' },
  ],
  'team-member-d': [
    { value: 'alex-lee',     label: 'Alex Lee',     role: 'User'  },
    { value: 'alex-rogers',  label: 'Alex Rogers',  role: 'User'  },
    { value: 'jordan-smith', label: 'Jordan Smith', role: 'Admin' },
    { value: 'taylor-brown', label: 'Taylor Brown', role: 'User'  },
    { value: 'morgan-white', label: 'Morgan White', role: 'Admin' },
    { value: 'jamie-taylor', label: 'Jamie Taylor', role: 'User'  },
  ],
}

const workflowSubmenu = {
  digital: [
    { id: 'wf-account-cancel',  label: 'Account cancellations' },
    { id: 'wf-change-prefs',    label: 'Change preferences'    },
    { id: 'wf-update-settings', label: 'Update settings'       },
    { id: 'wf-renewals',        label: 'Manage renewals'       },
  ],
  voice: [
    { id: 'wf-cancel-orders',  label: 'Cancel orders'        },
    { id: 'wf-cancel-policy',  label: 'Cancel Policy',       targets: ['Standard Policy', 'Premium Policy'] },
    { id: 'wf-event-cancel',   label: 'Event cancellations', targets: ['Event A', 'Event B', 'Event C'] },
    { id: 'wf-cancel-appt',    label: 'Cancel appointment'   },
    { id: 'wf-refund',         label: 'Request refund'       },
    { id: 'wf-feedback',       label: 'Feedback submission',  targets: ['Product Feedback', 'Support Feedback'] },
  ],
}

const menuCommands = [
  { id: 'transfer', label: 'Transfer', icon: 'arrow-left-right' },
  { id: 'workflow', label: 'Workflow', icon: 'workflow'         },
]

const filteredActions = computed(() => {
  if (!searchQuery.value) return actionItems
  const q = searchQuery.value.toLowerCase()
  return actionItems.filter(a => a.label.toLowerCase().includes(q))
})

const filteredTransferOptions = computed(() => {
  if (!actionPanelItem.value) return []
  const opts = transferOptionsMap[actionPanelItem.value.id] ?? []
  const q = transferSearch.value.toLowerCase()
  return q ? opts.filter(o => o.label.toLowerCase().includes(q)) : opts
})

const filteredWorkflowItems = computed(() => {
  if (!workflowSearch.value) return []
  const q = workflowSearch.value.toLowerCase()
  return [
    ...workflowSubmenu.digital.filter(i => i.label.toLowerCase().includes(q)),
    ...workflowSubmenu.voice.filter(i => i.label.toLowerCase().includes(q)),
  ]
})

// ── Toolbar formats ──────────────────────────────────────────────────────────
const textFormats = [
  { name: 'Bold',      icon: 'bold'      },
  { name: 'Italic',    icon: 'italic'    },
  { name: 'Underline', icon: 'underline' },
]
const listFormats = [
  { name: 'Bulleted List',  icon: 'list-bullet'   },
  { name: 'Numbered List',  icon: 'list-ordered'  },
]

const applyFormat = () => {}
const insertLink = () => {}
const insertCode = () => {}

// ── Keydown handler ──────────────────────────────────────────────────────────
function handleKeydown(event) {
  if (event.key === '/' && !showSlashMenu.value) {
    selectedMenuIndex.value = 0
    searchQuery.value = ''
    activeSubmenu.value = null
    activeTargetItem.value = null

    const sel = window.getSelection()
    let cursorBottom = 0, cursorTop = 0, cursorLeft = 0

    if (sel && sel.rangeCount > 0) {
      const rects = sel.getRangeAt(0).getClientRects()
      if (rects.length > 0) {
        cursorBottom = rects[0].bottom
        cursorTop    = rects[0].top
        cursorLeft   = rects[0].left
      } else {
        const r = event.currentTarget.getBoundingClientRect()
        cursorBottom = r.top + 24
        cursorTop    = r.top
        cursorLeft   = r.left + 16
      }
    }

    setTimeout(() => {
      const menuWidth = 240, menuHeight = 305, padding = 8
      let top = cursorBottom + 6
      let left = cursorLeft
      if (left + menuWidth + padding > window.innerWidth) left = Math.max(padding, window.innerWidth - menuWidth - padding)
      if (top + menuHeight + padding > window.innerHeight) { top = cursorTop - menuHeight - 4; if (top < padding) top = padding }
      left = Math.max(padding, left)
      slashMenuPosition.value = { top, left }
      showSlashMenu.value = true
    }, 10)
    return
  }

  if (showSlashMenu.value) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      selectedMenuIndex.value = Math.min(selectedMenuIndex.value + 1, filteredActions.value.length - 1)
      activeSubmenu.value = null
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      selectedMenuIndex.value = Math.max(selectedMenuIndex.value - 1, 0)
      activeSubmenu.value = null
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const action = filteredActions.value[selectedMenuIndex.value]
      if (action) handleActionClick(action)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      if (activeSubmenu.value) { activeSubmenu.value = null; activeTargetItem.value = null }
      else closeAll()
    } else if (event.key === 'Backspace') {
      if (searchQuery.value === '') closeAll()
      else { event.preventDefault(); searchQuery.value = searchQuery.value.slice(0, -1); selectedMenuIndex.value = 0 }
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      event.preventDefault()
      searchQuery.value += event.key
      selectedMenuIndex.value = 0
      activeSubmenu.value = null
    }
  }
}

// ── Slash menu handlers ───────────────────────────────────────────────────────
function handleActionClick(action) {
  insertCommand(action.label, 'action')
  closeAll()
}

function openSubmenu(cmd, event) {
  activeSubmenu.value = cmd.id
  activeTargetItem.value = null
  workflowSearch.value = ''

  const rect = event.currentTarget.getBoundingClientRect()
  const padding = 8
  const submenuWidth  = cmd.id === 'workflow' ? 240 : 180
  const submenuHeight = cmd.id === 'workflow' ? 440 : 270

  let left = rect.right + 4
  if (left + submenuWidth + padding > window.innerWidth) left = slashMenuPosition.value.left - submenuWidth
  left = Math.max(padding, left)

  let top = rect.top - 4
  if (top + submenuHeight + padding > window.innerHeight) top = Math.max(padding, window.innerHeight - submenuHeight - padding)
  top = Math.max(padding, top)

  submenuPosition.value = { top, left }
}

function handleTransferItemClick(item, section) {
  if (item.needsPanel) {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      savedRange.value = sel.getRangeAt(0).cloneRange()
    }
    actionPanelItem.value  = { ...item, section }
    actionPanelValue.value = ''
    transferSearch.value   = ''
    showActionPanel.value  = true
    activeSubmenu.value    = null
    showSlashMenu.value    = false
  } else {
    insertCommand(`Transfer to ${item.label}`, 'transfer')
    closeAll()
  }
}

function closeActionPanel() {
  showActionPanel.value      = false
  actionPanelItem.value      = null
  transferSearch.value       = ''
  showTransferDropdown.value = false
  savedRange.value           = null
}

function selectTransferOption(opt) {
  actionPanelValue.value = opt.label
  showTransferDropdown.value = false
  insertCommand(`Transfer to ${actionPanelItem.value.label}: ${opt.label}`, 'transfer')
  closeActionPanel()
}

function handleWorkflowItemClick(item, event) {
  if (item.targets) openTargetSubmenu(item, event)
  else { insertCommand(item.label, 'workflow'); closeAll() }
}

function openTargetSubmenu(item, event) {
  activeTargetItem.value = item
  const rect = event.currentTarget.getBoundingClientRect()
  const padding = 8
  const submenuWidth = 180
  const submenuHeight = (item.targets?.length ?? 0) * 34 + 40

  let left = rect.right + 4
  if (left + submenuWidth + padding > window.innerWidth) left = rect.left - submenuWidth - 4
  left = Math.max(padding, left)

  let top = rect.top - 4
  if (top + submenuHeight + padding > window.innerHeight) top = Math.max(padding, window.innerHeight - submenuHeight - padding)
  top = Math.max(padding, top)

  targetSubmenuPosition.value = { top, left }
}

function handleTargetClick(target) {
  insertCommand(`${activeTargetItem.value.label}: ${target}`, 'workflow')
  closeAll()
}

function closeAll() {
  showSlashMenu.value = false
  activeSubmenu.value = null
  activeTargetItem.value = null
  workflowSearch.value = ''
}

// ── Insert badge ──────────────────────────────────────────────────────────────
function insertCommand(text, badgeType = 'action') {
  let editorEl = null
  if (currentEditor.value === 'instructions') editorEl = instructionsEditor.value
  else if (currentEditor.value === 'description') editorEl = descriptionEditor.value
  else if (currentEditor.value === 'guardrails') editorEl = guardrailsEditor.value
  if (!editorEl) editorEl = instructionsEditor.value
  if (!editorEl) return

  const selection = window.getSelection()
  if (savedRange.value) { selection.removeAllRanges(); selection.addRange(savedRange.value) }
  savedRange.value = null
  if (selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  const textNode = range.startContainer
  if (textNode.nodeType === Node.TEXT_NODE) {
    const text = textNode.textContent
    const cursorPos = range.startOffset
    const lastSlashPos = text.lastIndexOf('/', cursorPos)
    if (lastSlashPos !== -1) {
      const newText = text.substring(0, lastSlashPos) + text.substring(cursorPos)
      textNode.textContent = newText
      range.setStart(textNode, lastSlashPos)
      range.collapse(true)
    }
  }

  const badge = document.createElement('span')
  badge.className = `connection-badge connection-badge--${badgeType}`
  badge.dataset.badgeType = badgeType
  badge.textContent = text
  badge.contentEditable = 'false'
  range.insertNode(badge)

  const space = document.createTextNode('\u00A0')
  range.setStartAfter(badge)
  range.insertNode(space)
  range.setStartAfter(space)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)

  editorEl.focus()
}
</script>

<style scoped>
/* ── Page shell ──────────────────────────────────────────────────────────── */
.skill-detail-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: var(--dt-color-surface-primary, #fff);
}

/* ── Header ──────────────────────────────────────────────────────────────── */
.skill-detail-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: var(--dt-color-surface-primary, #fff);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  gap: 16px;
}

.skill-detail-header__left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.skill-detail-header__name-wrapper {
  display: inline-grid;
  max-width: 500px;
}

.skill-detail-header__name-wrapper::after {
  content: attr(data-value) " ";
  white-space: pre;
  visibility: hidden;
  font-size: 22px;
  font-weight: 600;
  padding: 2px 6px;
  grid-area: 1 / 1;
}

.skill-detail-header__name-input {
  grid-area: 1 / 1;
  font-size: 22px;
  font-weight: 600;
  color: var(--dt-color-foreground-primary);
  border: none;
  background: transparent;
  outline: none;
  padding: 2px 6px;
  border-radius: 6px;
  min-width: 0;
  width: 100%;
  transition: background 0.15s ease;
}

.skill-detail-header__name-input:hover {
  background: rgba(0, 0, 0, 0.04);
}

.skill-detail-header__name-input:focus {
  background: rgba(0, 0, 0, 0.04);
  /* no box-shadow — preserves "plain text" appearance */
}

.skill-detail-header__status-badge {
  flex-shrink: 0;
}

.skill-detail-header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* ── Validation banner ───────────────────────────────────────────────────── */
.validation-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  font-size: 13px;
  font-weight: 500;
}

.validation-banner--checking {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-secondary);
}

.validation-banner--improving {
  background: #fefae8;
  color: #7a5c00;
}

.validation-banner--validated {
  background: #f0faf4;
  color: #1a6641;
}

.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: opacity 0.25s, max-height 0.25s;
  max-height: 60px;
  overflow: hidden;
}
.banner-fade-enter-from,
.banner-fade-leave-to {
  opacity: 0;
  max-height: 0;
}

/* ── Body ────────────────────────────────────────────────────────────────── */
.skill-detail-body {
  display: flex;
  flex: 1;
  gap: 0;
  min-height: 0;
}

.skill-detail-left {
  width: 260px;
  flex-shrink: 0;
}

.skill-detail-main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.skill-form-content {
  width: 100%;
}

.skill-detail-sidebar {
  width: 320px;
  flex-shrink: 0;
  padding: 16px;
  overflow-y: auto;
}

/* ── Form sections ───────────────────────────────────────────────────────── */
.form-section {
  margin-bottom: 28px;
}

.form-label {
  margin-bottom: 8px;
}

.label-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--dt-color-foreground-primary);
  line-height: 1.4;
}

.label-description {
  font-size: 12px;
  color: var(--dt-color-foreground-muted);
  margin-top: 2px;
}

.label-optional {
  font-weight: 400;
  color: var(--dt-color-foreground-muted);
}

/* ── Inline errors ───────────────────────────────────────────────────────── */
.inline-error {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 6px;
  font-size: 12px;
  color: var(--dt-color-foreground-critical, #c0392b);
}

/* ── Editor ──────────────────────────────────────────────────────────────── */
.editor-container {
  border: 1px solid var(--dt-color-border-default);
  border-radius: 8px;
  overflow: hidden;
  background: var(--dt-color-surface-primary, #fff);
}

.editor-container--error {
  border-color: var(--dt-color-border-critical, #e74c3c);
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 8px;
  border-bottom: 1px solid var(--dt-color-border-subtle);
  background: var(--dt-color-surface-secondary);
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toolbar-divider {
  width: 1px;
  height: 16px;
  background: var(--dt-color-border-subtle);
  margin: 0 4px;
}

.toolbar-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: var(--dt-color-foreground-secondary);
}

.toolbar-button:hover {
  background: var(--dt-color-surface-moderate);
  color: var(--dt-color-foreground-primary);
}

.editor-content {
  padding: 12px 14px;
  min-height: 120px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--dt-color-foreground-primary);
  outline: none;
}

/* ── Sidebar panels ──────────────────────────────────────────────────────── */
.sidebar-panel {
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: 10px;
  padding: 16px;
  background: var(--dt-color-surface-primary, #fff);
}

.sidebar-panel--improve {
  background: var(--dt-color-surface-critical);
  border-radius: 8px;
  margin-bottom: 8px;
}

.sidebar-panel--collapsed {
  background: transparent;
  border-color: transparent;
  padding-bottom: 0;
}

.sidebar-panel__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.sidebar-panel__header--clickable {
  cursor: pointer;
  user-select: none;
  gap: 6px;
}

.sidebar-panel__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--dt-color-foreground-primary);
}

.sidebar-panel__close {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: var(--dt-color-foreground-muted);
  padding: 0;
  line-height: 1;
}

.sidebar-panel__summary {
  font-size: 13px;
  color: var(--dt-color-foreground-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
}

/* ── Action groups (sidebar) ─────────────────────────────────────────────── */
.action-group {
  margin-bottom: 12px;
}

.action-group__header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--dt-color-foreground-secondary);
  cursor: pointer;
  padding: 4px 0;
}

.action-group__name {
  flex: 1;
}

.action-group__chevron {
  flex-shrink: 0;
}

.action-group__connection {
  margin: 6px 0;
}

.connection-select {
  width: 100%;
  font-size: 12px;
  padding: 5px 8px;
  border: 1px solid var(--dt-color-border-default);
  border-radius: 6px;
  background: var(--dt-color-surface-primary, #fff);
  color: var(--dt-color-foreground-secondary);
  appearance: none;
}

.action-item {
  margin: 4px 0;
  padding-left: 8px;
}

/* ── Sidebar empty state ─────────────────────────────────────────────────── */
.sidebar-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 24px 16px;
  text-align: center;
}

.sidebar-empty__icon {
  color: var(--dt-color-foreground-muted);
  opacity: 0.5;
}

.sidebar-empty__text {
  font-size: 13px;
  color: var(--dt-color-foreground-muted);
  line-height: 1.5;
  margin: 0;
}

/* ── Improve section ─────────────────────────────────────────────────────── */
.improve-section {
  margin-bottom: 16px;
}

.improve-section__label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--dt-color-foreground-muted);
  margin-bottom: 8px;
}

.improve-item {
  position: relative;
  margin-bottom: 8px;
}

.improve-item__check-wrap {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
}

.improve-item__checkbox {
  margin-top: 2px;
  flex-shrink: 0;
  accent-color: var(--dt-color-brand-purple, #7c3fff);
}

.improve-item__title {
  font-size: 13px;
  color: var(--dt-color-foreground-primary);
  line-height: 1.4;
}

.improve-item__details-btn {
  background: none;
  border: none;
  padding: 0;
  margin-top: 2px;
  margin-left: 24px;
  font-size: 12px;
  color: var(--dt-color-foreground-secondary);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.improve-item__details-btn:hover {
  color: var(--dt-color-foreground-primary);
}

/* ── Issue detail popover content ────────────────────────────────────────── */
.issue-detail-content {
  padding: 12px;
  font-size: 12px;
  max-width: 260px;
}

.issue-detail-content ul {
  padding-left: 16px;
  margin: 0 0 10px;
  line-height: 1.6;
}

.issue-detail-content__reasoning-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--dt-color-foreground-muted);
  margin-bottom: 4px;
}

.issue-detail-content__reasoning {
  margin: 0;
  color: var(--dt-color-foreground-muted);
  line-height: 1.5;
}

/* ── Publish modal ───────────────────────────────────────────────────────── */
.modal-scrim {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-dialog {
  background: var(--dt-color-surface-primary, #fff);
  border-radius: 16px;
  padding: 28px;
  max-width: 420px;
  width: calc(100% - 48px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: var(--dt-color-foreground-primary);
}

.modal-body {
  font-size: 14px;
  color: var(--dt-color-foreground-secondary);
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

/* ── Sparkle icon ────────────────────────────────────────────────────────── */
/* ── Spin animation ──────────────────────────────────────────────────────── */
.spin-icon {
  animation: sdp-spin 1s linear infinite;
}

@keyframes sdp-spin {
  to { transform: rotate(360deg); }
}

/* ── Connection badge (shared with SkillPanel) ───────────────────────────── */
/* :deep() required so rules match badges injected via v-html at runtime */
.editor-content :deep(.connection-badge) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background: rgba(28, 28, 28, 0.1);
  border-radius: 4px;
  color: #1c1c1c;
  font-size: 12px;
  font-family: "SF Mono", "Courier New", monospace;
  font-weight: 400;
  line-height: 14.4px;
  cursor: pointer;
  vertical-align: middle;
  white-space: nowrap;
}

.editor-content :deep(.connection-badge--action) {
  background: rgba(28, 28, 28, 0.1);
  color: #1c1c1c;
}

.editor-content :deep(.connection-badge--workflow) {
  background: rgba(124, 82, 255, 0.1);
  color: #7c52ff;
}

.editor-content :deep(.connection-badge--transfer) {
  background: rgba(0, 109, 210, 0.1);
  color: #006dd2;
}

/* Sidebar action list badge — template-rendered, scoped attr is present */
.action-item .connection-badge {
  background: rgba(28, 28, 28, 0.1);
  color: #1c1c1c;
  font-family: "SF Mono", "Courier New", monospace;
  font-weight: 400;
}

/* ── Slash command styles (shared with SkillPanel) ───────────────────────── */
.slash-command-menu {
  position: fixed;
  z-index: 1500;
  min-width: 240px;
  background: var(--dt-color-surface-primary, #fff);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14);
  padding: 6px 0;
  font-size: 13px;
}

.slash-section-label {
  padding: 4px 12px 2px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--dt-color-foreground-muted);
}

.slash-section-label--spaced {
  padding-top: 8px;
}

.slash-actions-scroll {
  max-height: 190px;
  overflow-y: auto;
}

.slash-action-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  color: var(--dt-color-foreground-primary);
}

.slash-action-item:hover,
.slash-action-item.selected {
  background: var(--dt-color-surface-secondary);
}

.slash-no-results {
  padding: 8px 12px;
  color: var(--dt-color-foreground-muted);
  font-style: italic;
}

.slash-divider {
  height: 1px;
  background: var(--dt-color-border-subtle);
  margin: 4px 0;
}

.slash-menu-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  color: var(--dt-color-foreground-primary);
}

.slash-menu-row:hover,
.slash-menu-row.selected {
  background: var(--dt-color-surface-secondary);
}

.slash-row-icon {
  flex-shrink: 0;
  color: var(--dt-color-foreground-muted);
}

.slash-row-label {
  flex: 1;
}

.slash-chevron {
  color: var(--dt-color-foreground-muted);
  flex-shrink: 0;
}

.slash-submenu {
  position: fixed;
  z-index: 1600;
  background: var(--dt-color-surface-primary, #fff);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14);
  padding: 6px 0;
  font-size: 13px;
}

.slash-transfer-submenu { min-width: 180px; }
.slash-workflow-submenu { min-width: 240px; }
.slash-targets-submenu  { min-width: 180px; }

.slash-workflow-search {
  padding: 6px 8px;
  border-bottom: 1px solid var(--dt-color-border-subtle);
  margin-bottom: 4px;
}

.slash-submenu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  color: var(--dt-color-foreground-primary);
}

.slash-submenu-item:hover,
.slash-submenu-item.selected {
  background: var(--dt-color-surface-secondary);
}

.slash-submenu-label { flex: 1; }
.slash-target-count {
  font-size: 11px;
  color: var(--dt-color-foreground-muted);
  background: var(--dt-color-surface-secondary);
  border-radius: 10px;
  padding: 1px 6px;
}

.slash-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 1400;
}

.slash-source-icon {
  display: inline-flex;
  align-items: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.transfer-panel-scrim {
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.transfer-panel {
  background: #ffffff;
  border: 1px solid rgba(28, 28, 28, 0.11);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 320px;
  overflow: visible;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03),
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
  font-size: 12px;
  text-transform: uppercase;
  color: #535353;
  line-height: 1.4;
}

.transfer-panel-title {
  font-size: 15px;
  font-weight: 590;
  color: #3a3a3a;
  line-height: 1.4;
}

.transfer-combobox {
  position: relative;
}

.transfer-combobox-field {
  position: relative;
}

.transfer-combobox-chevron {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #808080;
  pointer-events: none;
}

.transfer-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 10;
  background: #f9f9f9;
  border: 1px solid rgba(28, 28, 28, 0.11);
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 220px;
  overflow-y: auto;
}

.transfer-dropdown-row {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.1s ease;
}

.transfer-dropdown-row:hover,
.transfer-dropdown-row--selected {
  background: rgba(28, 28, 28, 0.1);
}

.transfer-dropdown-label {
  flex: 1;
  font-size: 15px;
  color: #1c1c1c;
  line-height: 1.6;
}

.transfer-dropdown-role {
  font-size: 12px;
  color: #808080;
  line-height: 1.4;
}

.transfer-dropdown-empty {
  font-size: 14px;
  color: #808080;
  padding: 8px;
  text-align: center;
}
</style>
