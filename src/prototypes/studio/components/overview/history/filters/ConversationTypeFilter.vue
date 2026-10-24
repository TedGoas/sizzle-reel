<template>
	<dt-popover
		v-model:open="isPopoverOpen"
		placement="bottom-start"
	>
		<template #anchor>
			<!-- Applied state: show value with X button -->
			<dt-button
				v-if="modelValue"
				importance="outlined"
				size="sm"
				icon-position="right"
				class="d-btn--active"
				@click="togglePopover"
			>
				Conversation type · {{ modelValue }}
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
				Conversation type
			</dt-button>
		</template>

		<template #content>
			<DtStack direction="column" gap="300">
				<!-- Radio options -->
				<dt-radio-group v-model="tempSelection" name="conversation-type">
					<DtStack direction="column" gap="300">
						<dt-radio value="Customer conversations">
							Customer conversations
						</dt-radio>

						<dt-radio value="Test conversations">
							Test conversations
						</dt-radio>
					</DtStack>
				</dt-radio-group>

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
import { ref, watch } from 'vue';
import { DtButton, DtIcon, DtPopover, DtRadio, DtRadioGroup, DtStack } from '../../../ui';

const props = defineProps({
	modelValue: {
		type: String,
		default: null
	}
});

const emit = defineEmits(['update:modelValue']);

// Popover open state
const isPopoverOpen = ref(false);

// Temporary selection (before Apply is clicked)
const tempSelection = ref(props.modelValue);

// Watch for external changes to modelValue and sync temp selection
watch(() => props.modelValue, (newValue) => {
	tempSelection.value = newValue;
});

function togglePopover() {
	isPopoverOpen.value = !isPopoverOpen.value;
}

function handleClear() {
	tempSelection.value = null;
}

function handleApply() {
	emit('update:modelValue', tempSelection.value);
	// Close popover after applying
	isPopoverOpen.value = false;
}

function handleClearApplied() {
	// Clear the filter without opening popover
	emit('update:modelValue', null);
}
</script>

<style scoped>
/* No custom styles needed - using Dialtone components */
</style>
