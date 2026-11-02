<template>
  <div class="toolbar" aria-hidden="true">
    <span class="group">
      <button type="button" title="Bold"><strong>B</strong></button>
      <button type="button" title="Italic"><em>I</em></button>
      <button type="button" title="Underline"><span class="under">U</span></button>
    </span>
    <span class="divider" />
    <span class="group">
      <button type="button" title="Align left">
        <svg viewBox="0 0 12 12"><path d="M1.5 2.5h9M1.5 6h6M1.5 9.5h9" /></svg>
      </button>
    </span>
    <span class="divider" />
    <span class="group">
      <button type="button" title="Bulleted list">
        <svg viewBox="0 0 12 12"><circle cx="2" cy="3" r="0.8" /><circle cx="2" cy="6" r="0.8" /><circle cx="2" cy="9" r="0.8" /><path d="M4 3h6.5M4 6h6.5M4 9h6.5" /></svg>
      </button>
      <button type="button" title="Numbered list">
        <svg viewBox="0 0 12 12"><path d="M1.4 2.2h1.2M2 2.2v2.2M1.4 6.2h1.4l-1.4 2h1.6M4 3h6.5M4 6h6.5M4 9h6.5" /></svg>
      </button>
    </span>
    <span class="divider" />
    <span class="group">
      <button type="button" title="Insert link">
        <svg viewBox="0 0 12 12"><path d="M5 6.5a2.2 2.2 0 0 0 3.3.2l1.2-1.2a2.2 2.2 0 0 0-3.1-3.1L5.6 3.2" /><path d="M7 5.5a2.2 2.2 0 0 0-3.3-.2L2.5 6.5a2.2 2.2 0 0 0 3.1 3.1l.8-.8" /></svg>
      </button>
      <button type="button" title="Insert code">
        <svg viewBox="0 0 12 12"><path d="M4.2 3.2 1.8 6l2.4 2.8M7.8 3.2 10.2 6 7.8 8.8" /></svg>
      </button>
    </span>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 7px;
  background: #f9f9f9;
  border-bottom: 1px solid rgba(28, 28, 28, 0.1);
}

.group {
  display: flex;
  align-items: center;
  gap: 4px;
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border-radius: 4px;
  color: #555;
  font-size: 13px;
  font-weight: 650;
  opacity: 0.55;
  cursor: default;
}

button:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.05);
}

.under {
  text-decoration: underline;
}

svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.divider {
  width: 1px;
  height: 20px;
  background: rgba(0, 0, 0, 0.25);
}
</style>
