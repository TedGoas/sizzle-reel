import { computed, ref } from 'vue'

const actionItems = [
  { id: 'gcal-create', label: 'Create event', source: 'google-calendar' },
  { id: 'gcal-cancel', label: 'Cancel event', source: 'google-calendar' },
  { id: 'gcal-delete', label: 'Delete event', source: 'google-calendar' },
  { id: 'gcal-list', label: 'List events', source: 'google-calendar' },
  { id: 'o365-cancel', label: 'Cancel events', source: 'google-calendar' },
  { id: 'o365-create', label: 'Create events', source: 'google-calendar' },
  { id: 'o365-list', label: 'List events', source: 'google-calendar' },
  { id: 'dp-sms', label: 'Send SMS', source: 'message' },
  { id: 'dp-email', label: 'Send email', source: 'mail' },
  { id: 'dp-calendar', label: 'Create calendar event', source: 'google-calendar' },
  { id: 'dp-video', label: 'Join video call', source: 'zoom' },
]

const transferSubmenu = {
  digital: [
    { id: 'agents', label: 'Agents', needsPanel: false },
    { id: 'contact-center', label: 'Contact Center', needsPanel: true },
    { id: 'team-member-d', label: 'Team Member', needsPanel: true },
  ],
  voice: [
    { id: 'voicemail', label: 'Voicemail', needsPanel: false },
    { id: 'operators', label: 'Operators', needsPanel: false },
    { id: 'groups', label: 'Groups', needsPanel: false },
    { id: 'team-member-v', label: 'Team Member', needsPanel: false },
    { id: 'room-phone', label: 'Room Phone', needsPanel: false },
  ],
}

const workflowSubmenu = {
  digital: [
    { id: 'wf-account-cancel', label: 'Account cancellations' },
    { id: 'wf-change-prefs', label: 'Change preferences' },
    { id: 'wf-update-settings', label: 'Update settings' },
    { id: 'wf-renewals', label: 'Manage renewals' },
  ],
  voice: [
    { id: 'wf-cancel-orders', label: 'Cancel orders' },
    { id: 'wf-cancel-policy', label: 'Cancel Policy', targets: ['Standard Policy', 'Premium Policy'] },
    { id: 'wf-event-cancel', label: 'Event cancellations', targets: ['Event A', 'Event B', 'Event C'] },
    { id: 'wf-cancel-appt', label: 'Cancel appointment' },
    { id: 'wf-refund', label: 'Request refund' },
    { id: 'wf-feedback', label: 'Feedback submission', targets: ['Product Feedback', 'Support Feedback'] },
  ],
}

const menuCommands = [
  { id: 'transfer', label: 'Transfer' },
  { id: 'workflow', label: 'Workflow' },
]

const transferOptionsMap = {
  'contact-center': [
    { value: 'general', label: 'General Support' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'sales', label: 'Sales' },
    { value: 'success', label: 'Customer Success' },
    { value: 'returns', label: 'Returns & Exchanges' },
  ],
  'team-member-d': [
    { value: 'alex-lee', label: 'Alex Lee', role: 'User' },
    { value: 'alex-rogers', label: 'Alex Rogers', role: 'User' },
    { value: 'jordan-smith', label: 'Jordan Smith', role: 'Admin' },
    { value: 'taylor-brown', label: 'Taylor Brown', role: 'User' },
    { value: 'morgan-white', label: 'Morgan White', role: 'Admin' },
    { value: 'jamie-taylor', label: 'Jamie Taylor', role: 'User' },
  ],
}

