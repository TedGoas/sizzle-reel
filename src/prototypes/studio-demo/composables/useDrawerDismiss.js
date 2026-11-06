import { onMounted, onUnmounted } from 'vue'

// Shared drawer behavior: focus the panel when it opens (without scrolling the page)
// and close it on Escape.
export function useDrawerDismiss(rootRef, close) {
  function onKeydown(event) {
    if (event.key === 'Escape') close()
  }

  onMounted(() => {
    rootRef.value?.focus({ preventScroll: true })
    window.addEventListener('keydown', onKeydown)
  })

  onUnmounted(() => window.removeEventListener('keydown', onKeydown))
}
