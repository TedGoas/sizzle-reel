<template>
	<transition name="drawer">
		<div v-if="visible" class="drawer-container">
			<div class="drawer-content">
				<!-- Drawer Header -->
				<div
					style="
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding-left: var(--dt-size-550);
						padding-right: var(--dt-size-550);
						padding-top: var(--dt-size-450);
						padding-bottom: var(--dt-size-450);
						border-bottom: 1px solid var(--dt-color-border-subtle);
					"
				>
					<h2 class="drawer-header">Skill mining</h2>
					<dt-button importance="clear" kind="muted" @click="$emit('close')">
						<dt-icon name="close" size="300" />
					</dt-button>
				</div>

				<!-- Drawer Body -->
				<div style="padding: 24px; overflow-y: auto; flex: 1">
					<p class="description-text">
						We'll analyze past conversations to identify customer scenarios this
						agent could automate or assist with. Select which calls to mine for
						skills.
					</p>

					<!-- Call Sources -->
					<div style="margin-bottom: 24px">
						<dt-input
							ref="callSourcesInputRef"
							label="Call sources"
							description="Select where this agent is active or planned for deployment. Calls
							handled by AI are excluded."
							:placeholder="
								selectedCallSourcesText || 'Select voice contact centers'
							"
							:model-value="selectedCallSourcesText"
							readonly
							@click="openCallSourcesPopover"
						>
							<template #rightIcon>
								<dt-icon name="chevrons-up-down" size="200" />
							</template>
						</dt-input>

						<call-sources-popover
							ref="callSourcesPopoverRef"
							v-model="selectedCallSources"
							:trigger-ref="callSourcesInputRef"
						/>
					</div>

					<!-- Call Purpose Categories -->
					<div style="margin-bottom: 24px" gap="var(--dt-size-300)">
						<dt-stack direction="column" gap="300">
							<h2 class="input-label">Call purpose categories</h2>
							<p class="input-description">
								Select up to 5 types of calls you want to include.
							</p>
						</dt-stack>
						<dt-recipe-combobox-multi-select
							label="Call purpose categories"
							:label-visible="false"
							placeholder="Select call purpose categories"
							:selected-items="selectedCallPurposeCategories"
							:messages="
								callPurposesError
									? [{ message: callPurposesError, type: 'error' }]
									: []
							"
							@remove="removeCallPurpose"
							@select="selectCallPurpose"
							fallbackPlacement="top"
							appendTo="body"
						>
							<template #selectedItem="{ item }">
								{{ getCallPurposeLabel(item) }}
							</template>
							<template #list="{ listProps }">
								<ul v-bind="listProps" class="d-p0">
									<dt-list-item
										v-for="(purpose, index) in filteredCallPurposes"
										:key="index"
										role="option"
										navigation-type="arrow-keys"
										@click="() => selectCallPurpose(index)"
									>
										{{ purpose.label }}
									</dt-list-item>
								</ul>
							</template>
						</dt-recipe-combobox-multi-select>
					</div>

					<!-- Date Range -->
					<div style="margin-bottom: 24px">
						<dt-radio-group
							v-model="selectedDateRange"
							name="dateRange"
							legend="Date range"
						>
							<dt-radio
								value="7"
								description="Best when callers reach out about similar issues each week."
							>
								Last 7 days
							</dt-radio>
							<dt-radio
								value="30"
								description="Select this if some issues only come up at certain points in the month."
							>
								Last 30 days
							</dt-radio>
						</dt-radio-group>
					</div>

					<!-- Email Toggle -->
					<dt-stack
						direction="row"
						gap="300"
						class="d-w100p d-jc-space-between d-ai-center"
					>
						<dt-stack direction="column" gap="300">
							<p class="input-label">Email me when complete</p>
							<p class="input-description">
								We'll email you when your skill mining results are ready.
								<br />This may take up to an hour.
							</p>
						</dt-stack>
						<dt-toggle :model-value="true" />
					</dt-stack>
				</div>

				<!-- Drawer Footer -->
				<div
					style="
						padding: 16px 24px;
						display: flex;
						justify-content: flex-end;
						gap: 12px;
					"
				>
					<dt-button importance="clear" @click="$emit('close')"
						>Cancel</dt-button
					>
					<dt-button importance="primary" @click="startMining"
						>Mine for skills</dt-button
					>
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup>
import { ref, computed } from "vue";
import {
	DtIcon,
	DtButton,
	DtInput,
	DtRecipeComboboxMultiSelect,
	DtListItem,
	DtRadioGroup,
	DtRadio,
	DtStack,
	DtToggle,
} from '../ui';
import CallSourcesPopover from "./CallSourcesPopover.vue";
import { callSources, callPurposeCategories } from "../../config/skillsData.js";
import { state } from "../../state.js";

