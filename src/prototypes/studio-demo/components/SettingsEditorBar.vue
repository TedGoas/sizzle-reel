<template>
  <div class="toolbar" aria-hidden="true">
    <span class="style">
      Normal
      <svg viewBox="0 0 14 14"><path d="M4.2 5.4 7 3.2l2.8 2.2M4.2 8.6 7 10.8l2.8-2.2" /></svg>
    </span>
    <span class="divider" />
    <span class="group">
      <span class="tool" title="Bold"><strong>B</strong></span>
      <span class="tool" title="Italic"><em>I</em></span>
      <span class="tool" title="Strikethrough">
        <svg viewBox="0 0 18 18"><path d="M4 9h10M6.2 6.4c.3-1.2 1.4-2 2.9-2 1.7 0 2.8.8 2.8 2.1 0 .5-.2.9-.6 1.2M6.7 11.7c.4 1.1 1.5 1.9 3 1.9 1.8 0 3-.9 3-2.2" /></svg>
      </span>
    </span>
    <span class="divider" />
    <span class="tool" title="Insert link">
      <svg viewBox="0 0 18 18"><path d="M7.4 10.2a3 3 0 0 0 4.5.3l1.6-1.6a3 3 0 0 0-4.2-4.2L8 5.9" /><path d="M10.6 7.8a3 3 0 0 0-4.5-.3L4.5 9.1a3 3 0 0 0 4.2 4.2l1.2-1.1" /></svg>
    </span>
    <span class="divider" />
    <span class="group">
      <span class="tool" title="Bulleted list">
        <svg viewBox="0 0 18 18"><circle cx="4" cy="5" r="1" /><circle cx="4" cy="9" r="1" /><circle cx="4" cy="13" r="1" /><path d="M7 5h8M7 9h8M7 13h8" /></svg>
      </span>
      <span class="tool" title="Numbered list">
        <svg viewBox="0 0 18 18"><path d="M3.2 4.2h1.6M4 4.2V7M3.2 9.4h1.8L3.2 12h2M7 5h8M7 9h8M7 13h8" /></svg>
      </span>
    </span>
    <template v-if="slash">
      <span class="divider" />
      <span class="tool slash" title="Slash command">/</span>
    </template>
  </div>
</template>

<script setup>
defineProps({
  slash: { type: Boolean, default: false },
})
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 7px;
  background: #f9f9f9;
  color: #1c1c1c;
  opacity: 0.5;
}

.style,
.group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.style {
  width: 80px;
  padding: 4px 8px;
  color: #1c1c1c;
  font-size: 12px;
  line-height: 1.2;
}

.style svg,
.tool svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.style svg {
  margin-left: auto;
}

.tool {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 650;
}

.slash {
  font-size: 16px;
  font-style: italic;
  font-weight: 500;
}

.divider {
  width: 1px;
  height: 20px;
  background: #dfdee5;
}

circle {
  fill: currentColor;
  stroke: none;
}
</style>
