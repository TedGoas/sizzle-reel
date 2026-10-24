<template>
	<div v-if="isOpen" class="popover-overlay" @click="handleClose">
		<div
			class="publish-popover"
			:style="popoverPosition"
			@click.stop
		>
			<!-- Agent Name Header -->
			<h3 class="popover-header">{{ agentName }}</h3>

			<!-- Status Information -->
			<div class="status-rows">
				<!-- Saved -->
				<div class="status-row">
					<dt-icon name="cloud" size="300" class="status-icon" />
					<span class="status-text">Saved {{ savedTimeAgo }} • by {{ savedByUser }}</span>
				</div>

				<!-- Last Deployed -->
				<div class="status-row">
					<dt-icon name="arrow-up" size="300" class="status-icon" />
					<span class="status-text">Last deployed {{ lastDeployedDate }}</span>
				</div>

				<!-- Version History -->
				<div class="status-row status-row-clickable" @click="handleVersionHistory">
					<dt-icon name="history" size="300" class="status-icon" />
					<span class="status-text">Version history</span>
					<dt-icon name="chevron-right" size="200" class="chevron-icon" />
				</div>

				<!-- Changes -->
				<div class="status-row">
					<dt-icon name="edit" size="300" class="status-icon" />
					<span class="status-text">{{ changesText }}</span>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="action-buttons">
				<dt-button
					importance="outlined"
					size="md"
					@click="handleShareLink"
				>
					Share link
				</dt-button>
				<dt-button
					importance="primary"
					size="md"
					@click="handlePublish"
				>
					Publish
					<dt-icon name="arrow-up" size="200" style="margin-left: 6px;" />
				</dt-button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { debugLogger } from '../../lib/debugLogger.js';
import { computed, ref, watch, onUnmounted } from 'vue';
import { DtIcon, DtButton } from '../ui';

const props = defineProps({
	isOpen: {
		type: Boolean,
		default: false
	},
	agentName: {
		type: String,
		default: ''
	},
	triggerElement: {
		type: Object,
		default: null
	}
});

const emit = defineEmits(['close', 'publish', 'share-link', 'version-history']);

// Fake data
const savedTimeAgo = '2 min ago';
const savedByUser = 'Nora Kim';
const lastDeployedDate = 'Jan 15, 2026';

// Change detection (placeholder for now)
const changesText = computed(() => {
	// TODO: Implement actual change detection
	return 'No changes';
});

// Popover positioning
const popoverPosition = ref({});

function calculatePosition() {
	if (!props.triggerElement) {
		debugLogger.warn('No trigger element for popover positioning');
		return;
	}

	const rect = props.triggerElement.getBoundingClientRect();
	const popoverWidth = 400; // Width from CSS
	const gap = 8; // Gap below button
	const viewportWidth = window.innerWidth;

	// Check if popover would overflow on the right
	const wouldOverflowRight = rect.left + popoverWidth > viewportWidth;

	if (wouldOverflowRight) {
		// Align popover's right edge with button's right edge
		popoverPosition.value = {
			position: 'fixed',
			top: `${rect.bottom + gap}px`,
			right: `${viewportWidth - rect.right}px`,
			zIndex: 1001
		};
	} else {
		// Normal positioning - align left edges
		popoverPosition.value = {
			position: 'fixed',
			top: `${rect.bottom + gap}px`,
			left: `${rect.left}px`,
			zIndex: 1001
		};
	}
}

// Event handlers
function handleClose() {
	emit('close');
}

function handlePublish() {
	emit('publish');
	emit('close');
}

function handleShareLink() {
	emit('share-link');
}

function handleVersionHistory() {
	emit('version-history');
}

// Watch for popover opening and recalculate position
watch(() => props.isOpen, (isOpen) => {
	if (isOpen) {
		// Wait for next tick to ensure DOM is ready
		setTimeout(() => {
			calculatePosition();
		}, 0);
		window.addEventListener('resize', calculatePosition);
		window.addEventListener('scroll', calculatePosition, true);
	} else {
		window.removeEventListener('resize', calculatePosition);
		window.removeEventListener('scroll', calculatePosition, true);
	}
});

onUnmounted(() => {
	window.removeEventListener('resize', calculatePosition);
	window.removeEventListener('scroll', calculatePosition, true);
});
</script>

<style scoped>
.popover-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1000;
	background: transparent;
}

.publish-popover {
	background: white;
	border-radius: 8px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);
	padding: 24px;
	width: 400px;
	max-width: calc(100vw - 32px);
}

.popover-header {
	font-size: 24px;
	font-weight: 600;
	margin: 0 0 20px 0;
	color: #1a1a1a;
}

.status-rows {
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-bottom: 24px;
}

.status-row {
	display: flex;
	align-items: center;
	gap: 12px;
	color: #666;
	font-size: 14px;
	min-height: 24px;
}

.status-row-clickable {
	cursor: pointer;
	transition: background-color 0.15s ease;
	padding: 4px 8px;
	margin: -4px -8px;
	border-radius: 4px;
}

.status-row-clickable:hover {
	background-color: #f5f5f5;
}

.status-icon {
	color: #666;
	flex-shrink: 0;
}

.status-text {
	flex: 1;
}

.chevron-icon {
	color: #666;
	margin-left: auto;
}

.action-buttons {
	display: flex;
	gap: 12px;
	justify-content: space-between;
}

.action-buttons button {
	flex: 1;
}
</style>
