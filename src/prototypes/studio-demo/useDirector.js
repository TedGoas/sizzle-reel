import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { duration, cursorKeys, sceneSwitchAt, skillAppearAt, shimmerMs, enterMs } from './script.js'

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

// Hotspots are the pixel the cursor "points" with, inside each svg.
const ARROW_HOT = { x: 5, y: 3 }
const POINTER_HOT = { x: 7.7, y: 1.2 }

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
  const pointerCursor = ref(false)
  const phase = ref('edit')
  const revealedCount = ref(0)
  const shimmering = ref([false, false, false])
  const entering = ref([false, false, false])

  let raf = 0
  let lastTs = null
  let epoch = 0
  let retryQueued = false

  function aimFor(key) {
    const stage = stageRef.value
    if (!stage) return null
    const origin = stage.getBoundingClientRect()
    if (key.selector) {
      const el = stage.querySelector(key.selector)
      if (!el) return null
      const box = el.getBoundingClientRect()
      return {
        x: box.left + box.width / 2 - origin.left,
        y: box.top + box.height / 2 - origin.top,
      }
    }
    return {
      x: key.nx * origin.width + ARROW_HOT.x,
      y: key.ny * origin.height + ARROW_HOT.y,
    }
  }

  function coversButton(x, y) {
    const stage = stageRef.value
    if (!stage) return false
    const origin = stage.getBoundingClientRect()
    const targets = stage.querySelectorAll('[data-autoplay^="chip-"], [data-autoplay="send"]')
    for (const el of targets) {
      if (el.closest('.is-hidden, .is-gone')) continue
      const box = el.getBoundingClientRect()
      if (box.width < 1 || box.height < 1) continue
      const left = box.left - origin.left
      const top = box.top - origin.top
      if (x >= left && x <= left + box.width && y >= top && y <= top + box.height) return true
    }
    return false
  }

  function place(x, y) {
    const pointing = coversButton(x, y)
    pointerCursor.value = pointing
    const hot = pointing ? POINTER_HOT : ARROW_HOT
    cursorX.value = x - hot.x
    cursorY.value = y - hot.y
  }

  function apply(t, isRetry = false) {
    scene.value = t >= sceneSwitchAt ? 'creation' : 'list'

    let index = 0
    while (index < cursorKeys.length - 1 && cursorKeys[index + 1].t <= t) index += 1
    const from = cursorKeys[index]
    let committed = null
    let nextPhase = 'edit'
    for (let i = 0; i <= index; i += 1) {
      if (Number.isInteger(cursorKeys[i].commit)) committed = cursorKeys[i].commit
      if (cursorKeys[i].phase) nextPhase = cursorKeys[i].phase
    }
    inputIndex.value = committed
    phase.value = nextPhase
    const onCanvas = nextPhase === 'canvas'
    revealedCount.value = onCanvas ? skillAppearAt.filter((t0) => t >= t0).length : 0
    shimmering.value = skillAppearAt.map((t0) => onCanvas && t >= t0 && t < t0 + shimmerMs)
    entering.value = skillAppearAt.map((t0) => onCanvas && t >= t0 && t < t0 + enterMs)
    clicking.value = Boolean(from.press)
    const stage = stageRef.value
    stage?.querySelectorAll('.is-pressed').forEach((el) => {
      if (el.getAttribute('data-autoplay') !== from.press) el.classList.remove('is-pressed')
    })
    if (from.press) stage?.querySelector(`[data-autoplay="${from.press}"]`)?.classList.add('is-pressed')
    const to = cursorKeys[Math.min(index + 1, cursorKeys.length - 1)]
    previewIndex.value = Number.isInteger(from.preview) ? from.preview : null
    const start = aimFor(from)
    const end = aimFor(to)
    if (!start) {
      if (!isRetry && from.selector) scheduleRetry()
      return
    }
    if (!end || from === to || t <= from.t) {
      place(start.x, start.y)
      return
    }
    const progress = easeOutCubic(clamp((t - from.t) / (to.t - from.t), 0, 1))
    place(
      start.x + (end.x - start.x) * progress,
      start.y + (end.y - start.y) * progress,
    )
  }

  function scheduleRetry() {
    if (retryQueued) return
    retryQueued = true
    nextTick(() => {
      retryQueued = false
      apply(time.value, true)
    })
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
    pointerCursor,
    phase,
    revealedCount,
    shimmering,
    entering,
    toggle,
    seekBy,
  }
}
