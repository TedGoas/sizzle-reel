<template>
	<div v-if="isOpen" class="popover-overlay" @click="handleClose">
		<div
			class="channel-selector-popover"
			:style="popoverPosition"
			@click.stop
		>
			<!-- Header -->
			<h3 class="popover-header">Configure Your Proving Ground</h3>
			<p class="popover-description">Choose which channel or channels you want to focus on.</p>

			<!-- Radio Options -->
			<div class="channel-options">
				<label
					v-for="option in channelOptions"
					:key="option.value"
					class="channel-option"
					:class="{ 'selected': selectedChannel === option.value }"
				>
					<input
						type="radio"
						:value="option.value"
						v-model="selectedChannel"
						class="channel-radio"
					/>
					<span class="channel-label">{{ option.label }}</span>
				</label>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, ref, watch, onUnmounted } from 'vue';

const props = defineProps({
	isOpen: {
		type: Boolean,
		default: false
	},
	triggerElement: {
		type: Object,
		default: null
	},
	modelValue: {
		type: String,
		default: 'Voice and Digital'
	}
});

const emit = defineEmits(['close', 'update:modelValue']);

const selectedChannel = ref(props.modelValue);

// Channel options
const channelOptions = [
	{ value: 'Voice and Digital', label: 'Voice and Digital' },
	{ value: 'Voice Only', label: 'Voice Only' },
	{ value: 'Digital Only', label: 'Digital Only' }
];

// Watch for changes and emit
watch(selectedChannel, (newValue) => {
	emit('update:modelValue', newValue);
	// Auto-close after selection
	setTimeout(() => {
		handleClose();
	}, 200);
});

// Position the popover below the trigger element
const popoverPosition = computed(() => {
	if (!props.triggerElement) {
		return {
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)'
		};
	}

	const rect = props.triggerElement.getBoundingClientRect();
	return {
		top: `${rect.bottom + 8}px`,
		left: `${rect.left}px`
	};
});

function handleClose() {
	emit('close');
}

// Close on Escape key
function handleEscape(e) {
	if (e.key === 'Escape' && props.isOpen) {
		handleClose();
	}
}

watch(() => props.isOpen, (isOpen) => {
	if (isOpen) {
		document.addEventListener('keydown', handleEscape);
	} else {
		document.removeEventListener('keydown', handleEscape);
	}
});

onUnmounted(() => {
	document.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped>
.popover-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
	background: transparent;
}

.channel-selector-popover {
	position: fixed;
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 12px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
	padding: 20px;
	min-width: 320px;
	z-index: 10000;
}

.popover-header {
	font-size: 16px;
	font-weight: 600;
	margin: 0 0 8px 0;
	color: #1c1c1c;
}

.popover-description {
	font-size: 14px;
	color: #666;
	margin: 0 0 16px 0;
	line-height: 1.4;
}

.channel-options {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.channel-option {
	display: flex;
	align-items: center;
	padding: 10px 12px;
	border-radius: 8px;
	cursor: pointer;
	transition: background 0.15s ease;
}

.channel-option:hover {
	background: #f5f5f5;
}

.channel-option.selected {
	background: #f0ebff;
}

.channel-radio {
	width: 16px;
	height: 16px;
	margin: 0;
	cursor: pointer;
	accent-color: var(--dt-color-brand-purple);
}

.channel-label {
	font-size: 14px;
	color: #1c1c1c;
	margin-left: 12px;
	cursor: pointer;
}
</style>
