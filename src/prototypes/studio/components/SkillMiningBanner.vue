<template>
	<div class="mining-banner-wrapper">
		<dt-notice
			:kind="isComplete ? 'success' : 'info'"
			:important="false"
			hide-close
			class="mining-notice"
		>
			<span>{{ bannerText }}</span>
			<template #action>
				<dt-button
					importance="outlined"
					kind="muted"
					size="sm"
					@click="isComplete ? handleViewDetails() : handleCancel()"
				>
					{{ isComplete ? 'View details' : 'Cancel' }}
				</dt-button>
			</template>
		</dt-notice>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { DtButton, DtNotice } from './ui';
import { state } from "../state.js";

const emit = defineEmits(['mining-cancelled']);

const isComplete = computed(() => state.miningStatus === "complete");

const bannerText = computed(() => {
	return isComplete.value
		? "Skill mining complete"
		: "Skill mining in progress…";
});

const handleCancel = () => {
	// Reset widget state
	state.miningStatus = null;
	state.hasMiningResults = false;

	// Emit event to show toast
	emit('mining-cancelled');
};

const handleViewDetails = () => {
	// Show mining results
	state.hasMiningResults = true;
};
</script>

<style scoped>
.mining-banner-wrapper {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 10;
	width: 100%;
	display: block;
}

/* Remove border radius from notice and make it full width */
:deep(.dt-notice),
:deep(.d-notice) {
	border-radius: 0;
	margin: 0;
	width: 100%;
	max-width: none;
	display: flex;
}

:deep(.d-notice__content) {
	flex: 1;
}

:deep(.d-notice__actions) {
	display: flex;
	align-items: center;
	gap: 8px;
}
</style>
