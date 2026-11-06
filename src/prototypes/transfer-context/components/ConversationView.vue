<template>
  <section class="conversation">
    <header class="conversation-header">
      <div class="conversation-header__contact">
        <div
          class="conversation-avatar"
          :style="avatarColor ? { background: avatarColor, color: avatarTextColor } : null"
        >
          <span v-if="initials" class="conversation-avatar__initials">{{ initials }}</span>
          <DtIcon v-else name="user" :size="20" />
        </div>
        <div class="conversation-header__text">
          <div class="conversation-header__name-row">
            <h3 class="d-headline--lg conversation-header__name">{{ name }}</h3>
            <DtIcon name="chevron-down" :size="16" />
            <button class="conversation-icon-btn conversation-icon-btn--sm" aria-label="Add to favorites">
              <DtIcon name="star" :size="16" />
            </button>
          </div>
          <p v-if="phone && phone !== name" class="d-body--sm d-fc-secondary">{{ phone }}</p>
        </div>
      </div>
      <div class="conversation-header__actions">
        <button class="conversation-icon-btn" aria-label="Search"><DtIcon name="search" :size="20" /></button>
        <button class="conversation-icon-btn" aria-label="Add people"><DtIcon name="user-plus" :size="20" /></button>
        <button class="conversation-icon-btn" aria-label="Share screen"><DtIcon name="share-screen" :size="20" /></button>
        <button class="conversation-icon-btn" aria-label="Video call"><DtIcon name="video" :size="20" /></button>
        <button class="conversation-icon-btn" aria-label="Call"><DtIcon name="phone" :size="20" /></button>
      </div>
    </header>

    <div class="conversation-feed" />

    <footer class="conversation-composer">
      <div class="composer">
        <input class="composer__input d-body--md" type="text" :placeholder="`Message ${name}`" />
        <button class="conversation-icon-btn" aria-label="Send"><DtIcon name="send" :size="16" /></button>
      </div>
    </footer>
  </section>
</template>

<script setup>
import DtIcon from '@/components/icons/DtIcon.vue'

defineProps({
  name: { type: String, required: true },
  phone: { type: String, default: '' },
  initials: { type: String, default: '' },
  avatarColor: { type: String, default: '' },
  avatarTextColor: { type: String, default: 'white' },
})
</script>

<style scoped>
.conversation {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: var(--dt-color-surface-primary);
}

.conversation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 58px;
  flex-shrink: 0;
  padding: 0 var(--dt-space-500);
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.conversation-header__contact {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  min-width: 0;
}

.conversation-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--dt-color-surface-moderate);
  color: var(--dt-color-foreground-secondary);
}

.conversation-avatar__initials {
  font: var(--dt-typography-label-sm-compact);
}

.conversation-header__name-row {
  display: flex;
  align-items: center;
  gap: var(--dt-space-200);
}

.conversation-header__name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-header__actions {
  display: flex;
  align-items: center;
  gap: var(--dt-space-200);
}

.conversation-icon-btn {
  width: var(--btn-height-icon);
  height: var(--btn-height-icon);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--dt-size-radius-400);
  color: var(--dt-color-foreground-secondary);
}

.conversation-icon-btn:hover {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-primary);
}

.conversation-icon-btn--sm {
  width: var(--btn-height-sm);
  height: var(--btn-height-sm);
}

.conversation-feed {
  flex: 1;
  min-height: 0;
}

.conversation-composer {
  flex-shrink: 0;
  padding: 0 var(--dt-space-500) var(--dt-space-500);
}

.composer {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  padding: var(--dt-space-400) var(--dt-space-400) var(--dt-space-400) var(--dt-space-450);
  border: 1px solid var(--dt-color-border-default);
  border-radius: var(--dt-size-radius-400);
}

.composer:focus-within {
  border-color: var(--dt-color-border-moderate);
}

.composer__input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
}

.composer__input::placeholder {
  color: var(--dt-color-foreground-muted);
}
</style>
