<template>
    <div class="editor-toolbar" :class="{ 'toolbar--has-content': hasContent }" @mousedown.prevent>
        <!-- Text formatting: Bold, Italic, Strikethrough -->
        <div class="toolbar-group">
            <button
                v-for="format in textFormats"
                :key="format.name"
                class="toolbar-button"
                :title="format.name"
                @click="emit('format', format.name)"
            >
                <dt-icon :name="format.icon" size="200" />
            </button>
        </div>

        <div class="toolbar-divider"></div>

        <!-- Link -->
        <div class="toolbar-group">
            <button class="toolbar-button" title="Insert Link" @click="emit('insert-link')">
                <dt-icon name="link-2" size="200" />
            </button>
        </div>

        <div class="toolbar-divider"></div>

        <!-- Lists -->
        <div class="toolbar-group">
            <button
                v-for="list in listFormats"
                :key="list.name"
                class="toolbar-button"
                :title="list.name"
                @click="emit('format', list.name)"
            >
                <dt-icon :name="list.icon" size="200" />
            </button>
        </div>

        <div class="toolbar-divider"></div>

        <!-- Quote + Code -->
        <div class="toolbar-group">
            <button class="toolbar-button" title="Block Quote" @click="emit('format', 'block-quote')">
                <dt-icon name="quote" size="200" />
            </button>
            <button class="toolbar-button" title="Insert Code" @click="emit('insert-code')">
                <dt-icon name="code" size="200" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { DtIcon } from '../ui';

defineProps({
    editorType: { type: String, required: true },
    hasContent: { type: Boolean, default: false },
});

const emit = defineEmits(['format', 'insert-link', 'insert-code']);

const textFormats = [
    { name: 'Bold', icon: 'bold' },
    { name: 'Italic', icon: 'italic' },
    { name: 'Strikethrough', icon: 'strikethrough' },
];

const listFormats = [
    { name: 'Bulleted List', icon: 'list-bullet' },
    { name: 'Numbered List', icon: 'list-ordered' },
];
</script>

<style scoped>
.editor-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 7px;
    background: #f9f9f9;
    border-bottom: none;
}

.toolbar-group {
    display: flex;
    align-items: center;
    gap: 4px;
}

.toolbar-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    padding: 4px;
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: #555555;
    opacity: 0.35;
    transition: opacity 0.15s ease, background 0.15s ease;
    pointer-events: none;
}

.toolbar--has-content .toolbar-button {
    opacity: 1;
    pointer-events: auto;
}

.toolbar--has-content .toolbar-button:hover {
    background: rgba(0, 0, 0, 0.05);
}

.toolbar--has-content .toolbar-button:active {
    background: rgba(0, 0, 0, 0.1);
}

.toolbar-divider {
    width: 1px;
    height: 20px;
    background: rgba(0, 0, 0, 0.25);
}
</style>
