import { ref, computed, watch } from 'vue'

export function useHistoryPagination (items) {
  const currentPage = ref(1)
  const itemsPerPage = ref(25)

  const totalPages = computed(() => {
    if (!items.value || items.value.length === 0) return 1
    return Math.ceil(items.value.length / itemsPerPage.value)
  })

  const paginatedItems = computed(() => {
    if (!items.value) return []
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return items.value.slice(start, end)
  })

  const displayRange = computed(() => {
    if (!items.value || items.value.length === 0) {
      return { start: 0, end: 0, total: 0 }
    }
    const start = (currentPage.value - 1) * itemsPerPage.value + 1
    const end = Math.min(currentPage.value * itemsPerPage.value, items.value.length)
    return { start, end, total: items.value.length }
  })

  function goToPage (page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  function setItemsPerPage (newValue) {
    itemsPerPage.value = newValue
    currentPage.value = 1
  }

  watch(
    () => items.value?.length,
    (newLength, oldLength) => {
      if (newLength !== oldLength && currentPage.value > totalPages.value) {
        currentPage.value = 1
      }
    },
  )

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems,
    displayRange,
    goToPage,
    setItemsPerPage,
  }
}
