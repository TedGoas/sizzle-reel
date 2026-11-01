import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { duration, cursorKeys, sceneSwitchAt } from './script.js'

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

export function useDirector(stageRef) {
  const time = ref(0)
  const playing = ref(false)
  const ready = ref(false)
  const scene = ref('list')
  const cursorX = ref(0)
  const cursorY = ref(0)
  const clicking = ref(false)
  const previewIndex = ref(null)
  const inputIndex = ref(null)

  let raf = 0
  let lastTs = null
  let epoch = 0

  function pointFor(key) {
    const stage = stageRef.value
    if (!stage) return null
    const origin = stage.getBoundingClientRect()
    if (key.selector) {
      const el = stage.querySelector(key.selector)
      if (!el) return null
      const box = el.getBoundingClientRect()
      return {
        x: box.left + box.width / 2 - origin.left - 5,
        y: box.top + box.height / 2 - origin.top - 3,
      }
    }
    return {
      x: key.nx * origin.width,
      y: key.ny * origin.height,
    }
  }

  function apply(t) {
    scene.value = t >= sceneSwitchAt ? 'creation' : 'list'

    let index = 0
    while (index < cursorKeys.length - 1 && cursorKeys[index + 1].t <= t) index += 1
    const from = cursorKeys[index]
    let committed = null
    for (let i = 0; i <= index; i += 1) {
      if (Number.isInteger(cursorKeys[i].commit)) committed = cursorKeys[i].commit
    }
    inputIndex.value = committed
    clicking.value = Boolean(from.press)
    const stage = stageRef.value
    stage?.querySelectorAll('.is-pressed').forEach((el) => {
      if (el.getAttribute('data-autoplay') !== from.press) el.classList.remove('is-pressed')
    })
    if (from.press) stage?.querySelector(`[data-autoplay="${from.press}"]`)?.classList.add('is-pressed')
    const to = cursorKeys[Math.min(index + 1, cursorKeys.length - 1)]
    previewIndex.value = Number.isInteger(from.preview) ? from.preview : null
    const start = pointFor(from)
    const end = pointFor(to)
    if (!start) return
    if (!end || from === to || t <= from.t) {
      cursorX.value = start.x
      cursorY.value = start.y
      return
    }
    const progress = easeOutCubic(clamp((t - from.t) / (to.t - from.t), 0, 1))
    cursorX.value = start.x + (end.x - start.x) * progress
    cursorY.value = start.y + (end.y - start.y) * progress
  }

  function frame(token) {
    return (ts) => {
      if (token !== epoch || !playing.value) return
      if (lastTs == null) lastTs = ts
      const next = time.value + (ts - lastTs)
      if (token !== epoch) return
      lastTs = ts
      if (next >= duration) {
        time.value = duration
        playing.value = false
        apply(duration)
        return
      }
      time.value = next
      apply(time.value)
      raf = requestAnimationFrame(frame(token))
    }
  }

  function play() {
    epoch += 1
    const token = epoch
    if (time.value >= duration) time.value = 0
    playing.value = true
    lastTs = null
    cancelAnimationFrame(raf)
    apply(time.value)
    raf = requestAnimationFrame(frame(token))
  }

  function pause() {
    epoch += 1
    playing.value = false
    cancelAnimationFrame(raf)
    lastTs = null
  }

  function toggle() {
    if (playing.value) pause()
    else play()
  }

  function seekBy(ms) {
    epoch += 1
    const token = epoch
    time.value = clamp(time.value + ms, 0, duration)
    if (time.value >= duration) playing.value = false
    lastTs = null
    cancelAnimationFrame(raf)
    apply(time.value)
    if (playing.value) raf = requestAnimationFrame(frame(token))
  }

  function onResize() {
    apply(time.value)
  }

  onMounted(async () => {
    await nextTick()
    apply(0)
    ready.value = true
    play()
    window.addEventListener('resize', onResize)
  })

  onUnmounted(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', onResize)
  })

  return {
    time,
    playing,
    ready,
    scene,
    cursorX,
    cursorY,
    clicking,
    previewIndex,
    inputIndex,
    toggle,
    seekBy,
  }
}
