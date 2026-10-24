<template>
  <div class="skills-tab">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
      <div>
        <h2 style="font-size: 24px; font-weight: 600; margin: 0 0 8px 0;">Skills &amp; Workflows</h2>
        <p style="font-size: 14px; color: #666; margin: 0;">Manage your agent's skills and connected workflows</p>
      </div>
      <span class="new-skill-btn-wrap" :class="{ 'mining-active': state.miningStatus === 'in-progress' }">
        <dt-button ref="newSkillButtonRef" importance="primary" @click="handleNewSkillClick">
          <template #icon>
            <dt-icon name="plus" size="200" />
          </template>
          New skill
        </dt-button>
      </span>
    </div>

    <!-- Search + Filter row -->
    <div style="display: flex; gap: 12px; margin-bottom: 24px; align-items: center;">
      <dt-input v-model="searchQuery" placeholder="Search" style="flex: 1;">
        <template #leftIcon>
          <dt-icon name="search" size="300" />
        </template>
      </dt-input>

      <!-- Status filter buttons -->
      <div style="display: flex; gap: 8px;">
        <dt-button
          v-for="f in filters"
          :key="f"
          size="sm"
          :importance="activeFilter === f ? 'primary' : 'outlined'"
          :kind="activeFilter === f ? undefined : 'muted'"
          @click="activeFilter = f"
        >
          {{ f }}
        </dt-button>
      </div>
    </div>

    <!-- Table -->
    <div class="skills-tab__table-wrapper">
      <table class="skills-tab__table">
        <thead>
          <tr>
            <th class="skills-tab__th skills-tab__th--name">Name / Description</th>
            <th class="skills-tab__th skills-tab__th--center">Workflows</th>
            <th class="skills-tab__th skills-tab__th--center">Actions</th>
            <th class="skills-tab__th">Status</th>
            <th class="skills-tab__th skills-tab__th--center">Usage</th>
            <th class="skills-tab__th">Health</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="skill in filteredSkills" :key="skill.id">
            <!-- Skill row -->
            <tr
              class="skills-tab__row"
              :class="{ 'skills-tab__row--archived': skill.status === 'Archived' }"
              @click="openSkillPanel(skill)"
            >
              <!-- Name / Description -->
              <td class="skills-tab__td skills-tab__td--name">
                <div class="d-d-flex d-ai-center d-gap-200">
                  <button
                    class="skills-tab__chevron-btn"
                    @click.stop="toggleRow(skill.id)"
                    :aria-label="expandedRows.has(skill.id) ? 'Collapse' : 'Expand'"
                  >
                    <dt-icon
                      :name="expandedRows.has(skill.id) ? 'chevron-down' : 'chevron-right'"
                      size="200"
                      class="d-fc-muted"
                    />
                  </button>
                  <div>
                    <div class="skills-tab__skill-name">{{ skill.name }}</div>
                    <div class="skills-tab__skill-desc">{{ skill.description }}</div>
                  </div>
                </div>
              </td>
              <!-- Workflows count -->
              <td class="skills-tab__td skills-tab__td--center">
                {{ skill.workflows?.length ?? 0 }}
              </td>
              <!-- Actions count -->
              <td class="skills-tab__td skills-tab__td--center">
                {{ skill.actionCount ?? '—' }}
              </td>
              <!-- Status badge -->
              <td class="skills-tab__td">
                <dt-badge :type="statusType(skill.status)">{{ skill.status }}</dt-badge>
              </td>
              <!-- Usage -->
              <td class="skills-tab__td skills-tab__td--center">
                {{ skill.usageCount != null ? skill.usageCount : '—' }}
              </td>
              <!-- Health -->
              <td class="skills-tab__td">
                <div v-if="skill.hasMiningOpportunity" class="skills-tab__health-cell">
                  <dt-tooltip :message="miningTooltip(skill)">
                    <template #anchor>
                      <dt-chip
                        size="xs"
                        class="skills-tab__mining-chip"
                        @click.stop="state.toggleMiningDrawer()"
                      >
                        <template #icon>
                          <dt-icon name="lightning-bolt" size="100" />
                        </template>
                        Can be improved
                      </dt-chip>
                    </template>
                  </dt-tooltip>
                </div>
                <span v-else-if="skill.passRate != null" class="skills-tab__pass-rate">
                  {{ skill.passRate }}%
                  <dt-icon name="check-circle" size="200" class="d-fc-success" />
                </span>
                <span v-else class="d-fc-muted">—</span>
              </td>
            </tr>

            <!-- Expanded: workflow sub-rows -->
            <template v-if="expandedRows.has(skill.id)">
              <tr v-if="!skill.workflows || skill.workflows.length === 0" class="skills-tab__subrow">
                <td class="skills-tab__td skills-tab__td--subindent" colspan="6">
                  <span class="d-fc-muted d-body--sm">No workflows</span>
                </td>
              </tr>
              <tr
                v-for="wf in skill.workflows"
                :key="`${skill.id}-${wf.id}`"
                class="skills-tab__subrow"
              >
                <td class="skills-tab__td skills-tab__td--subindent">
                  <div class="d-d-flex d-ai-center d-gap-200">
                    <dt-icon name="workflow" size="200" class="d-fc-muted" />
                    <span class="d-body--sm">{{ wf.name }}</span>
                  </div>
                </td>
                <td class="skills-tab__td skills-tab__td--center d-body--sm d-fc-muted">—</td>
                <td class="skills-tab__td skills-tab__td--center d-body--sm d-fc-muted">{{ wf.stepCount }}</td>
                <td class="skills-tab__td">
                  <dt-badge :type="statusType(wf.status)" size="sm">{{ wf.status }}</dt-badge>
                </td>
                <td class="skills-tab__td skills-tab__td--center d-body--sm d-fc-muted">—</td>
                <td class="skills-tab__td d-body--sm d-fc-muted">—</td>
              </tr>
            </template>
          </template>

          <!-- Empty state -->
          <tr v-if="filteredSkills.length === 0">
            <td colspan="6" class="skills-tab__empty">
              No skills match your search.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Add Skill Popover -->
  <add-skill-popover
    :is-open="showAddSkillPopover"
    :trigger-element="newSkillTriggerElement"
    @close="showAddSkillPopover = false"
    @select-create-from-scratch="handleCreateFromScratch"
    @select-mined-skill="handleSelectMinedSkill"
  />

