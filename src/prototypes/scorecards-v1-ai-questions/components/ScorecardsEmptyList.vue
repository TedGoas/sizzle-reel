<template>
  <div class="scorecards-list">
    <div class="scorecards-list-header">
      <div class="scorecards-list-header-left">
        <div class="scorecards-list-title-row">
          <h1 class="scorecards-list-title">QA Scorecards</h1>
          <span class="beta-badge">Beta</span>
        </div>
        <p class="scorecards-list-desc">
          QA Scorecards are grading rubrics for quality assurance. Create scorecards to score calls based on your own criteria.
        </p>
      </div>
      <button type="button" class="create-scorecard-btn">
        Create scorecard
      </button>
    </div>

    <div class="scorecards-tabs-row">
      <div class="scorecards-tabs" role="tablist">
        <button type="button" class="scorecards-tab scorecards-tab--active" role="tab" aria-selected="true">
          Published
        </button>
        <button type="button" class="scorecards-tab" role="tab" aria-selected="false">
          Drafts
        </button>
        <button type="button" class="scorecards-tab" role="tab" aria-selected="false">
          Archived
        </button>
      </div>
      <button type="button" class="d-link tabs-help">What are these?</button>
    </div>

    <div class="scorecards-empty">
      <p class="scorecards-empty-copy">
        There aren’t any published scorecards. When there is one, it will appear here.
      </p>
      <button type="button" class="d-link scorecards-empty-link">
        Learn about QA scorecards
      </button>
      <button
        type="button"
        class="create-scorecard-btn"
        data-autoplay="create-cta"
      >
        Create scorecard
      </button>
    </div>
  </div>
</template>

<style scoped>
.scorecards-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: var(--dt-space-550) var(--dt-space-600);
}

.scorecards-list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--dt-space-500);
}

.scorecards-list-header-left {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
  min-width: 0;
}

.scorecards-list-title-row {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
}

.scorecards-list-title {
  margin: 0;
  font: var(--dt-typography-headline-xl);
  color: var(--dt-color-foreground-primary);
}

.beta-badge {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 var(--dt-space-400);
  border-radius: var(--dt-space-300);
  background: var(--dt-color-surface-brand-subtle);
  color: var(--dt-color-link-primary);
  font: var(--dt-typography-label-sm-compact);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.scorecards-list-desc {
  margin: 0;
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-secondary);
  max-width: 52rem;
}

.create-scorecard-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--btn-height-md);
  padding: 0 var(--dt-space-500);
  border: none;
  border-radius: var(--dt-space-400);
  background: var(--dt-color-link-primary);
  color: var(--dt-color-surface-primary);
  font: var(--dt-typography-label-md-compact);
  cursor: default;
  flex-shrink: 0;
  transition: transform 0.12s ease, filter 0.12s ease, background 0.15s ease;
}

.create-scorecard-btn:hover {
  background: var(--dt-color-link-primary-hover);
}

.scorecards-tabs-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--dt-space-500);
  margin-top: var(--dt-space-550);
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.scorecards-tabs {
  display: flex;
  gap: var(--dt-space-500);
}

.scorecards-tab {
  height: var(--btn-height-md);
  padding: 0 var(--dt-space-200);
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  background: none;
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-tertiary);
  cursor: default;
}

.scorecards-tab--active {
  color: var(--dt-color-foreground-primary);
  font-weight: 600;
  border-bottom-color: var(--dt-color-link-primary);
}

.tabs-help {
  flex-shrink: 0;
}

.scorecards-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--dt-space-450);
  flex: 1;
  text-align: center;
  padding: var(--dt-space-600) var(--dt-space-500);
}

.scorecards-empty-copy {
  margin: 0;
  max-width: 36rem;
  font: var(--dt-typography-body-md);
  color: var(--dt-color-foreground-secondary);
}

.scorecards-empty-link {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
}
</style>
