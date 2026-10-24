<template>
  <transition name="toast-slide">
    <aside v-if="show" class="d-toast-wrapper toast-wrapper">
      <dt-toast
        :show="show"
        :title="title"
        :kind="kind"
        :hide-close="false"
        @close="handleClose"
      >
        <template v-if="$slots.default" #default>
          <slot />
        </template>
        <template v-if="$slots.action" #action>
          <slot name="action" />
        </template>
      </dt-toast>
    </aside>
  </transition>
</template>

<script setup>
import { watch, onBeforeUnmount } from 'vue'
import { DtToast } from './ui'

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '' },
  kind: { type: String, default: 'success' },
  timeout: { type: Number, default: 5000 },
})

const emit = defineEmits(['update:show'])

let timer = null

function handleClose() {
  clearTimeout(timer)
  emit('update:show', false)
}

watch(() => props.show, (val) => {
  if (val && props.timeout > 0) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      emit('update:show', false)
    }, props.timeout)
  } else {
    clearTimeout(timer)
  }
})

onBeforeUnmount(() => clearTimeout(timer))
</script>

<style>
.toast-wrapper {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-100%);
}

.toast-slide-enter-to {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.toast-slide-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-100%);
}
</style>
