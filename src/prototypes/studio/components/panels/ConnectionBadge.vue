<template>
	<span class="connection-badge" :class="[typeClass]">
		<span class="badge-icon">
			<component :is="iconComponent" v-if="iconComponent" />
			<dt-icon v-else :name="iconName" size="100" />
		</span>
		<span class="badge-label">{{ label }}</span>
	</span>
</template>

<script setup>
import { computed } from "vue";
import { DtIcon } from '../ui';

const props = defineProps({
	type: {
		type: String,
		required: true,
		// 'google-calendar', 'workflow', 'sms', 'email', etc.
	},
	label: {
		type: String,
		required: true,
	},
	iconName: {
		type: String,
		default: "circle",
	},
});

const typeClass = computed(() => {
	return `badge-${props.type}`;
});

// Custom icon component for special cases like Google Calendar
const iconComponent = computed(() => {
	if (props.type === "google-calendar") {
		return GoogleCalendarIcon;
	}
	if (props.type === "sms" || props.type === "email") {
		return GradientIcon;
	}
	return null;
});

// Google Calendar Icon Component
const GoogleCalendarIcon = {
	template: `
		<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="12" height="12" rx="1" fill="white"/>
			<circle cx="6" cy="6" r="2.63" fill="white" stroke="white" stroke-width="0.5"/>
			<rect x="7.42" y="7.43" width="2.58" height="2.57" fill="#EA4335"/>
			<rect y="7.43" width="2.61" height="2.57" fill="#188038"/>
			<rect x="7.42" width="2.58" height="2.59" fill="#1967D2"/>
			<rect x="7.63" y="2.37" width="2.37" height="5.26" fill="#FBBC04"/>
			<rect x="2.37" y="7.63" width="5.26" height="2.37" fill="#34A853"/>
			<rect width="7.63" height="7.63" fill="#4285F4"/>
			<path d="M3.04 3.45h3.7v3.2h-3.7z" fill="#4285F4"/>
		</svg>
	`,
};

// Gradient Icon (for SMS/Email - Instagram gradient)
const GradientIcon = {
	template: `
		<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="instagramGradient" x1="0%" y1="100%" x2="100%" y2="0%">
					<stop offset="0%" style="stop-color:#471571;stop-opacity:1" />
					<stop offset="14%" style="stop-color:#7C229E;stop-opacity:1" />
					<stop offset="35%" style="stop-color:#B02290;stop-opacity:1" />
					<stop offset="60%" style="stop-color:#E92F6F;stop-opacity:1" />
					<stop offset="90%" style="stop-color:#FB7328;stop-opacity:1" />
					<stop offset="100%" style="stop-color:#F3960F;stop-opacity:1" />
				</linearGradient>
			</defs>
			<rect x="1.8" y="1.2" width="8.4" height="9.6" rx="2" fill="url(#instagramGradient)"/>
		</svg>
	`,
};
</script>

<style scoped>
.connection-badge {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 2px 4px 2px 2px;
	background: rgba(28, 28, 28, 0.1);
	border-radius: 4px;
	vertical-align: middle;
	cursor: pointer;
	transition: background 0.15s ease;
}

.connection-badge:hover {
	background: rgba(28, 28, 28, 0.15);
}

.badge-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 12px;
	height: 12px;
}

.badge-label {
	color: #1c1c1c;
	font-size: 12px;
	font-family: "SF Mono", "Courier New", monospace;
	font-weight: 400;
	line-height: 14.4px;
}

/* Badge type variants */
.badge-action {
	background: rgba(28, 28, 28, 0.1);
}

.badge-workflow {
	background: rgba(124, 82, 255, 0.1);
}

.badge-workflow .badge-label {
	color: #7c52ff;
}

.badge-transfer {
	background: rgba(0, 109, 210, 0.1);
}

.badge-transfer .badge-label {
	color: #006dd2;
}
</style>