</template>

<script setup>
import { ref, computed } from 'vue'
import { DtButton, DtBadge, DtChip, DtTooltip, DtIcon, DtInput } from '../../components/ui'
import { state } from '../../state.js'
import { archivedSkills } from '../../config/skillsData.js'
import AddSkillPopover from '../../components/popovers/AddSkillPopover.vue'
import { useSkillBuilder } from '../../composables/useSkillBuilder.js'

const skillBuilder = useSkillBuilder()

const searchQuery = ref('')
const activeFilter = ref('All')
const expandedRows = ref(new Set())

const showAddSkillPopover = ref(false)
const newSkillButtonRef = ref(null)
const newSkillTriggerElement = ref(null)

const filters = ['All', 'Published', 'Draft', 'Archived']

// Merge canvas skills from state with archived/draft skills from config
const allSkills = computed(() => {
  return [...state.skillNodes, ...archivedSkills]
})

const filteredSkills = computed(() => {
  const q = searchQuery.value.toLowerCase()
  const filter = activeFilter.value

  const skills = allSkills.value.filter(skill => {
    const matchesSearch = !q ||
      skill.name.toLowerCase().includes(q) ||
      (skill.description && skill.description.toLowerCase().includes(q))
    const matchesFilter = filter === 'All' || skill.status === filter
    return matchesSearch && matchesFilter
  })

  // Archived always sorted last
  return [
    ...skills.filter(s => s.status !== 'Archived'),
    ...skills.filter(s => s.status === 'Archived'),
  ]
})