export function useSlashCommand() {
  const showSlashMenu = ref(false)
  const slashMenuPosition = ref({ top: 0, left: 0 })
  const submenuPosition = ref({ top: 0, left: 0 })
  const activeSubmenu = ref(null)
  const selectedMenuIndex = ref(0)
  const searchQuery = ref('')
  const workflowSearch = ref('')
  const activeTargetItem = ref(null)
  const targetSubmenuPosition = ref({ top: 0, left: 0 })
  const showActionPanel = ref(false)
  const actionPanelItem = ref(null)
  const transferSearch = ref('')
  const showTransferDropdown = ref(false)
  const savedRange = ref(null)
  const currentEditorEl = ref(null)

  const slashMenuPositionStyle = computed(() => ({
    top: `${slashMenuPosition.value.top}px`,
    left: `${slashMenuPosition.value.left}px`,
  }))

  const submenuPositionStyle = computed(() => ({
    top: `${submenuPosition.value.top}px`,
    left: `${submenuPosition.value.left}px`,
  }))

  const targetSubmenuPositionStyle = computed(() => ({
    top: `${targetSubmenuPosition.value.top}px`,
    left: `${targetSubmenuPosition.value.left}px`,
  }))

  const filteredActions = computed(() => {
    if (!searchQuery.value) return actionItems
    const query = searchQuery.value.toLowerCase()
    return actionItems.filter((action) => action.label.toLowerCase().includes(query))
  })

  const filteredWorkflowItems = computed(() => {
    if (!workflowSearch.value) return []
    const query = workflowSearch.value.toLowerCase()
    return [
      ...workflowSubmenu.digital.filter((item) => item.label.toLowerCase().includes(query)),
      ...workflowSubmenu.voice.filter((item) => item.label.toLowerCase().includes(query)),
    ]
  })

  const filteredTransferOptions = computed(() => {
    const options = transferOptionsMap[actionPanelItem.value?.id] || []
    if (!transferSearch.value) return options
    const query = transferSearch.value.toLowerCase()
    return options.filter((option) => option.label.toLowerCase().includes(query))
  })

  function closeAll() {
    showSlashMenu.value = false
    activeSubmenu.value = null
    activeTargetItem.value = null
    showActionPanel.value = false
    actionPanelItem.value = null
    workflowSearch.value = ''
    transferSearch.value = ''
    showTransferDropdown.value = false
    searchQuery.value = ''
    savedRange.value = null
  }

  function keepEditorFocus(event) {
    if (event.target.closest('input, textarea')) return
    event.preventDefault()
  }

  function onKeydown(event) {
    currentEditorEl.value = event.currentTarget

    if (event.key === '/' && !showSlashMenu.value) {
      selectedMenuIndex.value = 0
      searchQuery.value = ''
      activeSubmenu.value = null
      activeTargetItem.value = null

      const selection = window.getSelection()
      let cursorBottom = 0
      let cursorTop = 0
      let cursorLeft = 0

      if (selection && selection.rangeCount > 0) {
        const rects = selection.getRangeAt(0).getClientRects()
        if (rects.length > 0) {
          cursorBottom = rects[0].bottom
          cursorTop = rects[0].top
          cursorLeft = rects[0].left
        } else {
          const rect = event.currentTarget.getBoundingClientRect()
          cursorBottom = rect.top + 24
          cursorTop = rect.top
          cursorLeft = rect.left + 16
        }
      }

      setTimeout(() => {
        const menuWidth = 240
        const menuHeight = 305
        const padding = 8
        let top = cursorBottom + 6
        let left = cursorLeft

        if (left + menuWidth + padding > window.innerWidth) {
          left = Math.max(padding, window.innerWidth - menuWidth - padding)
        }
        if (top + menuHeight + padding > window.innerHeight) {
          top = cursorTop - menuHeight - 4
          if (top < padding) top = padding
        }
        left = Math.max(padding, left)

        const latest = window.getSelection()
        if (
          latest &&
          latest.rangeCount > 0 &&
          currentEditorEl.value?.contains(latest.anchorNode)
        ) {
          savedRange.value = latest.getRangeAt(0).cloneRange()
        }

        slashMenuPosition.value = { top, left }
        showSlashMenu.value = true
      }, 10)
      return
    }

    if (!showSlashMenu.value) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      selectedMenuIndex.value = Math.min(
        selectedMenuIndex.value + 1,
        filteredActions.value.length - 1,
      )
      activeSubmenu.value = null
      activeTargetItem.value = null
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      selectedMenuIndex.value = Math.max(selectedMenuIndex.value - 1, 0)
      activeSubmenu.value = null
      activeTargetItem.value = null
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const action = filteredActions.value[selectedMenuIndex.value]
      if (action) handleActionClick(action)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      if (activeSubmenu.value) {
        activeSubmenu.value = null
        activeTargetItem.value = null
      } else {
        closeAll()
      }
    } else if (event.key === 'Backspace') {
      if (searchQuery.value === '') {
        closeAll()
      } else {
        event.preventDefault()
        searchQuery.value = searchQuery.value.slice(0, -1)
        selectedMenuIndex.value = 0
      }
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      event.preventDefault()
      searchQuery.value += event.key
      selectedMenuIndex.value = 0
      activeSubmenu.value = null
      activeTargetItem.value = null
    }
  }

  function openSubmenu(command, event) {
    activeSubmenu.value = command.id
    activeTargetItem.value = null
    workflowSearch.value = ''

    const rect = event.currentTarget.getBoundingClientRect()
    const padding = 8
    const submenuWidth = command.id === 'workflow' ? 240 : 180
    const submenuHeight = command.id === 'workflow' ? 440 : 270

    let left = rect.right + 4
    if (left + submenuWidth + padding > window.innerWidth) {
      left = slashMenuPosition.value.left - submenuWidth
    }
    left = Math.max(padding, left)

    let top = rect.top - 4
    if (top + submenuHeight + padding > window.innerHeight) {
      top = Math.max(padding, window.innerHeight - submenuHeight - padding)
    }
    top = Math.max(padding, top)

    submenuPosition.value = { top, left }
  }

  function openTargetSubmenu(item, event) {
    activeTargetItem.value = item
    const rect = event.currentTarget.getBoundingClientRect()
    const padding = 8
    const submenuWidth = 180
    const submenuHeight = (item.targets?.length ?? 0) * 34 + 40

    let left = rect.right + 4
    if (left + submenuWidth + padding > window.innerWidth) {
      left = rect.left - submenuWidth - 4
    }
    left = Math.max(padding, left)

    let top = rect.top - 4
    if (top + submenuHeight + padding > window.innerHeight) {
      top = Math.max(padding, window.innerHeight - submenuHeight - padding)
    }
    top = Math.max(padding, top)

    targetSubmenuPosition.value = { top, left }
  }

  function handleActionClick(action) {
    insertCommand(action.label, 'action')
    closeAll()
  }

  function handleTransferItemClick(item, section) {
    if (item.needsPanel) {
      const selection = window.getSelection()
      if (
        selection &&
        selection.rangeCount > 0 &&
        currentEditorEl.value?.contains(selection.anchorNode)
      ) {
        savedRange.value = selection.getRangeAt(0).cloneRange()
      }
      actionPanelItem.value = { ...item, section }
      transferSearch.value = ''
      showTransferDropdown.value = false
      showActionPanel.value = true
      activeSubmenu.value = null
      showSlashMenu.value = false
      return
    }
    insertCommand(`Transfer to ${item.label}`, 'transfer')
    closeAll()
  }

  function handleWorkflowItemClick(item, event) {
    if (item.targets) {
      openTargetSubmenu(item, event)
      return
    }
    insertCommand(item.label, 'workflow')
    closeAll()
  }

  function handleTargetClick(target) {
    insertCommand(`${activeTargetItem.value.label}: ${target}`, 'workflow')
    closeAll()
  }

  function selectTransferOption(option) {
    insertCommand(`Transfer to ${actionPanelItem.value.label}: ${option.label}`, 'transfer')
    closeAll()
  }

  function closeActionPanel() {
    showActionPanel.value = false
    actionPanelItem.value = null
    transferSearch.value = ''
    showTransferDropdown.value = false
    savedRange.value = null
  }

  function insertCommand(text, badgeType) {
    const editorEl = currentEditorEl.value
    if (!editorEl) return

    const selection = window.getSelection()
    if (savedRange.value) {
      selection.removeAllRanges()
      selection.addRange(savedRange.value)
    }
    savedRange.value = null
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const textNode = range.startContainer
    if (textNode.nodeType === Node.TEXT_NODE) {
      const content = textNode.textContent
      const cursorPos = range.startOffset
      const slashPos = content.lastIndexOf('/', cursorPos)
      if (slashPos !== -1) {
        textNode.textContent = content.slice(0, slashPos) + content.slice(cursorPos)
        range.setStart(textNode, slashPos)
        range.collapse(true)
      }
    }

    const badge = document.createElement('span')
    badge.className = `connection-badge connection-badge--${badgeType}`
    badge.dataset.badgeType = badgeType
    badge.textContent = text
    badge.contentEditable = 'false'
    range.insertNode(badge)

    const space = document.createTextNode('\u00A0')
    range.setStartAfter(badge)
    range.insertNode(space)
    range.setStartAfter(space)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    editorEl.focus()
  }

  return {
    showSlashMenu,
    showActionPanel,
    activeSubmenu,
    activeTargetItem,
    actionPanelItem,
    selectedMenuIndex,
    workflowSearch,
    transferSearch,
    showTransferDropdown,
    menuCommands,
    transferSubmenu,
    workflowSubmenu,
    filteredActions,
    filteredWorkflowItems,
    filteredTransferOptions,
    slashMenuPositionStyle,
    submenuPositionStyle,
    targetSubmenuPositionStyle,
    onKeydown,
    keepEditorFocus,
    closeAll,
    closeActionPanel,
    openSubmenu,
    openTargetSubmenu,
    handleActionClick,
    handleTransferItemClick,
    handleWorkflowItemClick,
    handleTargetClick,
    selectTransferOption,
  }
}
