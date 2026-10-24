<template>
	<!-- List View -->
	<div v-if="state.provingGroundView === 'list'">
		<!-- Header with Generate Button -->
		<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
			<div>
				<h2 style="font-size: 24px; font-weight: 600; margin: 0 0 8px 0;">Proving Ground</h2>
				<p style="font-size: 14px; color: #666; margin: 0;">Test your agent before it handles real world scenarios</p>
			</div>

			<!-- Button Group with Error - Changes based on state -->
			<div>
				<div style="display: flex; gap: 12px;">
				<template v-if="!hasGeneratedScenarios">
					<!-- Initial State: Generate new test -->
					<dt-button
						importance="primary"
						@click="generateScenarios"
						:disabled="isGeneratingScenarios || isTestingInProgress"
					>
						Generate new test
					</dt-button>
				</template>
				<template v-else>
					<!-- After Generation: Regenerate + Select channels + Test X scenarios -->
					<dt-button
						importance="clear"
						kind="muted"
						@click="regenerateScenarios"
						:disabled="isTestingInProgress"
					>
						Regenerate scenarios
					</dt-button>
					<dt-button
						ref="channelButtonRef"
						importance="outlined"
						kind="muted"
						@click="handleChannelSelectorClick"
						:disabled="isTestingInProgress"
					>
						{{ selectedTestChannel }}
						<dt-icon name="chevron-down" size="200" style="margin-left: 4px;" />
					</dt-button>
					<dt-button
						importance="primary"
						@click="runTests"
						:disabled="selectedScenarioIds.size === 0 || isTestingInProgress"
					>
						{{ testButtonText }}
					</dt-button>
				</template>
				</div>

				<!-- Channel Selection Error -->
				<transition name="fade">
					<div v-if="showChannelError" class="d-fc-critical" style="font-size: 12px; margin-top: 8px; text-align: right;">
						Please select a channel before running tests.
					</div>
				</transition>
			</div>
		</div>

		<!-- Generation Loading Banner -->
		<transition name="banner-slide">
			<div v-if="isGeneratingScenarios" class="generation-banner">
				<div class="banner-content">
					<dt-icon name="sparkles" size="300" class="banner-icon" />
					<div>
						<div class="banner-title">Generating test scenarios</div>
						<div class="banner-description">Our AI is analyzing your agent to create relevant test cases...</div>
					</div>
					<div class="loading-dots">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			</div>
		</transition>

		<!-- Scenario Selection Table -->
		<transition name="table-fade">
			<div v-if="hasGeneratedScenarios && !isTestingInProgress" class="scenario-table-card">
				<div class="table-title-bar">
					<div class="table-title">Generated Scenarios–{{ formatCurrentDate() }}</div>
					<button class="remove-link" @click="removeScenarios">Remove scenarios</button>
				</div>
				<table class="d-table">
					<thead>
						<tr>
							<th scope="col" class="checkbox-cell">
								<dt-checkbox
									id="select-all-scenarios"
									name="select-all-scenarios"
									:checked="allSelected"
									:indeterminate="someSelected"
									@change="toggleAllScenarios"
									aria-label="Select all scenarios"
								/>
							</th>
							<th scope="col" style="width: 35%;">Scenario</th>
							<th scope="col" style="width: 45%;">Skills</th>
							<th scope="col" style="width: 20%; text-align: right;">Complexity</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="scenario in scenarios"
							:key="scenario.id"
							@click="toggleScenario(scenario.id)"
							class="scenario-row"
						>
							<td class="checkbox-cell" @click.stop>
								<dt-checkbox
									:id="`scenario-${scenario.id}`"
									:name="`scenario-${scenario.id}`"
									:checked="selectedScenarioIds.has(scenario.id)"
									@change="toggleScenario(scenario.id)"
									:aria-label="`Select scenario ${scenario.id}`"
								/>
							</td>
							<td style="padding: 12px 16px;">
								<div class="scenario-text">{{ scenario.description }}</div>
							</td>
							<td style="padding: 12px 16px;">
								<div class="skills-chips">
									<dt-chip
										v-for="skill in scenario.skills"
										:key="skill"
										size="xs"
										:hide-close="true"
									>
										{{ skill }}
									</dt-chip>
								</div>
							</td>
							<td style="padding: 12px 16px; text-align: right;">
								<span class="complexity-text">{{ scenario.complexity }}</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</transition>

		<!-- Testing In Progress Banner -->
		<transition name="banner-slide">
			<div v-if="isTestingInProgress" class="testing-banner">
				<div class="banner-content">
					<dt-icon name="test-tube" size="300" class="banner-icon" />
					<div>
						<div class="banner-title">Running tests</div>
						<div class="banner-description">Testing {{ selectedScenarioIds.size }} scenario{{ selectedScenarioIds.size !== 1 ? 's' : '' }} against your agent...</div>
					</div>
					<div class="loading-dots">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			</div>
		</transition>

		<!-- Channel Selector Popover -->
		<channel-selector-popover
			:is-open="showChannelSelector"
			:trigger-element="channelButtonElement"
			v-model="selectedTestChannel"
			@close="showChannelSelector = false"
		/>

		<!-- Filters (hidden when table is showing) -->
		<div v-if="!hasGeneratedScenarios" style="display: flex; gap: 12px; margin-bottom: 24px;">
			<dt-input placeholder="Search" style="flex: 1;">
				<template #leftIcon>
					<dt-icon name="search" size="300" />
				</template>
			</dt-input>
			<dt-select-menu v-model="state.selectedChannel" :options="channelOptions" />
			<dt-select-menu v-model="state.selectedSort" :options="sortOptions" />
		</div>

		<!-- Testing Results Section -->
		<div>
			<h3 style="font-size: 15px; font-weight: 600; margin: 0 0 16px 0;">Testing Results</h3>

			<!-- Timeline -->
			<test-result-timeline :results="state.testResultsList" @select="viewTestDetails" />
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { DtButton, DtInput, DtIcon, DtSelectMenu, DtCheckbox, DtChip } from '../../components/ui'
import TestResultTimeline from '../../components/testing/TestResultTimeline.vue'
import ChannelSelectorPopover from '../../components/popovers/ChannelSelectorPopover.vue'
import { testResults } from '../../config/testResultsData.js'
import { STATUS_COLORS } from '../../config/statusColors.js'
import { channelOptions, sortOptions } from '../../config/tabsConfig.js'
import { state } from '../../state.js'
import { useNavigation } from '../../composables/useNavigation.js'

