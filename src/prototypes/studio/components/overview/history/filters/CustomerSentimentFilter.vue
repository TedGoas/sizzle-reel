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
				Sentiment · {{ modelValue }}
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
				Customer sentiment
			</dt-button>
		</template>
		<template #content>
			<DtStack direction="column" gap="300">
				<dt-radio-group v-model="tempSelection" name="customer-sentiment">
					<DtStack direction="column" gap="300">
						<dt-radio value="Positive">Positive</dt-radio>
						<dt-radio value="Neutral">Neutral</dt-radio>
						<dt-radio value="Negative">Negative</dt-radio>
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

watch(() => props.modelValue, (v) => { tempSelection.value = v; });

function togglePopover() { isPopoverOpen.value = !isPopoverOpen.value; }
function handleClear() { tempSelection.value = null; }
function handleApply() { emit('update:modelValue', tempSelection.value); isPopoverOpen.value = false; }
function handleClearApplied() { emit('update:modelValue', null); }
</script>
