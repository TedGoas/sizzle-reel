<template>
	<dt-modal
		v-if="isOpen"
		:show="isOpen"
		:close-button-props="{ ariaLabel: 'Close', onClick: handleClose }"
		@update:show="(val) => !val && handleClose()"
		size="large"
		:title="modalTitle"
	>
		<!-- Channel Selection Step -->
		<div v-if="currentStep === 'selection'" class="modal-content">
			<!-- Description -->
			<p class="modal-description">
				Agent is ready to be assigned to a channel and start taking conversations.
				Learn more about assigning an AI Agent
				<a href="#" class="modal-link">here</a>.
			</p>

			<!-- Channel Selection Cards - Row 1 -->
			<div class="channel-cards-row">
				<channel-card
					icon="webchat"
					title="Webchat"
					:selected="selectedChannel === 'webchat'"
					@click="selectChannel('webchat')"
				/>
				<channel-card
					icon="headset"
					title="Contact Centers"
					:selected="selectedChannel === 'contact-centers'"
					@click="selectChannel('contact-centers')"
				/>
			</div>

			<!-- Channel Selection Cards - Row 2 -->
			<div class="channel-cards-row">
				<channel-card
					icon="headset"
					title="Departments"
					:selected="selectedChannel === 'departments'"
					@click="selectChannel('departments')"
				/>
				<channel-card
					icon="building-2"
					title="Office Mainline"
					:selected="selectedChannel === 'office-mainline'"
					@click="selectChannel('office-mainline')"
				/>
			</div>
		</div>

		<!-- Contact Center Configuration Step -->
		<div v-else-if="currentStep === 'contact-centers'" class="modal-content">
			<contact-center-config />
		</div>

		<!-- Webchat Configuration Step -->
		<div v-else-if="currentStep === 'webchat'" class="modal-content">
			<webchat-config />
		</div>

		<!-- Departments Configuration Step -->
		<div v-else-if="currentStep === 'departments'" class="modal-content">
			<contact-center-config :is-departments="true" />
		</div>

		<!-- Publishing State -->
		<div v-else-if="currentStep === 'publishing'" class="modal-content publishing-state">
			<div class="publishing-spinner">
				<dt-icon name="loading" size="600" class="spinner-icon" />
			</div>
			<p class="publishing-text">Publishing agent...</p>
		</div>

		<!-- Success State -->
		<div v-else-if="currentStep === 'success'" class="modal-content success-state">
			<div class="success-icon-container">
				<dt-icon name="check-circle" size="600" class="success-icon" />
			</div>
			<h3 class="success-title">Agent successfully published!</h3>
			<p class="success-description">Your agent is now live and ready to handle conversations.</p>
		</div>

		<template #footer>
			<div class="modal-footer">
				<!-- Selection Step Footer -->
				<template v-if="currentStep === 'selection'">
					<dt-button importance="outlined" kind="muted" size="md">
						<template #icon>
							<dt-icon name="link-2" size="200" />
						</template>
						Share link
					</dt-button>
					<dt-button importance="primary" size="md" @click="handleDone">
						Done
					</dt-button>
				</template>

				<!-- Success Step Footer -->
				<template v-else-if="currentStep === 'success'">
					<div style="flex: 1;"></div>
					<dt-button importance="primary" size="md" @click="handleClose">
						Done
					</dt-button>
				</template>

				<!-- Configuration Step Footer -->
				<template v-else-if="currentStep !== 'publishing'">
					<dt-button importance="clear" size="md" @click="goBack">
						<template #icon>
							<dt-icon name="arrow-left" size="200" />
						</template>
						Back
					</dt-button>
					<div class="footer-right">
						<dt-button importance="outlined" kind="muted" size="md" @click="handleClose">
							Cancel
						</dt-button>
						<dt-button importance="primary" size="md" @click="handlePublish">
							Publish
							<template #iconRight>
								<dt-icon name="arrow-up" size="200" />
							</template>
						</dt-button>
					</div>
				</template>
			</div>
		</template>
	</dt-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { DtModal, DtButton, DtIcon } from '../ui';
import ChannelCard from './ChannelCard.vue';
import ContactCenterConfig from './ContactCenterConfig.vue';
import WebchatConfig from './WebchatConfig.vue';

const props = defineProps({
	isOpen: {
		type: Boolean,
		default: false
	},
	agentName: {
		type: String,
		default: ''
	}
});

const emit = defineEmits(['close', 'published']);

const selectedChannel = ref(null);
const currentStep = ref('selection'); // 'selection' | 'contact-centers' | 'webchat' | 'departments'

const modalTitle = computed(() => {
	switch (currentStep.value) {
		case 'contact-centers':
			return 'Publish agent to contact center';
		case 'webchat':
			return 'Publish agent to webchat';
		case 'departments':
			return 'Publish agent to departments';
		case 'publishing':
		case 'success':
			return ''; // No title for publishing/success states
		default:
			return 'Publish agent';
	}
});

// Reset to selection step when modal opens
watch(() => props.isOpen, (isOpen) => {
	if (isOpen) {
		currentStep.value = 'selection';
		selectedChannel.value = null;
	}
});

function selectChannel(channel) {
	selectedChannel.value = channel;

	// Office Mainline shows success toast and closes
	if (channel === 'office-mainline') {
		emit('published', {
			channel: channel,
			agentName: props.agentName
		});
		handleClose();
	} else {
		// Transition to configuration step for other channels
		currentStep.value = channel;
	}
}

function goBack() {
	currentStep.value = 'selection';
}

function handleClose() {
	emit('close');
}

function handleDone() {
	if (selectedChannel.value) {
		emit('published', {
			channel: selectedChannel.value,
			agentName: props.agentName
		});
	}
	handleClose();
}

function handlePublish() {
	// Show publishing state
	currentStep.value = 'publishing';

	// Simulate publishing delay, then show success
	setTimeout(() => {
		currentStep.value = 'success';

		// Emit published event
		emit('published', {
			channel: selectedChannel.value,
			agentName: props.agentName
		});
	}, 1500); // 1.5 second loading
}
</script>

<style scoped>
.modal-content {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.modal-description {
	color: #1c1c1c;
	font-size: 15px;
	line-height: 1.6;
	margin: 0 0 16px 0;
}

.modal-link {
	color: var(--dt-color-brand-purple);
	text-decoration: underline;
}

.channel-cards-row {
	display: flex;
	gap: 16px;
}

.modal-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

.footer-right {
	display: flex;
	gap: 12px;
}

:deep(.d-modal__content) {
	margin-bottom: 16px;
}

/* Publishing State */
.publishing-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 48px 0;
}

.publishing-spinner {
	margin-bottom: 24px;
}

.spinner-icon {
	color: var(--dt-color-brand-purple);
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.publishing-text {
	font-size: 16px;
	color: #666;
	margin: 0;
}

/* Success State */
.success-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 48px 0;
}

.success-icon-container {
	margin-bottom: 24px;
	animation: scaleIn 0.3s ease-out;
}

.success-icon {
	color: #22c55e;
}

@keyframes scaleIn {
	from {
		transform: scale(0);
	}
	to {
		transform: scale(1);
	}
}

.success-title {
	font-size: 20px;
	font-weight: 600;
	color: #1c1c1c;
	margin: 0 0 8px 0;
}

.success-description {
	font-size: 15px;
	color: #666;
	margin: 0;
	text-align: center;
}
</style>