defineProps({
	visible: {
		type: Boolean,
		required: true,
	},
});

const emit = defineEmits(["close", "mining-started"]);

// Initialize with no selections
const selectedCallSources = ref([]);
const callSourcesInputRef = ref(null);
const callSourcesPopoverRef = ref(null);

// Date range selection
const selectedDateRange = ref("7");

// Call purpose categories (max 5)
const selectedCallPurposeCategories = ref([]);
const callPurposesError = ref("");

// Computed text for the input display
const selectedCallSourcesText = computed(() => {
	const count = selectedCallSources.value.length;
	if (count === 0) return "";
	if (count === callSources.length) return "All contact centers";
	return `${count} source${count > 1 ? "s" : ""} selected`;
});

// Open the popover when input is clicked
const openCallSourcesPopover = () => {
	if (callSourcesPopoverRef.value) {
		callSourcesPopoverRef.value.open();
	}
};

// Available call purposes (filtered to exclude already selected)
const filteredCallPurposes = computed(() => {
	return callPurposeCategories.filter(
		(purpose) => !selectedCallPurposeCategories.value.includes(purpose.value),
	);
});

// Handle selecting a call purpose
const selectCallPurpose = (indexOrValue) => {
	// Handle both index (from click) and value string (from select event)
	let value;
	if (typeof indexOrValue === "number") {
		// It's an index from the filtered list
		value = filteredCallPurposes.value[indexOrValue].value;
	} else if (typeof indexOrValue === "string") {
		// It's a value string
		value = indexOrValue;
	} else if (indexOrValue && indexOrValue.value) {
		// It's a purpose object
		value = indexOrValue.value;
	}

	// Check if already selected
	if (!value || selectedCallPurposeCategories.value.includes(value)) {
		return;
	}

	// Check if limit reached
	if (selectedCallPurposeCategories.value.length >= 5) {
		callPurposesError.value = "You can only select up to 5 categories";
		return;
	}

	// Clear error and add selection
	callPurposesError.value = "";
	selectedCallPurposeCategories.value.push(value);
};

// Handle removing a call purpose
const removeCallPurpose = (value) => {
	selectedCallPurposeCategories.value =
		selectedCallPurposeCategories.value.filter((p) => p !== value);
	// Clear error when user removes an item
	callPurposesError.value = "";
};

// Get label for a call purpose value
const getCallPurposeLabel = (value) => {
	return callPurposeCategories.find((p) => p.value === value)?.label || value;
};

const startMining = () => {
	// Set mining in progress
	state.miningStatus = "in-progress";

	// Close the drawer
	emit("close");

	// Emit event to show toast
	emit("mining-started");

	// Complete mining after 10 seconds
	setTimeout(() => {
		state.miningStatus = "complete";
		state.hasMiningResults = true;
	}, 10000);
};
</script>

<style scoped>
/* Floating Panel Container */
.drawer-container {
	position: fixed;
	top: 16px;
	right: 16px;
	width: 468px;
	height: calc(100vh - 32px);
	z-index: 1000;
}

.drawer-content {
	width: 100%;
	height: 100%;
	background: white;
	box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.04),
		0px 1px 2px rgba(0, 0, 0, 0.03);
	border-radius: 24px;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.drawer-header {
	font: var(--dt-typography-headline-md);
	color: var(--dt-color-foreground-primary);
}

.description-text {
	font: var(--dt-typography-body-md);
	color: var(--dt-color-foreground-secondary);
	margin-bottom: var(--dt-size-550);
}

.input-label {
	font: var(--dt-typography-label-md);
	color: var(--dt-color-foreground-primary);
}

.input-description {
	font: var(--dt-typography-helper-sm);
	color: var(--dt-color-foreground-secondary);
	margin-bottom: var(--dt-size-300);
}

/* Make the call sources input look clickable */
:deep(.dt-input) {
	cursor: pointer;
}
:deep(.dt-input input) {
	cursor: pointer;
}

/* Vue Transition Classes */
.drawer-enter-active,
.drawer-leave-active {
	transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.3s ease;
}

.drawer-enter-from {
	transform: translateX(484px);
	opacity: 0;
}

.drawer-leave-to {
	transform: translateX(484px);
	opacity: 0;
}

.drawer-enter-to,
.drawer-leave-from {
	transform: translateX(0);
	opacity: 1;
}
</style>

<style>
/* Ensure combobox popover appears above drawer (drawer is z-index: 1000) */
.d-popover[data-qa="dt-popover-container"],
[data-popper-placement],
.tippy-box {
	z-index: 99999 !important;
}
/* Override Dialtone's visibility hidden rule for popovers in this drawer */
.tippy-box[data-popper-reference-hidden] .d-popover__dialog {
	visibility: visible !important;
}
</style>
