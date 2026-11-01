import { ref, computed } from 'vue'
import { debugLogger } from '../lib/debugLogger.js';

export function useCanvasEditor() {
  // State
  const isFullScreenEditor = ref(false)
  const isTransitioning = ref(false)
  const zoomLevel = ref(1)
  const panX = ref(0)
  const panY = ref(0)
  const isPanning = ref(false)
  const panStartX = ref(0)
  const panStartY = ref(0)
  const canvasContainer = ref(null)
  const fullScreenCanvas = ref(null)
  const canvasPreviewContainer = ref(null)
  const transitionStartRect = ref(null)
  const transitionEndRect = ref(null)

  // Canvas constants
  const CANVAS_TRANSITION_DURATION = 500 // ms
  const SKINNY_NAV_WIDTH = 50 // px
  const HEADER_HEIGHT = 56 // px
  const SIDEBAR_WIDTH = 300 // px
  const NODES_CENTER_X = 530 // px - horizontal center of node group
  const NODES_CENTER_Y = 250 // px - vertical center of node group

  // Canvas methods
  function zoomIn() {
    if (zoomLevel.value < 2) {
      zoomLevel.value = Math.min(2, zoomLevel.value + 0.1)
    }
  }

  function zoomOut() {
    if (zoomLevel.value > 0.5) {
      zoomLevel.value = Math.max(0.5, zoomLevel.value - 0.1)
    }
  }

  function resetZoom() {
    zoomLevel.value = 1
    panX.value = 0
    panY.value = 0
  }

  function startPan(e) {
    // Don't pan if clicking on a node
    if (e.target.closest('.canvas-node')) {
      return
    }
    isPanning.value = true
    panStartX.value = e.clientX - panX.value
    panStartY.value = e.clientY - panY.value
  }

  function handlePan(e) {
    if (!isPanning.value) return
    panX.value = e.clientX - panStartX.value
    panY.value = e.clientY - panStartY.value
  }

  function endPan() {
    isPanning.value = false
  }

  function centerNodes() {
    // Wait for next tick to ensure canvas is rendered
    setTimeout(() => {
      const canvas = fullScreenCanvas.value || canvasContainer.value
      if (!canvas) {
        debugLogger.warn('Canvas element not found for centering')
        return
      }

      try {
        const canvasWidth = canvas.offsetWidth
        const canvasHeight = canvas.offsetHeight

        // Guard against zero dimensions
        if (canvasWidth === 0 || canvasHeight === 0) {
          debugLogger.warn('Canvas has zero dimensions, cannot center nodes')
          return
        }

        // Center point of node group (calculated from node positions)
        panX.value = (canvasWidth / 2) - NODES_CENTER_X
        panY.value = (canvasHeight / 2) - NODES_CENTER_Y
      } catch (error) {
        console.error('Error centering nodes:', error)
      }
    }, 0)
  }

  function enterFullScreenEditor() {
    // Capture the current position of the canvas preview container
    const container = canvasPreviewContainer.value
    if (!container) {
      debugLogger.warn('Canvas preview container not found')
      return
    }

    try {
      const rect = container.getBoundingClientRect()
      transitionStartRect.value = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }

      // Clear any previous end rect
      transitionEndRect.value = null

      // Start transition - this applies the start position via inline styles
      isTransitioning.value = true
      isFullScreenEditor.value = true

      // Wait for next frame to ensure start position is applied
      requestAnimationFrame(() => {
        // Then set the end position to trigger CSS transition
        requestAnimationFrame(() => {
          transitionEndRect.value = {
            top: 0,
            left: SKINNY_NAV_WIDTH,
            width: window.innerWidth - SKINNY_NAV_WIDTH,
            height: window.innerHeight,
            borderRadius: '0px',
            border: 'none'
          }

          // Reset zoom and pan for full screen view
          zoomLevel.value = 1
          // Center the nodes on the canvas
          centerNodes()

          // End transition after animation completes
          setTimeout(() => {
            isTransitioning.value = false
            transitionStartRect.value = null
            transitionEndRect.value = null
          }, CANVAS_TRANSITION_DURATION)
        })
      })
    } catch (error) {
      console.error('Error entering fullscreen mode:', error)
      // Reset state on error
      isTransitioning.value = false
      isFullScreenEditor.value = false
    }
  }

  function exitFullScreenEditor() {
    // Capture current full-screen position
    const container = canvasPreviewContainer.value
    if (!container) {
      debugLogger.warn('Canvas preview container not found')
      return
    }

    try {
      const rect = container.getBoundingClientRect()
      transitionStartRect.value = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius: '0px',
        border: 'none'
      }

      // Clear any previous end rect
      transitionEndRect.value = null

      // Start transition
      isTransitioning.value = true
      isFullScreenEditor.value = false

      // Calculate where the preview should be based on actual layout
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Get the natural position where the preview container should be
          const agentDetailContainer = document.querySelector('.agent-detail-container')
          if (agentDetailContainer) {
            const parentRect = agentDetailContainer.getBoundingClientRect()
            transitionEndRect.value = {
              top: parentRect.top + HEADER_HEIGHT,
              left: parentRect.left + SIDEBAR_WIDTH,
              width: parentRect.width - SIDEBAR_WIDTH,
              height: parentRect.height - HEADER_HEIGHT,
              borderRadius: '8px',
              border: '1px solid #e0e0e0'
            }
          } else {
            debugLogger.warn('Agent detail container not found for exit transition')
          }

          // Reset zoom and pan when exiting
          zoomLevel.value = 1
          panX.value = 0
          panY.value = 0

          // End transition after animation completes
          setTimeout(() => {
            isTransitioning.value = false
            transitionStartRect.value = null
            transitionEndRect.value = null
          }, CANVAS_TRANSITION_DURATION)
        })
      })
    } catch (error) {
      console.error('Error exiting fullscreen mode:', error)
      // Reset state on error
      isTransitioning.value = false
      isFullScreenEditor.value = false
    }
  }

  // Computed property for canvas transition styles
  const canvasTransitionStyles = computed(() => {
    if (!isTransitioning.value) {
      return {}
    }

    // Use end rect if available (after animation starts), otherwise use start rect
    const rect = transitionEndRect.value || transitionStartRect.value
    if (!rect) return {}

    return {
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      borderRadius: rect.borderRadius || '0px',
      border: rect.border || 'none',
      right: 'auto',
      bottom: 'auto',
      zIndex: 1000
    }
  })

  // Computed property for canvas content transform (pan and zoom)
  const canvasTransformStyles = computed(() => {
    return {
      transform: `translate(${panX.value}px, ${panY.value}px) scale(${zoomLevel.value})`,
      transformOrigin: 'center center'
    }
  })

  return {
    // State
    isFullScreenEditor,
    isTransitioning,
    zoomLevel,
    panX,
    panY,
    isPanning,
    canvasContainer,
    fullScreenCanvas,
    canvasPreviewContainer,

    // Computed
    canvasTransitionStyles,
    canvasTransformStyles,

    // Methods
    zoomIn,
    zoomOut,
    resetZoom,
    startPan,
    handlePan,
    endPan,
    enterFullScreenEditor,
    exitFullScreenEditor,
    centerNodes
  }
}
