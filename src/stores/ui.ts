import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UIState, Notification } from '@/types'
import { nanoid } from 'nanoid'

export const useUIStore = defineStore('ui', () => {
  // --- State ---
  const sidebarVisible = ref(true)
  const sidebarWidth = ref(260)
  const sidebarActivePanel = ref<UIState['sidebar']['activePanel']>('files')

  const rightPanelVisible = ref(true)
  const rightPanelWidth = ref(350)
  const rightPanelActivePanel = ref<UIState['rightPanel']['activePanel']>('preview')

  const bottomPanelVisible = ref(false)
  const bottomPanelHeight = ref(200)
  const bottomPanelActivePanel = ref<UIState['bottomPanel']['activePanel']>('output')

  const commandPaletteVisible = ref(false)
  const commandPaletteQuery = ref('')

  const modalVisible = ref(false)
  const modalComponent = ref<string | null>(null)
  const modalProps = ref<Record<string, any> | undefined>(undefined)

  const notifications = ref<Notification[]>([])
  const theme = ref<'light' | 'dark' | 'system'>('dark')
  const locale = ref('en')

  // --- Computed ---
  const activeNotifications = computed(() => notifications.value.filter(n => !n.read))
  const unreadCount = computed(() => activeNotifications.value.length)

  // --- Actions ---
  function toggleSidebar() {
    sidebarVisible.value = !sidebarVisible.value
  }

  function setSidebarPanel(panel: UIState['sidebar']['activePanel']) {
    if (sidebarActivePanel.value === panel && sidebarVisible.value) {
      sidebarVisible.value = false
    } else {
      sidebarActivePanel.value = panel
      sidebarVisible.value = true
    }
  }

  function setSidebarWidth(width: number) {
    sidebarWidth.value = Math.max(180, Math.min(500, width))
  }

  function toggleRightPanel() {
    rightPanelVisible.value = !rightPanelVisible.value
  }

  function setRightPanel(panel: UIState['rightPanel']['activePanel']) {
    if (rightPanelActivePanel.value === panel && rightPanelVisible.value) {
      rightPanelVisible.value = false
    } else {
      rightPanelActivePanel.value = panel
      rightPanelVisible.value = true
    }
  }

  function setRightPanelWidth(width: number) {
    rightPanelWidth.value = Math.max(250, Math.min(600, width))
  }

  function toggleBottomPanel() {
    bottomPanelVisible.value = !bottomPanelVisible.value
  }

  function setBottomPanel(panel: UIState['bottomPanel']['activePanel']) {
    if (bottomPanelActivePanel.value === panel && bottomPanelVisible.value) {
      bottomPanelVisible.value = false
    } else {
      bottomPanelActivePanel.value = panel
      bottomPanelVisible.value = true
    }
  }

  function toggleCommandPalette() {
    commandPaletteVisible.value = !commandPaletteVisible.value
    if (!commandPaletteVisible.value) {
      commandPaletteQuery.value = ''
    }
  }

  function openModal(component: string, props?: Record<string, any>) {
    modalVisible.value = true
    modalComponent.value = component
    modalProps.value = props
  }

  function closeModal() {
    modalVisible.value = false
    modalComponent.value = null
    modalProps.value = undefined
  }

  function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    notifications.value.unshift({
      ...notification,
      id: nanoid(),
      timestamp: new Date().toISOString(),
      read: false,
    })
  }

  function dismissNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  function markNotificationRead(id: string) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  function clearNotifications() {
    notifications.value = []
  }

  function setTheme(newTheme: 'light' | 'dark' | 'system') {
    theme.value = newTheme
    applyTheme()
  }

  function applyTheme() {
    const root = document.documentElement
    root.classList.remove('theme-light', 'theme-dark')

    if (theme.value === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.add(prefersDark ? 'theme-dark' : 'theme-light')
    } else {
      root.classList.add(`theme-${theme.value}`)
    }
  }

  return {
    // State
    sidebarVisible,
    sidebarWidth,
    sidebarActivePanel,
    rightPanelVisible,
    rightPanelWidth,
    rightPanelActivePanel,
    bottomPanelVisible,
    bottomPanelHeight,
    bottomPanelActivePanel,
    commandPaletteVisible,
    commandPaletteQuery,
    modalVisible,
    modalComponent,
    modalProps,
    notifications,
    theme,
    locale,
    // Computed
    activeNotifications,
    unreadCount,
    // Actions
    toggleSidebar,
    setSidebarPanel,
    setSidebarWidth,
    toggleRightPanel,
    setRightPanel,
    setRightPanelWidth,
    toggleBottomPanel,
    setBottomPanel,
    toggleCommandPalette,
    openModal,
    closeModal,
    addNotification,
    dismissNotification,
    markNotificationRead,
    clearNotifications,
    setTheme,
    applyTheme,
  }
})