const { viewTestDetails } = useNavigation()

// State management
const isGeneratingScenarios = ref(false)
const isTestingInProgress = ref(false)
const showChannelSelector = ref(false)
const channelButtonRef = ref(null)
const channelButtonElement = ref(null)
const showChannelError = ref(false)

// Initialize test results from data if not already loaded
if (state.testResultsList.length === 0) {
	state.testResultsList = [...testResults]
}

// Use global state for persistence
const scenarios = computed({
	get: () => state.generatedScenarios,
	set: (val) => state.generatedScenarios = val
})

const selectedScenarioIds = computed({
	get: () => state.selectedScenarioIds,
	set: (val) => state.selectedScenarioIds = val
})

const selectedTestChannel = computed({
	get: () => state.selectedTestChannel,
	set: (val) => state.selectedTestChannel = val
})

// Computed properties
const hasGeneratedScenarios = computed(() => scenarios.value.length > 0 && !isGeneratingScenarios.value)

const allSelected = computed(() => {
	return scenarios.value.length > 0 && selectedScenarioIds.value.size === scenarios.value.length
})

const someSelected = computed(() => {
	return selectedScenarioIds.value.size > 0 && selectedScenarioIds.value.size < scenarios.value.length
})

const testButtonText = computed(() => {
	const count = selectedScenarioIds.value.size
	if (count === 0) return 'Select scenarios to test'
	return `Test ${count} scenario${count !== 1 ? 's' : ''}`
})

