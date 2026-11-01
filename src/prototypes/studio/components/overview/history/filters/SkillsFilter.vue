<template>
	<dt-popover
		v-model:open="isPopoverOpen"
		placement="bottom-start"
	>
		<template #anchor>
			<!-- Applied state: show count with X button -->
			<dt-button
				v-if="modelValue && modelValue.length > 0"
				importance="outlined"
				size="sm"
				icon-position="right"
				class="d-btn--active"
				@click="togglePopover"
			>
				Skills · {{ modelValue.length }} selected
				<template #icon>
					<dt-icon
						name="close"
						size="200"
						@click.stop.prevent="handleClearApplied"
					/>
				</template>
			</dt-button>

			<!-- Default state: just show label -->
			<dt-button
				v-else
				importance="outlined"
				kind="muted"
				size="sm"
				icon-position="right"
				@click="togglePopover"
			>
				<template #icon>
					<dt-icon name="chevron-down" size="200" />
				</template>
				Skills
			</dt-button>
		</template>

		<template #content>
			<DtStack direction="column" gap="300" class="skills-filter-popover">
				<!-- Header with title and close -->
				<DtStack direction="row" class="d-jc-space-between d-ai-center">
					<span class="d-headline--sm d-fc-primary">Skills</span>
					<dt-button
						importance="clear"
						size="xs"
						circle
						@click="closePopover"
					>
						<template #icon>
							<dt-icon name="close" size="200" />
						</template>
					</dt-button>
				</DtStack>

				<!-- Search input -->
				<dt-input
					v-model="searchQuery"
					placeholder="Search skills"
					size="sm"
					type="text"
				>
					<template #leftIcon="{ iconSize }">
						<dt-icon name="search" :size="iconSize" />
					</template>
				</dt-input>

				<!-- Select all checkbox -->
				<dt-checkbox
					:checked="isAllSelected"
					:indeterminate="isSomeSelected && !isAllSelected"
					@input="toggleSelectAll"
				>
					Select all
				</dt-checkbox>

				<!-- Skills checkboxes -->
				<DtStack direction="column" gap="300" class="skills-list">
					<dt-checkbox
						v-for="skill in filteredSkills"
						:key="skill"
						:checked="tempSelection.includes(skill)"
						@input="toggleSkill(skill)"
					>
						{{ skill }}
					</dt-checkbox>
				</DtStack>

				<!-- Footer with actions -->
				<DtStack direction="row" class="d-jc-space-between d-ai-center">
					<dt-button
						importance="clear"
						kind="muted"
						size="sm"
						@click="handleClear"
					>
						Clear
					</dt-button>
					<dt-button
						importance="primary"
						size="sm"
						@click="handleApply"
					>
						Apply
					</dt-button>
				</DtStack>
			</DtStack>
		</template>
	</dt-popover>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { DtButton, DtIcon, DtPopover, DtStack, DtInput, DtCheckbox } from '../../../ui';

const props = defineProps({
	modelValue: {
		type: Array,
		default: () => []
	},
	availableSkills: {
		type: Array,
		default: () => []
	}
});

const emit = defineEmits(['update:modelValue']);

// Popover open state
const isPopoverOpen = ref(false);

// Search query
const searchQuery = ref('');

// Temporary selection (before Apply is clicked)
const tempSelection = ref([...props.modelValue]);

// Watch for external changes to modelValue and sync temp selection
watch(() => props.modelValue, (newValue) => {
	tempSelection.value = [...newValue];
});

// Filtered skills based on search query
const filteredSkills = computed(() => {
	if (!searchQuery.value) return props.availableSkills;
	const query = searchQuery.value.toLowerCase();
	return props.availableSkills.filter(skill =>
		skill.toLowerCase().includes(query)
	);
});

// Check if all skills are selected
const isAllSelected = computed(() => {
	return filteredSkills.value.length > 0 &&
		filteredSkills.value.every(skill => tempSelection.value.includes(skill));
});

// Check if some (but not all) skills are selected
const isSomeSelected = computed(() => {
	return filteredSkills.value.some(skill => tempSelection.value.includes(skill));
});

// Toggle a single skill
function toggleSkill(skill) {
	const index = tempSelection.value.indexOf(skill);
	if (index > -1) {
		tempSelection.value.splice(index, 1);
	} else {
		tempSelection.value.push(skill);
	}
}

// Toggle select all
function toggleSelectAll() {
	if (isAllSelected.value) {
		// Deselect all filtered skills
		tempSelection.value = tempSelection.value.filter(
			skill => !filteredSkills.value.includes(skill)
		);
	} else {
		// Select all filtered skills
		const newSelection = [...tempSelection.value];
		filteredSkills.value.forEach(skill => {
			if (!newSelection.includes(skill)) {
				newSelection.push(skill);
			}
		});
		tempSelection.value = newSelection;
	}
}

function togglePopover() {
	isPopoverOpen.value = !isPopoverOpen.value;
}

function handleClear() {
	tempSelection.value = [];
}

function handleApply() {
	emit('update:modelValue', [...tempSelection.value]);
	// Close popover after applying
	isPopoverOpen.value = false;
}

function closePopover() {
	// Close the popover
	isPopoverOpen.value = false;
}

function handleClearApplied() {
	// Clear the filter without opening popover
	emit('update:modelValue', []);
}
</script>

<style scoped>
.skills-filter-popover {
	min-width: 250px;
	max-width: 300px;
}

.skills-list {
	max-height: 200px;
	overflow-y: auto;
}
</style>
