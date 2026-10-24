<template>
	<transition name="drawer">
		<div v-if="visible && opportunity" class="drawer-container">
			<div class="drawer-content">
				<!-- Drawer Header -->
				<div
					style="
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding-left: var(--dt-size-550);
						padding-right: var(--dt-size-550);
						padding-top: var(--dt-size-450);
						padding-bottom: var(--dt-size-450);
						border-bottom: 1px solid var(--dt-color-border-subtle);
					"
				>
					<h2 class="drawer-header">{{ opportunity.name }}</h2>
					<dt-button importance="clear" kind="muted" @click="$emit('close')">
						<dt-icon name="close" size="300" />
					</dt-button>
				</div>

				<!-- Drawer Body -->
				<div class="drawer-body">
					<skill-opportunity-detail
						:opportunity="opportunity"
						section-title="Calls this skill could handle"
					/>
				</div>

				<!-- Drawer Footer -->
				<div class="drawer-footer">
					<dt-button importance="primary" @click="createSkill"
						>Create skill</dt-button
					>
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup>
import { DtIcon, DtButton } from '../ui';
import SkillOpportunityDetail from "../skills/SkillOpportunityDetail.vue";

const props = defineProps({
	visible: {
		type: Boolean,
		required: true,
	},
	opportunity: {
		type: Object,
		default: null,
	},
});

const emit = defineEmits(["close", "create-skill"]);

const createSkill = () => {
	emit("create-skill", props.opportunity);
};
</script>

<style scoped>
.drawer-container {
	position: fixed;
	top: 56px;
	right: 0;
	bottom: 0;
	width: 480px;
	z-index: 1000;
}

.drawer-content {
	width: 100%;
	background: white;
	box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	height: 100%;
	border-left: 1px solid #e0e0e0;
}

.drawer-header {
	font: var(--dt-typography-headline-md);
	color: var(--dt-color-foreground-primary);
}

.drawer-title {
	font-size: 18px;
	font-weight: 600;
	margin: 0;
	flex: 1;
}

.close-button {
	background: none;
	border: none;
	cursor: pointer;
	padding: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	transition: background 0.2s ease;
}

.close-button:hover {
	background: #f0f0f0;
}

.drawer-body {
	padding: var(--dt-size-550);
	overflow-y: auto;
	flex: 1;
}

.drawer-footer {
	padding: 16px 24px;
	border-top: 1px solid #e0e0e0;
	display: flex;
	justify-content: flex-end;
}

/* Drawer Animations */
.drawer-enter-active,
.drawer-leave-active {
	transition: all 0.3s ease;
}

.drawer-enter-active .drawer-content {
	animation: slideInRight 0.3s ease;
}

.drawer-leave-active .drawer-content {
	animation: slideOutRight 0.3s ease;
}

@keyframes slideInRight {
	from {
		transform: translateX(100%);
	}
	to {
		transform: translateX(0);
	}
}

@keyframes slideOutRight {
	from {
		transform: translateX(0);
	}
	to {
		transform: translateX(100%);
	}
}
</style>