// Mock scenario data generator
function generateMockScenarios() {
	const channels = ['Voice', 'SMS', 'Email', 'Chat']
	const complexities = ['Simple', 'Medium', 'Complex']
	const descriptions = [
		'Customer requests to book a new appointment',
		'User asks about available time slots this week',
		'Caller wants to reschedule an existing appointment',
		'Customer inquires about cancellation policy',
		'User requests appointment confirmation details',
		'Caller asks to modify appointment preferences',
		'Customer wants to book multiple appointments',
		'User requests available services and pricing',
		'Customer asks about wait times and availability',
		'Caller needs emergency appointment scheduling',
		'User wants to update contact information',
		'Customer requests appointment history',
		'Caller asks about office location and hours',
		'User needs to cancel and reschedule same day',
		'Customer inquires about telemedicine options',
		'Caller wants to schedule follow-up visit'
	]

	const allSkills = [
		'Appointment Scheduling',
		'Knowledge Retrieval',
		'Patient Management',
		'Calendar Coordination',
		'Payment Processing',
		'Insurance Verification',
		'Prescription Management',
		'Symptom Assessment',
		'Follow-up Scheduling',
		'Medical Records',
		'Billing Inquiry',
		'Referral Management',
		'Lab Results',
		'Telehealth Setup'
	]

	function getRandomSkills() {
		const numSkills = Math.floor(Math.random() * 3) + 1 // 1-3 skills
		const shuffled = [...allSkills].sort(() => Math.random() - 0.5)
		return shuffled.slice(0, numSkills)
	}

	// Generate 4-10 scenarios randomly
	const numScenarios = Math.floor(Math.random() * 7) + 4 // 4-10 scenarios
	const shuffledDescriptions = [...descriptions].sort(() => Math.random() - 0.5)

	return shuffledDescriptions.slice(0, numScenarios).map((desc, index) => ({
		id: (index + 1).toString().padStart(3, '0'),
		description: desc,
		channel: channels[Math.floor(Math.random() * channels.length)],
		complexity: complexities[Math.floor(Math.random() * complexities.length)],
		skills: getRandomSkills()
	}))
}

// Actions
async function generateScenarios() {
	isGeneratingScenarios.value = true
	scenarios.value = []
	selectedScenarioIds.value = new Set()

	// Simulate API call
	await new Promise(resolve => setTimeout(resolve, 2500))

	scenarios.value = generateMockScenarios()
	// Auto-select all scenarios by default
	scenarios.value.forEach(s => selectedScenarioIds.value.add(s.id))
	isGeneratingScenarios.value = false
}

async function regenerateScenarios() {
	await generateScenarios()
}

function toggleScenario(id) {
	const newSet = new Set(selectedScenarioIds.value)
	if (newSet.has(id)) {
		newSet.delete(id)
	} else {
		newSet.add(id)
	}
	selectedScenarioIds.value = newSet
}

function selectAllScenarios() {
	const newSet = new Set()
	scenarios.value.forEach(s => newSet.add(s.id))
	selectedScenarioIds.value = newSet
}

function toggleAllScenarios() {
	if (allSelected.value) {
		// Deselect all
		selectedScenarioIds.value = new Set()
	} else {
		// Select all
		selectAllScenarios()
	}
}

function removeScenarios() {
	// Clear scenarios and selections to return to initial state
	scenarios.value = []
	selectedScenarioIds.value = new Set()
}

function formatCurrentDate() {
	const now = new Date()
	const options = { year: 'numeric', month: 'long', day: 'numeric' }
	return now.toLocaleDateString('en-US', options)
}

function generateScenarioDetails(scenario, passFail, skills) {
	const passDetails = [
		`The AI efficiently ${scenario.description.toLowerCase().replace(/^customer |^user |^caller /, '')} with clear communication.`,
		`The AI successfully ${scenario.description.toLowerCase().replace(/^customer |^user |^caller /, '')} and provided accurate information.`,
		`The AI handled this request smoothly, ${scenario.description.toLowerCase().replace(/^customer |^user |^caller /, '')}.`,
		`The AI effectively managed the request and ${scenario.description.toLowerCase().replace(/^customer |^user |^caller /, '')}.`
	]

	const failDetails = [
		`The AI struggled to understand the request and provided unclear guidance.`,
		`The AI had difficulty processing this scenario and gave incomplete information.`,
		`The AI failed to properly ${scenario.description.toLowerCase().replace(/^customer |^user |^caller /, '')}.`,
		`The AI encountered issues and couldn't fully complete the requested task.`
	]

	return passFail === 'Pass'
		? passDetails[Math.floor(Math.random() * passDetails.length)]
		: failDetails[Math.floor(Math.random() * failDetails.length)]
}

