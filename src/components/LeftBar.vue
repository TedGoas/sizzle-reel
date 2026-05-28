<template>
  <aside class="left-bar">
    <div class="left-bar-top">
      <div class="left-bar-logo">
        <DialpadLogo :size="32" />
      </div>
      <div class="left-bar-icons">
        <button
          v-for="item in topItems"
          :key="item.name"
          class="left-bar-icon-btn"
          :class="{ 'left-bar-icon-btn--active': item.name === activeItem }"
          @click="$emit('icon-click', item.name)"
        >
          <DtIcon :name="item.name" :size="24" />
        </button>
      </div>
    </div>
    <div class="left-bar-bottom">
      <div class="left-bar-icons">
        <button
          v-for="item in bottomItems"
          :key="item.name"
          class="left-bar-icon-btn"
          :class="{ 'left-bar-icon-btn--active': item.name === activeItem }"
        >
          <DtIcon :name="item.name" :size="24" />
        </button>
      </div>
      <div class="left-bar-avatar">
        <img src="https://i.pravatar.cc/32?img=49" alt="User avatar" width="32" height="32" />
      </div>
    </div>
  </aside>
</template>

<script setup>
import DtIcon from './icons/DtIcon.vue'
import DialpadLogo from './DialpadLogo.vue'

defineProps({
  activeItem: {
    type: String,
    default: '',
  },
})

const topItems = [
  { name: 'rocket' },
  { name: 'user' },
  { name: 'settings' },
  { name: 'coaching-hub' },
  { name: 'activity' },
  { name: 'history' },
  { name: 'trending-up' },
]

const bottomItems = [
  { name: 'help-circle' },
]
</script>

<style scoped>
.left-bar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50px;
  height: 100vh;
  padding: 16px 8px;
  background: #F9F9F9;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.left-bar-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.left-bar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: #3A3A3A;
}

.left-bar-icons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.left-bar-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: none;
  color: #3A3A3A;
  cursor: pointer;
  padding: 0;
}

.left-bar-icon-btn:hover {
  background: rgba(28, 28, 28, 0.05);
}

.left-bar-icon-btn--active {
  background: rgba(28, 28, 28, 0.08);
}

.left-bar-icon-btn--active:hover {
  background: rgba(28, 28, 28, 0.12);
}

.left-bar-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.left-bar-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.left-bar-avatar img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
