<template>
	<div class="webchat-config">
		<!-- Configuration -->
		<div class="config-side">
			<!-- Webchat Selection -->
			<div class="form-section">
				<label class="form-label">Webchat</label>
				<dt-select-menu
					v-model="selectedWebchat"
					:options="webchatOptions"
					placeholder="Select webchat"
				/>
			</div>

			<!-- Chatbot Main Color -->
			<div class="form-section">
				<label class="form-label">Chatbot main color</label>
				<div class="color-input">
					<div class="color-swatch" :style="{ background: mainColor }"></div>
					<dt-input
						v-model="mainColor"
						placeholder="#7C52FF"
					/>
				</div>
			</div>

			<!-- Typography -->
			<div class="form-section">
				<label class="form-label">Typography</label>
				<dt-select-menu
					v-model="selectedTypography"
					:options="typographyOptions"
					placeholder="Select typography"
				/>
			</div>

			<!-- Avatar -->
			<div class="form-section">
				<label class="form-label">Avatar</label>
				<p class="form-helper">Recommended: PNG, 300x300 px, under 1 MB.</p>
				<div class="upload-area">
					<div class="avatar-preview">
						<div class="avatar-circle">
							<dt-icon name="message-circle" size="400" style="color: white;" />
						</div>
					</div>
				</div>
			</div>

			<!-- Chat Button -->
			<div class="form-section">
				<label class="form-label">Chat button</label>
				<p class="form-helper">Website chat button image. Use PNG, 1:1 aspect ratio, under 1 MB.</p>
				<div class="upload-area">
					<div class="button-preview">
						<div class="button-circle">
							<dt-icon name="message-circle" size="300" style="color: white;" />
						</div>
					</div>
				</div>
			</div>

			<!-- Chat Button Background -->
			<div class="form-section">
				<label class="form-label">Chat button background</label>
				<p class="form-helper">Main color is used by default</p>
				<div class="color-input">
					<div class="color-swatch" :style="{ background: buttonColor }"></div>
					<dt-input
						v-model="buttonColor"
						placeholder="#7C52FF"
					/>
				</div>
			</div>

			<!-- Default Transfer -->
			<div class="form-section">
				<label class="form-label">Default transfer</label>
				<p class="form-helper">Default transfer for one or both channels to be used by this AI agent when it cannot support.</p>
				<dt-radio-group
					v-model="defaultTransfer"
					name="defaultTransfer"
				>
					<dt-radio value="agents">
						Agents
					</dt-radio>
					<dt-radio value="digital">
						Digital
					</dt-radio>
				</dt-radio-group>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { DtInput, DtSelectMenu, DtRadioGroup, DtRadio } from '../ui';

// Mock options for webchat instances
const webchatOptions = [
	{ value: 'main-website', label: 'Main Website Chat' },
	{ value: 'support-portal', label: 'Support Portal' },
	{ value: 'sales-landing', label: 'Sales Landing Pages' },
	{ value: 'product-demo', label: 'Product Demo Site' },
	{ value: 'help-center', label: 'Help Center' },
	{ value: 'mobile-app', label: 'Mobile App Chat' }
];

// Mock options for typography - web-safe and popular fonts
const typographyOptions = [
	{ value: 'system', label: 'System Default' },
	{ value: 'inter', label: 'Inter' },
	{ value: 'roboto', label: 'Roboto' },
	{ value: 'helvetica', label: 'Helvetica Neue' },
	{ value: 'segoe', label: 'Segoe UI' },
	{ value: 'open-sans', label: 'Open Sans' },
	{ value: 'lato', label: 'Lato' }
];

const selectedWebchat = ref('main-website');
const selectedTypography = ref('system');
const mainColor = ref('#7C52FF');
const buttonColor = ref('#7C52FF');
const defaultTransfer = ref('digital');
</script>

<style scoped>
.webchat-config {
	padding: 0;
}

.config-side {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.form-section {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.form-label {
	font: var(--dt-typography-label-md);
	color: var(--dt-color-foreground-primary);
}

.form-helper {
	font: var(--dt-typography-helper-sm);
	color: var(--dt-color-foreground-secondary);
	margin: 0;
}

.color-input {
	display: flex;
	align-items: center;
	gap: 12px;
}

.color-swatch {
	width: 40px;
	height: 40px;
	border-radius: 8px;
	border: 1px solid var(--dt-color-border-subtle);
	flex-shrink: 0;
}

.upload-area {
	border: 1px solid var(--dt-color-border-subtle);
	border-radius: 8px;
	padding: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: var(--dt-color-surface-secondary);
}

.avatar-preview {
	display: flex;
	justify-content: center;
}

.avatar-circle {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	background: linear-gradient(135deg, #D946A6 0%, #7C52FF 100%);
	display: flex;
	align-items: center;
	justify-content: center;
}

.button-preview {
	display: flex;
	justify-content: center;
}

.button-circle {
	width: 60px;
	height: 60px;
	border-radius: 50%;
	background: linear-gradient(135deg, #7552FF 0%, #A855F7 100%);
	display: flex;
	align-items: center;
	justify-content: center;
}

:deep(.dt-input) {
	cursor: pointer;
}

:deep(.dt-input input) {
	cursor: pointer;
}
</style>