function generateTestSynopsis(passed, total, actualPercentage, channelType) {
	if (actualPercentage >= 85) {
		return `Excellent performance across ${channelType.toLowerCase()} channel${channelType === 'Voice and Digital' ? 's' : ''}. Strong capabilities demonstrated in key scenarios with consistent accuracy and reliability.`
	} else if (actualPercentage >= 70) {
		return `Solid performance on routine tasks with some areas for improvement. Demonstrates reliable handling of standard scenarios across ${channelType.toLowerCase()} interactions.`
	} else {
		return `Mixed results showing strengths in basic scenarios but challenges with more complex requests. Additional refinement recommended for ${channelType.toLowerCase()} channel optimization.`
	}
}

function generateTestResult(numScenarios, testedScenarios) {
	// Calculate a pass rate in excellent range (86-100%)
	const passRate = Math.floor(Math.random() * 15) + 86 // 86-100%
	const passed = Math.ceil((numScenarios * passRate) / 100)

	// Calculate actual percentage based on passed count
	const actualPercentage = Math.round((passed / numScenarios) * 100)

	// Determine status based on pass rate
	let status, color
	if (actualPercentage >= 86) {
		status = 'Excellent'
		color = STATUS_COLORS.excellent
	} else if (actualPercentage >= 66) {
		status = 'Passed'
		color = STATUS_COLORS.passed
	} else {
		status = 'Failed'
		color = STATUS_COLORS.failed
	}

	// Get next agent version
	const latestVersion = state.testResultsList[0]?.agent?.match(/v(\d+)/)?.[1] || '12'
	const nextVersion = parseInt(latestVersion) + 1

	// Shuffle scenarios to randomize which ones pass/fail
	const shuffledScenarios = [...testedScenarios].sort(() => Math.random() - 0.5)

	// Convert tested scenarios to result format
	const scenarioResults = shuffledScenarios.map((scenario, index) => {
		// First 'passed' scenarios pass, rest fail
		const passFail = index < passed ? 'Pass' : 'Fail'
		const difficulty = scenario.complexity === 'Simple' ? 'Easy' :
		                  scenario.complexity === 'Complex' ? 'Hard' : 'Medium'

		return {
			id: index + 1,
			scenario: scenario.description,
			details: generateScenarioDetails(scenario, passFail, scenario.skills),
			channel: scenario.channel,
			passFail,
			skills: scenario.skills.map(skill => ({
				name: skill,
				passed: passFail === 'Pass'
			})),
			difficulty
		}
	})

	const channelType = selectedTestChannel.value
	const synopsis = generateTestSynopsis(passed, numScenarios, actualPercentage, channelType)

	return {
		id: Date.now(),
		status,
		completion: passed,
		total: numScenarios,
		percentage: actualPercentage,
		color,
		date: formatCurrentDate(),
		agent: `Agent v${nextVersion}`,
		isNew: true,
		channels: channelType === 'Voice and Digital' ? ['phone', 'message'] :
		          channelType === 'Voice Only' ? ['phone'] : ['message'],
		description: synopsis,
		scenarios: scenarioResults
	}
}

async function runTests() {
	if (selectedScenarioIds.value.size === 0) return

	// Check if channel is selected
	if (selectedTestChannel.value === 'Select channels') {
		showChannelError.value = true
		// Auto-hide error after 5 seconds
		setTimeout(() => {
			showChannelError.value = false
		}, 5000)
		return
	}

	// Clear any previous error
	showChannelError.value = false

	isTestingInProgress.value = true
	const numScenarios = selectedScenarioIds.value.size

	// Get the tested scenarios
	const testedScenarios = scenarios.value.filter(s => selectedScenarioIds.value.has(s.id))

	// Simulate test execution
	await new Promise(resolve => setTimeout(resolve, 3000))

	isTestingInProgress.value = false

	// Generate new test result with current date
	const newResult = generateTestResult(numScenarios, testedScenarios)

	// Mark previous results as not new
	state.testResultsList.forEach(result => result.isNew = false)

	// Add new result to the beginning
	state.testResultsList.unshift(newResult)

	// Store latest test result ID for navigation
	state.latestTestResultId = newResult.id

	// Show completion toast
	state.showTestCompleteToast = true

	// Reset state
	scenarios.value = []
	selectedScenarioIds.value = new Set()
}

