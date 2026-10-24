<template>
	<dt-popover v-model:open="isPopoverOpen" placement="bottom-start">
		<template #anchor>
			<dt-button
				v-if="modelValue"
				importance="outlined"
				size="sm"
				icon-position="right"
				class="d-btn--active"
				@click="togglePopover"
			>
				Handle time · {{ labelForValue(modelValue) }}
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
				Handle time
			</dt-button>
		</template>
		<template #content>
			<DtStack direction="column" gap="300">
				<dt-radio-group v-model="tempSelection" name="handle-time">
					<DtStack direction="column" gap="300">
						<dt-radio value="under-2m">Under 2 min</dt-radio>
						<dt-radio value="2-5m">2–5 min</dt-radio>
						<dt-radio value="5-10m">5–10 min</dt-radio>
						<dt-radio value="over-10m">Over 10 min</dt-radio>
						<dt-radio value="aht-50">+50% over avg</dt-radio>
					</DtStack>
				</dt-radio-group>
				<DtStack direction="row" class="d-jc-space-between d-ai-center">
					<dt-button importance="clear" kind="muted" size="sm" @click="handleClear">Clear</dt-button>
					<dt-button importance="primary" size="sm" @click="handleApply">Apply</dt-button>
				</DtStack>
			</DtStack>
		</template>
	</dt-popover>
</template>

<script setup>
import { ref, watch } from 'vue';
import { DtButton, DtIcon, DtPopover, DtRadio, DtRadioGroup, DtStack } from '../../../ui';

const props = defineProps({ modelValue: { type: String, default: null } });
const emit = defineEmits(['update:modelValue']);

const isPopoverOpen = ref(false);
const tempSelection = ref(props.modelValue);

const labels = {
	'under-2m': 'Under 2 min',
	'2-5m':     '2–5 min',
	'5-10m':    '5–10 min',
	'over-10m': 'Over 10 min',
	'aht-50':   '+50% over avg',
};
function labelForValue(v) { return labels[v] ?? v; }

watch(() => props.modelValue, (v) => { tempSelection.value = v; });

function togglePopover() { isPopoverOpen.value = !isPopoverOpen.value; }
function handleClear() { tempSelection.value = null; }
function handleApply() { emit('update:modelValue', tempSelection.value); isPopoverOpen.value = false; }
function handleClearApplied() { emit('update:modelValue', null); }
</script>
