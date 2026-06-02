<script setup lang="ts">
import { onMounted } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useWorkspaceStore } from '@/stores/workspace'
import { useEditorStore } from '@/stores/editor'
import TitleBar from '@/components/layout/TitleBar.vue'
import SideBar from '@/components/layout/SideBar.vue'
import StatusBar from '@/components/layout/StatusBar.vue'
import TabBar from '@/components/layout/TabBar.vue'
import CommandPalette from '@/components/CommandPalette.vue'

const ui = useUIStore()
const workspace = useWorkspaceStore()
const editor = useEditorStore()

onMounted(() => {
  ui.applyTheme()
  workspace.loadDemoWorkspace()
  editor.loadWelcomeFile()

  // Keyboard shortcuts
  window.addEventListener('keydown', handleKeydown)
})

function handleKeydown(e: KeyboardEvent) {
  // Ctrl+P / Cmd+P - Command Palette
  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
    e.preventDefault()
    ui.toggleCommandPalette()
  }
  // Ctrl+S / Cmd+S - Save
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    editor.saveFile()
  }
  // Ctrl+B / Cmd+B - Toggle Sidebar
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault()
    ui.toggleSidebar()
  }
  // Ctrl+\ - Toggle Right Panel
  if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
    e.preventDefault()
    ui.toggleRightPanel()
  }
  // Ctrl+J - Toggle Bottom Panel
  if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
    e.preventDefault()
    ui.toggleBottomPanel()
  }
  // Escape - Close Command Palette / Modal
  if (e.key === 'Escape') {
    if (ui.commandPaletteVisible) ui.toggleCommandPalette()
    if (ui.modalVisible) ui.closeModal()
  }
}
</script>

<template>
  <div class="app-container" :class="{ 'sidebar-hidden': !ui.sidebarVisible }">
    <!-- Title Bar -->
    <TitleBar />

    <!-- Main Content Area -->
    <div class="main-area">
      <!-- Sidebar -->
      <SideBar v-if="ui.sidebarVisible" />

      <!-- Editor Area -->
      <div class="editor-area">
        <!-- Tab Bar -->
        <TabBar />

        <!-- Content -->
        <div class="content-area">
          <router-view />
        </div>
      </div>
    </div>

    <!-- Status Bar -->
    <StatusBar />

    <!-- Command Palette Overlay -->
    <CommandPalette v-if="ui.commandPaletteVisible" />
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.main-area {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.editor-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.content-area {
  flex: 1;
  overflow: hidden;
  display: flex;
}
</style>