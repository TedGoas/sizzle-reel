<template>
	<div
		class="channel-card"
		:class="{ 'channel-card--selected': selected }"
		@click="$emit('click')"
	>
		<dt-icon :name="icon" size="400" />
		<h3 class="channel-card__title">{{ title }}</h3>
	</div>
</template>

<script setup>
import { DtIcon } from '../ui';

defineProps({
	icon: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	selected: {
		type: Boolean,
		default: false
	}
});

defineEmits(['click']);
</script>

<style scoped>
.channel-card {
	background: #ffffff;
	border: 2px solid rgba(28, 28, 28, 0.17);
	border-radius: 16px;
	padding: 23px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 12px;
	flex: 1;
	cursor: pointer;
	transition: all 0.2s ease;
}

.channel-card:hover {
	border-color: rgba(28, 28, 28, 0.3);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.channel-card--selected {
	border-color: var(--dt-color-brand-purple);
	background: rgba(124, 82, 255, 0.05);
}

.channel-card__title {
	font-size: 20px;
	font-weight: 500;
	line-height: 1.2;
	margin: 0;
	color: #000000;
	text-align: center;
}
</style>
