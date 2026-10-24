<template>
	<div class="call-sources-wrapper" ref="wrapperRef">
		<!-- Custom popover portal -->
		<teleport to="body">
			<div v-if="isOpen" class="custom-popover-backdrop" @click="close"></div>
			<div v-if="isOpen" class="custom-popover" :style="popoverStyle">
				<div class="popover-content">
					<!-- Search -->
					<div class="popover-search">
						<dt-input v-model="searchTerm" placeholder="Search" size="sm">
							<template #leftIcon>
								<dt-icon name="search" size="200" />
							</template>
						</dt-input>
					</div>

					<!-- Options -->
					<div class="popover-options">
						<!-- Select all -->
						<div class="option-item" @click="toggleSelectAll">
							<dt-checkbox
								:checked="allSelected"
								:indeterminate="someSelected"
								size="sm"
							/>
							<span style="margin-left: 8px; font-weight: 500">Select all</span>
						</div>

						<!-- Sources -->
						<div
							v-for="source in filteredSources"
							:key="source.id"
							class="option-item"
							@click="toggleSource(source)"
						>
							<dt-checkbox :checked="isSelected(source)" size="sm" />
							<span style="margin-left: 8px">{{ source.name }}</span>
						</div>

						<!-- No results -->
						<div v-if="filteredSources.length === 0" class="no-results">
							No results found
						</div>
					</div>

					<!-- Footer -->
					<div class="popover-footer">
						<button class="clear-button" @click="clearSelection">Clear</button>
						<span class="selected-count">{{ tempSelectedCount }} selected</span>
						<dt-button importance="primary" size="sm" @click="applySelection">
							Apply
						</dt-button>
					</div>
				</div>
			</div>
		</teleport>
	</div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import { DtButton, DtIcon, DtInput, DtCheckbox } from '../ui';
import { callSources } from "../../config/skillsData.js";

const props = defineProps({
	modelValue: {
		type: Array,
		default: () => [],
	},
	triggerRef: {
		type: Object,
		default: null,
	},
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const searchTerm = ref("");
const tempSelected = ref([...props.modelValue]);
const wrapperRef = ref(null);
const popoverStyle = ref({});

const tempSelectedCount = computed(() => tempSelected.value.length);

const filteredSources = computed(() => {
	if (!searchTerm.value) return callSources;
	const search = searchTerm.value.toLowerCase();
	return callSources.filter((source) =>
		source.name.toLowerCase().includes(search),
	);
});

const allSelected = computed(
	() => tempSelected.value.length === callSources.length,
);
const someSelected = computed(
	() => tempSelected.value.length > 0 && !allSelected.value,
);

const isSelected = (source) => {
	return tempSelected.value.some((s) => s.id === source.id);
};

const toggleSource = (source) => {
	const index = tempSelected.value.findIndex((s) => s.id === source.id);
	if (index > -1) {
		tempSelected.value.splice(index, 1);
	} else {
		tempSelected.value.push(source);
	}
};

const toggleSelectAll = () => {
	if (allSelected.value) {
		tempSelected.value = [];
	} else {
		tempSelected.value = [...callSources];
	}
};

const clearSelection = () => {
	tempSelected.value = [];
};

const applySelection = () => {
	emit("update:modelValue", [...tempSelected.value]);
	close();
};

const open = () => {
	if (props.triggerRef?.$el) {
		const triggerElement =
			props.triggerRef.$el.querySelector("input") || props.triggerRef.$el;
		const rect = triggerElement.getBoundingClientRect();
		popoverStyle.value = {
			position: "fixed",
			top: `${rect.bottom + 4}px`,
			left: `${rect.left}px`,
			width: `${rect.width}px`,
			zIndex: 99999,
		};
	}
	isOpen.value = true;
};

const close = () => {
	isOpen.value = false;
	searchTerm.value = "";
};

// Expose methods to parent
defineExpose({
	open,
	close,
});

// Watch for external changes
import { watch } from "vue";
watch(
	() => props.modelValue,
	(newVal) => {
		if (!isOpen.value) {
			tempSelected.value = [...newVal];
		}
	},
	{ deep: true },
);

// Reset temp when opening
watch(isOpen, (open) => {
	if (open) {
		tempSelected.value = [...props.modelValue];
	}
});
</script>

<style scoped>
.call-sources-wrapper {
	width: 100%;
}

.popover-content {
	width: 360px;
	max-width: 90vw;
	background: white;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	border: 1px solid var(--dt-color-border-subtle, #e0e0e0);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.popover-search {
	padding: 12px;
	border-bottom: 1px solid #e0e0e0;
}

.popover-options {
	max-height: 280px;
	overflow-y: auto;
	padding: 8px 0;
}

.option-item {
	display: flex;
	align-items: center;
	padding: 10px 16px;
	cursor: pointer;
	transition: background-color 0.2s ease;
}

.option-item:hover {
	background-color: #f5f5f5;
}

.option-item:first-child {
	border-bottom: 1px solid #e0e0e0;
	margin-bottom: 4px;
}

.no-results {
	padding: 20px;
	text-align: center;
	color: #999;
}

.popover-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	border-top: 1px solid #e0e0e0;
	background: white;
}

.clear-button {
	background: none;
	border: none;
	color: #e53935;
	font-weight: 500;
	cursor: pointer;
	padding: 4px 8px;
	font-size: 14px;
}

.clear-button:hover {
	text-decoration: underline;
}

.selected-count {
	flex: 1;
	text-align: center;
	color: #666;
	font-size: 14px;
}

.popover-options::-webkit-scrollbar {
	width: 8px;
}

.popover-options::-webkit-scrollbar-track {
	background: transparent;
}

.popover-options::-webkit-scrollbar-thumb {
	background: #d0d0d0;
	border-radius: 4px;
}

.popover-options::-webkit-scrollbar-thumb:hover {
	background: #b0b0b0;
}

/* Custom popover backdrop */
.custom-popover-backdrop {
	position: fixed;
	inset: 0;
	z-index: 9998;
	background: transparent;
}

/* Custom popover */
.custom-popover {
	position: fixed;
	z-index: 9999;
}
</style>
