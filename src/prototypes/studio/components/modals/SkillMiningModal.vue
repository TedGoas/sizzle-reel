<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="visible" class="modal-backdrop" @click="handleBackdropClick">
        <div class="modal-container" @click.stop>
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="header-left">
              <button v-if="selectedOpportunity" @click="backToList" class="back-button">
                <dt-icon name="arrow-left" size="300" />
                <span>Back</span>
              </button>
              <div v-else style="height: 1px;"></div>
            </div>

            <div class="header-right">
              <button class="icon-button">
                <dt-icon name="link" size="300" />
              </button>
              <button class="icon-button" @click="$emit('close')">
                <dt-icon name="close" size="300" />
              </button>
            </div>
          </div>

          <!-- Modal Content -->
          <div class="modal-content">
            <!-- List View -->
            <div v-if="!selectedOpportunity" class="list-view">
              <h2 class="modal-title">
                Latest skill opportunities
                <dt-icon name="info" size="200" class="d-fc-muted" />
              </h2>

              <div class="badges">
                <span class="badge">Aerolabs delivery agent</span>
                <span class="badge">Last 7 days</span>
              </div>

              <!-- Donut Chart -->
              <div class="agentic-studio__chart-container">
                <skill-mining-donut-chart />
              </div>

              <!-- Opportunities List -->
              <div class="opportunities-list">
                <div
                  v-for="(opportunity, index) in miningOpportunities"
                  :key="opportunity.name"
                  class="opportunity-row"
                  @click="selectOpportunity(opportunity)"
                >
                  <div class="row-left">
                    <div class="color-indicator" :style="{ background: getSegmentColor(index + 1) }"></div>
                    <div class="row-content">
                      <div class="row-header">
                        <span class="row-title">{{ opportunity.name }}</span>
                        <dt-icon v-if="index === 0" name="info" size="200" class="d-fc-muted" />
                      </div>
                      <p class="row-description">{{ opportunity.description }}</p>
                    </div>
                  </div>
                  <div class="row-right">
                    <span v-if="index === 0" class="flame-icon">
                      <dt-icon name="flame" size="200" style="color: #e53935;" />
                    </span>
                    <span class="percentage">{{ opportunity.percentage }}%</span>
                    <dt-icon name="chevron-right" size="200" class="d-fc-muted" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Detail View -->
            <div v-else class="detail-view">
              <h2 class="modal-title">
                {{ selectedOpportunity.name }}
                <dt-icon name="info" size="200" class="d-fc-muted" />
              </h2>

              <div class="badges">
                <span class="badge">Aerolabs delivery agent</span>
                <span class="badge">Last 7 days</span>
              </div>

              <skill-opportunity-detail
                :opportunity="selectedOpportunity"
                section-title="Automation opportunity"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'
import { DtIcon } from '../ui'
import SkillMiningDonutChart from '../charts/SkillMiningDonutChart.vue'
import SkillOpportunityDetail from '../skills/SkillOpportunityDetail.vue'
import { miningOpportunities } from '../../config/skillsData.js'

defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const selectedOpportunity = ref(null)

const selectOpportunity = (opportunity) => {
  selectedOpportunity.value = opportunity
}

const backToList = () => {
  selectedOpportunity.value = null
}

const handleBackdropClick = () => {
  emit('close')
}

const getSegmentColor = (segment) => {
  const colors = {
    1: 'var(--dt-color-chart-categorical-01)',
    2: 'var(--dt-color-chart-categorical-02)',
    3: 'var(--dt-color-chart-categorical-03)',
    4: 'var(--dt-color-chart-categorical-04)',
    5: 'var(--dt-color-chart-categorical-05)'
  }
  return colors[segment] || 'var(--dt-color-chart-categorical-05)'
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 40px;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 1120px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
}

.header-left {
  flex: 1;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px;
  margin-left: -8px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.back-button:hover {
  background: #f0f0f0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.icon-button:hover {
  background: #f0f0f0;
}

.modal-content {
  overflow-y: auto;
  padding: 32px;
  flex: 1;
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badges {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
}

.badge {
  padding: 6px 12px;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 14px;
  color: #666;
}

/* List View */
.agentic-studio__chart-container {
  display: flex;
  justify-content: center;
  margin: 40px 0;
  border: none;
}

.agentic-studio__chart-container :deep(*) {
  border: none;
}

.opportunities-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.opportunity-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.opportunity-row:hover {
  background: #f5f5f5;
}

.row-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
  margin-top: 4px;
}

.row-content {
  flex: 1;
}

.row-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.row-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.row-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.row-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.flame-icon {
  display: flex;
  align-items: center;
}

.percentage {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

/* Detail View */
.detail-view {
  max-width: 720px;
}

/* Modal transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-container {
  transform: scale(0.95);
}

.modal-fade-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