function handleChannelSelectorClick() {
	// Get the button element for positioning
	const btnEl = channelButtonRef.value?.$el || channelButtonRef.value
	channelButtonElement.value = btnEl
	showChannelSelector.value = true
}
</script>

<style scoped>
/* Banner Styles */
.generation-banner,
.testing-banner {
	background: #f9f9f9;
	border: 1px solid #e0e0e0;
	border-radius: 12px;
	padding: 20px 24px;
	margin-bottom: 24px;
}

.banner-content {
	display: flex;
	align-items: center;
	gap: 16px;
}

.banner-icon {
	color: var(--dt-color-brand-purple);
}

.banner-title {
	font-size: 15px;
	font-weight: 600;
	color: #1c1c1c;
	margin-bottom: 4px;
}

.banner-description {
	font-size: 14px;
	color: #666;
}

/* Scenario Table Card */
.scenario-table-card {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	overflow: hidden;
	margin-bottom: 32px;
}

.scenario-table-card .d-table thead th {
	border-bottom: 1px solid #e0e0e0;
	border-right: 1px solid #e0e0e0;
	background: #fafafa;
	padding: 12px 16px;
	font-size: 13px;
	font-weight: 600;
	color: #666;
}

.scenario-table-card .d-table thead th:last-child {
	border-right: none;
}

.scenario-table-card .d-table tbody td {
	border-bottom: 1px solid #f0f0f0;
	border-right: 1px solid #f0f0f0;
}

.scenario-table-card .d-table tbody td:last-child {
	border-right: none;
}

.scenario-table-card .d-table tbody tr:last-child td {
	border-bottom: none;
}

.table-title-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 20px;
	border-bottom: 1px solid #e0e0e0;
}

.table-title {
	font-size: 15px;
	font-weight: 600;
	color: #1c1c1c;
}

.remove-link {
	background: none;
	border: none;
	color: #0066cc;
	font-size: 14px;
	cursor: pointer;
	padding: 0;
}

.remove-link:hover {
	text-decoration: underline;
}

.checkbox-cell {
	width: 48px;
	padding: 12px !important;
	text-align: center;
	vertical-align: middle;
}

.scenario-row {
	cursor: pointer;
	transition: background 0.1s ease;
}

.scenario-row:hover {
	background: #fafafa;
}

.scenario-text {
	font-size: 14px;
	color: #1c1c1c;
	line-height: 1.4;
}

.skills-chips {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
}

.complexity-text {
	font-size: 14px;
	color: #1c1c1c;
}

/* Transitions */
.banner-slide-enter-active,
.banner-slide-leave-active {
	transition: all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.banner-slide-enter-from {
	opacity: 0;
	transform: translateY(-20px);
}

.banner-slide-leave-to {
	opacity: 0;
	transform: translateY(-20px);
}

.table-fade-enter-active {
	transition: all 0.4s ease-out;
}

.table-fade-leave-active {
	transition: all 0.3s ease-in;
}

.table-fade-enter-from {
	opacity: 0;
	transform: translateY(10px);
}

.table-fade-leave-to {
	opacity: 0;
}

/* Loading dots animation */
.loading-dots {
	display: flex;
	gap: 6px;
	align-items: center;
	margin-left: auto;
}

.loading-dots span {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: var(--dt-color-brand-purple);
	animation: loading-bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
	animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
	animation-delay: -0.16s;
}

@keyframes loading-bounce {
	0%, 80%, 100% {
		transform: scale(0.6);
		opacity: 0.5;
	}
	40% {
		transform: scale(1);
		opacity: 1;
	}
}
</style>
