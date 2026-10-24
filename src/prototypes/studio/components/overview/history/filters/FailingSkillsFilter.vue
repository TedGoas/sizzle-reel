<template>
	<dt-popover v-model:open="isPopoverOpen" placement="bottom-start">
		<template #anchor>
			<dt-button
				v-if="modelValue && modelValue.length > 0"
				importance="outlined"
				size="sm"
				icon-position="right"
				class="d-btn--active"
				@click="togglePopover"
			>
				Failing skills · {{ modelValue.length }} selected
				<template #icon>
					<dt-icon name="close" size="200" @click.stop.prevent="handleClearApplied" />
				</template>
			</dt-button>
			<dt-button
				v-else
				importance="outlined"
				kind="muted"
				size="sm"
				icon-position="right"
				@click="togglePopover"
			>
				<template #icon><dt-icon name="chevron-down" size="200" /></template>
				Failing skills
			</dt-button>
		</template>
		<template #content>
			<DtStack direction="column" gap="300" class="failing-skills-popover">
				<DtStack direction="row" class="d-jc-space-between d-ai-center">
					<span class="d-headline--sm d-fc-primary">Failing skills</span>
					<dt-button importance="clear" size="xs" circle @click="isPopoverOpen = false">
						<template #icon><dt-icon name="close" size="200" /></template>
					</dt-button>
				</DtStack>
				<dt-input v-model="searchQuery" placeholder="Search skills" size="sm" type="text">
					<template #leftIcon="{ iconSize }">
						<dt-icon name="search" :size="iconSize" />
					</template>
				</dt-input>
				<dt-checkbox
					:checked="isAllSelected"
					:indeterminate="isSomeSelected && !isAllSelected"
					@input="toggleSelectAll"
				>
					Select all
				</dt-checkbox>
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
				<DtStack direction="row" class="d-jc-space-between d-ai-center">
					<dt-button importance="clear" kind="muted" size="sm" @click="handleClear">Clear</dt-button>
					<dt-button importance="primary" size="sm" @click="handleApply">Apply</dt-button>
				</DtStack>
			</DtStack>
		</template>
	</dt-popover>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { DtButton, DtIcon, DtPopover, DtStack, DtInput, DtCheckbox } from '../../../ui';

const props = defineProps({
	modelValue: { type: Array, default: () => [] },
	availableSkills: { type: Array, default: () => [] }
});
const emit = defineEmits(['update:modelValue']);

const isPopoverOpen = ref(false);
const searchQuery = ref('');
const tempSelection = ref([...props.modelValue]);

watch(() => props.modelValue, (v) => { tempSelection.value = [...v]; });

const filteredSkills = computed(() => {
	if (!searchQuery.value) return props.availableSkills;
	const q = searchQuery.value.toLowerCase();
	return props.availableSkills.filter(s => s.toLowerCase().includes(q));
});

const isAllSelected = computed(() =>
	filteredSkills.value.length > 0 && filteredSkills.value.every(s => tempSelection.value.includes(s))
);
const isSomeSelected = computed(() =>
	filteredSkills.value.some(s => tempSelection.value.includes(s))
);

function toggleSkill(skill) {
	const i = tempSelection.value.indexOf(skill);
	if (i > -1) tempSelection.value.splice(i, 1);
	else tempSelection.value.push(skill);
}

function toggleSelectAll() {
	if (isAllSelected.value) {
		tempSelection.value = tempSelection.value.filter(s => !filteredSkills.value.includes(s));
	} else {
		const next = [...tempSelection.value];
		filteredSkills.value.forEach(s => { if (!next.includes(s)) next.push(s); });
		tempSelection.value = next;
	}
}

function togglePopover() { isPopoverOpen.value = !isPopoverOpen.value; }
function handleClear() { tempSelection.value = []; }
function handleApply() { emit('update:modelValue', [...tempSelection.value]); isPopoverOpen.value = false; }
function handleClearApplied() { emit('update:modelValue', []); }
</script>

<style scoped>
.failing-skills-popover {
	min-width: 250px;
	max-width: 300px;
}
.skills-list {
	max-height: 200px;
	overflow-y: auto;
}
</style>
