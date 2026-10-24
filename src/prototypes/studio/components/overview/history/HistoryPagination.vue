<template>
	<div class="history-pagination">
		<dt-pagination
			:model-value="currentPage"
			:total-pages="totalPages"
			aria-label="History pagination"
			prev-aria-label="Previous page"
			next-aria-label="Next page"
			:page-number-aria-label="(page) => `Page ${page}`"
			@update:model-value="handlePageChange"
		/>
	</div>
</template>

<script setup>
import { DtPagination } from '../../ui';

const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    },
    totalItems: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['update:current-page']);

function handlePageChange (newPage) {
    emit('update:current-page', newPage);
}
</script>

<style scoped>
.history-pagination {
	display: flex;
	justify-content: flex-end;
	padding: var(--dt-space-500, 16px) var(--dt-space-500, 16px);
}
</style>
