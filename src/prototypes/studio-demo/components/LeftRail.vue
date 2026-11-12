<template>
  <aside class="left-rail">
    <div class="left-rail-top">
      <div class="left-rail-logo">
        <svg :width="30" :height="30" viewBox="0 0 24 24" aria-label="Dialpad" role="img">
          <path d="M20.4.006H3.6a3.6 3.6 0 0 0-3.6 3.6v16.8a3.6 3.6 0 0 0 3.6 3.6h16.8a3.6 3.6 0 0 0 3.6-3.6v-16.8a3.6 3.6 0 0 0-3.6-3.6Z" fill="#10022C" />
          <path d="M20.4.006H3.6a3.6 3.6 0 0 0-3.6 3.6v16.8a3.6 3.6 0 0 0 3.6 3.6h16.8a3.6 3.6 0 0 0 3.6-3.6v-16.8a3.6 3.6 0 0 0-3.6-3.6Z" :fill="`url(#${gradientId})`" />
          <path d="M12.788 7.473c.127-.057.1-.276-.035-.306-2.02-.448-3.592-2.236-3.93-4.479-.021-.148-.284-.184-.338-.044-.87 2.68-2.752 4.777-5.256 5.8-.122.057-.097.26.034.292 1.972.474 3.503 2.23 3.846 4.429.023.145.263.178.318.042 1.003-2.804 2.922-4.91 5.361-5.734Z" fill="#F8F7F6" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M15.135 20.706c-2.583 0-4.438-2.068-4.438-4.898 0-2.83 1.855-4.88 4.438-4.88 1.2 0 2.346.599 2.855 1.379V7.264h2.11v13.26h-2.11V19.31c-.509.78-1.655 1.397-2.855 1.397Zm.345-1.832c1.364 0 2.383-1.052 2.51-2.485V15.19c-.127-1.433-1.146-2.43-2.51-2.43-1.527 0-2.619 1.215-2.619 3.029 0 1.814 1.091 3.084 2.62 3.084Z" fill="#F8F7F6" />
          <defs>
            <linearGradient :id="gradientId" x1="-3.75" y1="-5.169" x2="24.75" y2="24.006" gradientUnits="userSpaceOnUse">
              <stop offset=".06" stop-color="#10022C" />
              <stop offset=".2" stop-color="#611F93" />
              <stop offset=".29" stop-color="#8223A1" />
              <stop offset=".366" stop-color="#9325A5" />
              <stop offset=".459" stop-color="#C52599" stop-opacity=".9" />
              <stop offset=".564" stop-color="#D52C86" />
              <stop offset=".658" stop-color="#EA2F6F" />
              <stop offset=".737" stop-color="#F64850" />
              <stop offset=".896" stop-color="#FD6D2D" />
              <stop offset=".955" stop-color="#FF9E0E" stop-opacity=".95" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="left-rail-icons">
        <span v-for="name in topIcons" :key="name" class="rail-btn" :class="{ 'rail-btn--active': name === 'settings' }">
          <Icon :name="name" :size="20" />
        </span>
      </div>
    </div>
    <div class="left-rail-bottom">
      <span class="rail-btn">
        <Icon name="help-circle" :size="20" />
      </span>
      <img class="rail-avatar" src="https://i.pravatar.cc/32?img=49" alt="" width="32" height="32" />
    </div>
  </aside>
</template>

<script setup>
import { useId } from 'vue'
import Icon from './Icon.vue'

const gradientId = `studio-demo-logo-${useId().replace(/:/g, '')}`
const topIcons = ['rocket', 'user', 'settings', 'coaching-hub', 'activity', 'history', 'trending-up']
</script>

<style scoped>
.left-rail {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50px;
  height: 100%;
  padding: 16px 8px;
  background: #f9f9f9;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  box-sizing: border-box;
}

.left-rail-top,
.left-rail-bottom,
.left-rail-icons {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.left-rail-top,
.left-rail-bottom {
  gap: 16px;
}

.left-rail-icons {
  gap: 12px;
}

.left-rail-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
}

.rail-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #3a3a3a;
}

.rail-btn--active {
  background: rgba(28, 28, 28, 0.08);
}

.rail-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
