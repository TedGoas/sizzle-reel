<template>
  <div class="test-results-table">
    <table>
      <thead>
        <tr>
          <th class="th-scenario">Scenario</th>
          <th class="th-channel">Channel</th>
          <th class="th-skills">Skills</th>
          <th class="th-difficulty">Difficulty</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="scenario in scenarios" :key="scenario.id">
          <td class="td-scenario">
            <div class="scenario-row">
              <dt-icon
                class="dt-icon"
                :name="scenario.passFail === 'Pass' ? 'check-circle' : 'x-circle'"
                size="300"
                :class="scenario.passFail === 'Pass' ? 'd-fc-success' : 'd-fc-critical'"
              />
              <div class="scenario-text">
                <div style="font-size: 14px; font-weight: 500; color: #333;">{{ scenario.scenario }}</div>
                <div style="font-size: 13px; color: #666;">{{ scenario.details }}</div>
              </div>
            </div>
          </td>
          <td class="td-channel">{{ scenario.channel }}</td>
          <td class="td-skills">
            <div class="skills-wrapper">
              <dt-chip
                v-for="skill in scenario.skills"
                :key="skill.name"
                size="xs"
                :interactive="false"
                :hide-close="true"
              >
                <template #icon>
                  <dt-icon
                    :name="skill.passed ? 'check' : 'close'"
                    size="200"
                  />
                </template>
                {{ skill.name }}
              </dt-chip>
            </div>
          </td>
          <td class="td-difficulty">{{ scenario.difficulty }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { DtIcon, DtChip } from '../ui'

defineProps({
  scenarios: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.test-results-table {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.test-results-table table {
  width: 100%;
  border-collapse: collapse;
}

.test-results-table th {
  text-align: left;
  padding: 12px 16px;
  background: #fafafa;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #666;
  border-bottom: 1px solid #e0e0e0;
}

.test-results-table td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.test-results-table tbody tr:last-child td {
  border-bottom: none;
}

.th-scenario { width: 40%; }
.th-channel { width: 15%; }
.th-skills { width: 30%; }
.th-difficulty { width: 15%; text-align: right !important; }

.td-difficulty { text-align: right; }

.scenario-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.scenario-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.skills-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
