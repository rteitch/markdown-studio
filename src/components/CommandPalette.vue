<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useEditorStore } from '@/stores/editor'
import { useWorkspaceStore } from '@/stores/workspace'

const ui = useUIStore()
const editor = useEditorStore()
const workspace = useWorkspaceStore()

const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const selectedIndex = ref(0)

interface CommandItem {
  id: string
  label: string
  description: string
  icon: string
  category: string
  action: () => void
}

const commands: CommandItem[] = [
  // File commands
  { id: 'new-file', label: 'New File', description: 'Create a new file', icon: 'file-plus', category: 'File', action: () => { workspace.createFile('/', 'untitled.md'); ui.toggleCommandPalette() } },
  { id: 'save', label: 'Save', description: 'Save current file', icon: 'save', category: 'File', action: () => { editor.saveFile(); ui.toggleCommandPalette() } },
  
  // Editor commands
  { id: 'source-mode', label: 'Source Mode', description: 'Switch to source mode', icon: 'code', category: 'Editor', action: () => { editor.setMode('source'); ui.toggleCommandPalette() } },
  { id: 'split-mode', label: 'Split Mode', description: 'Switch to split view', icon: 'split', category: 'Editor', action: () => { editor.setMode('split'); ui.toggleCommandPalette() } },
  { id: 'reader-mode', label: 'Reader Mode', description: 'Switch to reader mode', icon: 'book', category: 'Editor', action: () => { editor.setMode('reader'); ui.toggleCommandPalette() } },
  { id: 'zen-mode', label: 'Zen Mode', description: 'Switch to zen/focus mode', icon: 'zen', category: 'Editor', action: () => { editor.setMode('zen'); ui.toggleCommandPalette() } },
  { id: 'toggle-wordwrap', label: 'Toggle Word Wrap', description: 'Toggle word wrapping', icon: 'wrap', category: 'Editor', action: () => { editor.toggleWordWrap(); ui.toggleCommandPalette() } },
  { id: 'toggle-linenums', label: 'Toggle Line Numbers', description: 'Toggle line number display', icon: 'numbers', category: 'Editor', action: () => { editor.toggleLineNumbers(); ui.toggleCommandPalette() } },
  
  // View commands
  { id: 'toggle-sidebar', label: 'Toggle Sidebar', description: 'Show/hide the sidebar', icon: 'sidebar', category: 'View', action: () => { ui.toggleSidebar(); ui.toggleCommandPalette() } },
  { id: 'toggle-preview', label: 'Toggle Preview', description: 'Show/hide the preview panel', icon: 'preview', category: 'View', action: () => { ui.toggleRightPanel(); ui.toggleCommandPalette() } },
  { id: 'toggle-theme', label: 'Toggle Theme', description: 'Switch between light and dark theme', icon: 'theme', category: 'View', action: () => { ui.setTheme(ui.theme === 'dark' ? 'light' : 'dark'); ui.toggleCommandPalette() } },
  { id: 'files-panel', label: 'Show Files Panel', description: 'Open file explorer', icon: 'files', category: 'View', action: () => { ui.setSidebarPanel('files'); ui.toggleCommandPalette() } },
  { id: 'graph-panel', label: 'Show Graph Panel', description: 'Open knowledge graph', icon: 'graph', category: 'View', action: () => { ui.setSidebarPanel('graph'); ui.toggleCommandPalette() } },
  { id: 'search-panel', label: 'Show Search Panel', description: 'Open search', icon: 'search', category: 'View', action: () => { ui.setSidebarPanel('search'); ui.toggleCommandPalette() } },
  
  // Help commands
  { id: 'shortcuts', label: 'Keyboard Shortcuts', description: 'View all keyboard shortcuts', icon: 'keyboard', category: 'Help', action: () => { ui.toggleCommandPalette() } },
  { id: 'about', label: 'About Markdown Studio X', description: 'Version info', icon: 'info', category: 'Help', action: () => { ui.toggleCommandPalette() } },
]

// Add file commands from workspace
const fileCommands = computed<CommandItem[]>(() => {
  return workspace.allFiles.map(f => ({
    id: `open-${f.path}`,
    label: f.name,
    description: f.path,
    icon: 'file',
    category: 'Files',
    action: () => {
      editor.openFile(f.path, f.name)
      workspace.addToRecentFiles(f.path)
      ui.toggleCommandPalette()
    },
  }))
})

const filteredCommands = computed(() => {
  const q = query.value.toLowerCase().trim()
  const all = [...fileCommands.value, ...commands]
  
  if (!q) return all.slice(0, 20)
  
  return all.filter(cmd =>
    cmd.label.toLowerCase().includes(q) ||
    cmd.description.toLowerCase().includes(q) ||
    cmd.category.toLowerCase().includes(q)
  ).slice(0, 20)
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % filteredCommands.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value - 1 + filteredCommands.value.length) % filteredCommands.value.length
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const cmd = filteredCommands.value[selectedIndex.value]
    if (cmd) cmd.action()
  } else if (e.key === 'Escape') {
    ui.toggleCommandPalette()
  }
}

function executeCommand(cmd: CommandItem) {
  cmd.action()
}

onMounted(() => {
  nextTick(() => {
    inputRef.value?.focus()
  })
})
</script>

<template>
  <div class="command-palette-overlay" @click.self="ui.toggleCommandPalette()">
    <div class="command-palette">
      <!-- Search Input -->
      <div class="palette-input-wrapper">
        <svg class="palette-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          class="palette-input"
          placeholder="Type a command or search files..."
          @keydown="handleKeydown"
        />
        <kbd class="palette-kbd">ESC</kbd>
      </div>

      <!-- Results -->
      <div class="palette-results scrollable">
        <template v-if="filteredCommands.length">
          <template v-for="(cmd, index) in filteredCommands" :key="cmd.id">
            <!-- Category header -->
            <div
              v-if="index === 0 || filteredCommands[index - 1]?.category !== cmd.category"
              class="palette-category"
            >
              {{ cmd.category }}
            </div>
            <!-- Command item -->
            <div
              class="palette-item"
              :class="{ selected: selectedIndex === index }"
              @click="executeCommand(cmd)"
              @mouseenter="selectedIndex = index"
            >
              <div class="palette-item-content">
                <span class="palette-item-label">{{ cmd.label }}</span>
                <span class="palette-item-desc">{{ cmd.description }}</span>
              </div>
            </div>
          </template>
        </template>
        <div v-else class="palette-empty">
          No results found
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.command-palette-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  padding-top: 15vh;
  z-index: 100;
  animation: fadeIn 100ms ease forwards;
}

.command-palette {
  width: 550px;
  max-height: 400px;
  background: var(--bg-surface);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideIn 150ms ease forwards;
}

.palette-input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-primary);
}

.palette-search-icon {
  flex-shrink: 0;
  color: var(--text-tertiary);
}

.palette-input {
  flex: 1;
  font-size: var(--font-size-base);
  color: var(--text-primary);
  background: transparent;

  &::placeholder {
    color: var(--text-muted);
  }
}

.palette-kbd {
  padding: 2px 6px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 3px;
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--text-muted);
}

.palette-results {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2);
}

.palette-category {
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.palette-item {
  display: flex;
  align-items: center;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast);

  &.selected {
    background: var(--accent-blue);
    color: #ffffff;
    .palette-item-desc { color: rgba(255,255,255,0.7); }
  }
}

.palette-item-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.palette-item-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.palette-item-desc {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.palette-empty {
  padding: var(--space-6);
  text-align: center;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}
</style>