function toggleRow(skillId) {
  const next = new Set(expandedRows.value)
  if (next.has(skillId)) {
    next.delete(skillId)
  } else {
    next.add(skillId)
  }
  expandedRows.value = next
}

function openSkillPanel(skill) {
  state.navigateToSkillDetail(skill.id)
}

function handleNewSkillClick() {
  const btnEl = newSkillButtonRef.value?.$el || newSkillButtonRef.value
  newSkillTriggerElement.value = btnEl
  showAddSkillPopover.value = true
}

function handleCreateFromScratch() {
  showAddSkillPopover.value = false
  const skillId = skillBuilder.buildSkillFromScratch()
  state.navigateToSkillDetail(skillId)
}

function handleSelectMinedSkill(opportunity) {
  showAddSkillPopover.value = false
  const skillId = skillBuilder.buildSkillFromMining(opportunity)
  state.navigateToSkillDetail(skillId)
}

function statusType(status) {
  if (status === 'Published') return 'success'
  if (status === 'Archived') return 'muted'
  return 'default'
}

function miningTooltip(skill) {
  if (skill.miningOpportunityName) {
    return `Skill mining found an opportunity: ${skill.miningOpportunityName}`
  }
  return 'Skill mining found an improvement opportunity'
}
</script>

<style scoped>
.skills-tab {
}


.skills-tab__table-wrapper {
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: 8px;
  overflow: hidden;
}

.skills-tab__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.skills-tab__th {
  padding: 10px 14px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--dt-color-foreground-secondary);
  background: var(--dt-color-surface-secondary);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  white-space: nowrap;
}

.skills-tab__th--center {
  text-align: center;
}

.skills-tab__th--name {
  width: 40%;
}

.skills-tab__td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--dt-color-border-subtle);
  vertical-align: middle;
}

.skills-tab__td--center {
  text-align: center;
}

.skills-tab__td--name {
  width: 40%;
}

.skills-tab__td--subindent {
  padding-left: 44px;
}

.skills-tab__row {
  cursor: pointer;
  transition: background 0.1s;
}

.skills-tab__row:hover {
  background: var(--dt-color-surface-secondary);
}

.skills-tab__row--archived .skills-tab__skill-name,
.skills-tab__row--archived .skills-tab__skill-desc {
  color: var(--dt-color-foreground-muted);
}

.skills-tab__subrow {
  background: var(--dt-color-surface-secondary);
}

.skills-tab__chevron-btn {
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: inherit;
}

.skills-tab__skill-name {
  font-weight: 600;
  color: var(--dt-color-foreground-primary);
  line-height: 1.3;
}

.skills-tab__skill-desc {
  font-size: 12px;
  line-height: 1.4;
  margin-top: 2px;
  color: var(--dt-color-foreground-muted);
}

.skills-tab__health-cell {
  display: flex;
  align-items: center;
}

.skills-tab__pass-rate {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  white-space: nowrap;
}

.skills-tab__mining-chip {
  cursor: pointer;
}

.skills-tab__empty {
  padding: 40px;
  text-align: center;
  color: var(--dt-color-foreground-muted);
}

/* Mining thinking effect on New skill button */
@property --new-skill-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.new-skill-btn-wrap {
  position: relative;
  display: inline-flex;
  border-radius: 6px;
}

.new-skill-btn-wrap::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 10px;
  background: conic-gradient(
    from var(--new-skill-angle),
    #9358ff,
    #5ecfff,
    #9358ff
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  padding: 2px;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.new-skill-btn-wrap.mining-active::before {
  opacity: 1;
  animation: new-skill-spin 2s linear infinite;
}

.new-skill-btn-wrap.mining-active {
  animation: new-skill-pulse 2s ease-in-out infinite;
}

@keyframes new-skill-spin {
  to { --new-skill-angle: 360deg; }
}

@keyframes new-skill-pulse {
  0%, 100% { box-shadow: 0 2px 8px rgba(147, 88, 255, 0.3); }
  50%       { box-shadow: 0 2px 16px rgba(147, 88, 255, 0.6), 0 0 24px rgba(94, 207, 255, 0.3); }
}
</style>
