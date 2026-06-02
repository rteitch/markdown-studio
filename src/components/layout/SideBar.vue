<script setup lang="ts">
import { useUIStore } from '@/stores/ui'
import { useWorkspaceStore } from '@/stores/workspace'
import { useEditorStore } from '@/stores/editor'
import FileExplorer from '@/components/sidebar/FileExplorer.vue'
import GitPanel from '@/components/sidebar/GitPanel.vue'

const ui = useUIStore()
const workspace = useWorkspaceStore()
const editor = useEditorStore()

const panels = [
  { id: 'files' as const, icon: 'files', label: 'Files', shortcut: 'Ctrl+Shift+E' },
  { id: 'graph' as const, icon: 'graph', label: 'Graph', shortcut: 'Ctrl+Shift+G' },
  { id: 'search' as const, icon: 'search', label: 'Search', shortcut: 'Ctrl+Shift+F' },
  { id: 'git' as const, icon: 'git', label: 'Git', shortcut: 'Ctrl+Shift+G' },
  { id: 'ai' as const, icon: 'ai', label: 'AI', shortcut: '' },
  { id: 'plugins' as const, icon: 'plugins', label: 'Plugins', shortcut: '' },
]

function handleFileClick(path: string, name: string) {
  const node = workspace.findNode(path)
  if (node && node.type === 'file') {
    // For demo, just open with empty content (real app would read from FS)
    editor.openFile(path, name)
    workspace.addToRecentFiles(path)
  }
}
</script>

<template>
  <div class="sidebar">
    <!-- Sidebar Activity Bar -->
    <div class="activity-bar">
      <button
        v-for="panel in panels"
        :key="panel.id"
        class="activity-btn tooltip"
        :class="{ active: ui.sidebarActivePanel === panel.id }"
        :data-tooltip="panel.label"
        @click="ui.setSidebarPanel(panel.id)"
      >
        <!-- Files Icon -->
        <svg v-if="panel.icon === 'files'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <polyline points="13 2 13 9 20 9" />
        </svg>
        <!-- Graph Icon -->
        <svg v-else-if="panel.icon === 'graph'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><circle cx="6" cy="18" r="3" />
          <line x1="8.5" y1="7.5" x2="15.5" y2="16.5" /><line x1="6" y1="9" x2="6" y2="15" />
        </svg>
        <!-- Search Icon -->
        <svg v-else-if="panel.icon === 'search'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <!-- Git Icon -->
        <svg v-else-if="panel.icon === 'git'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><line x1="6" y1="9" x2="6" y2="21" />
        </svg>
        <!-- AI Icon -->
        <svg v-else-if="panel.icon === 'ai'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2a4 4 0 0 1 4 4v1a1 1 0 0 0 1 1h1a4 4 0 0 1 0 8h-1a1 1 0 0 0-1 1v1a4 4 0 0 1-8 0v-1a1 1 0 0 0-1-1H6a4 4 0 0 1 0-8h1a1 1 0 0 0 1-1V6a4 4 0 0 1 4-4z" />
          <circle cx="12" cy="12" r="1" />
        </svg>
        <!-- Plugins Icon -->
        <svg v-else-if="panel.icon === 'plugins'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      </button>
    </div>

    <!-- Sidebar Panel Content -->
    <div class="panel-content">
      <!-- Panel Header -->
      <div class="panel-header">
        <span class="panel-title">{{ ui.sidebarActivePanel.toUpperCase() }}</span>
        <div class="panel-actions">
          <button class="icon-btn-sm" title="Collapse All" @click="workspace.collapseAll()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" />
              <line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
          <button class="icon-btn-sm" title="New File" @click="workspace.createFile('/', 'untitled.md')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </button>
          <button class="icon-btn-sm" title="New Folder" @click="workspace.createFolder('/', 'new-folder')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              <line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" />
            </svg>
          </button>
        </div>
      </div>

      <!-- File Explorer Panel -->
      <div v-if="ui.sidebarActivePanel === 'files'" class="panel-body scrollable">
        <FileExplorer
          :nodes="workspace.fileTree"
          :current-file="editor.currentFile"
          @file-click="handleFileClick"
          @folder-toggle="workspace.toggleFolder"
        />
      </div>

      <!-- Graph Panel -->
      <div v-else-if="ui.sidebarActivePanel === 'graph'" class="panel-body">
        <div class="panel-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
            <circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><circle cx="6" cy="18" r="3" />
            <line x1="8.5" y1="7.5" x2="15.5" y2="16.5" /><line x1="6" y1="9" x2="6" y2="15" />
          </svg>
          <p>Knowledge Graph</p>
          <small>Navigate to Graph view to explore connections</small>
        </div>
      </div>

      <!-- Git Panel -->
      <div v-else-if="ui.sidebarActivePanel === 'git'" class="panel-body">
        <GitPanel />
      </div>

      <!-- Search Panel -->
      <div v-else-if="ui.sidebarActivePanel === 'search'" class="panel-body">
        <div class="search-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input type="text" placeholder="Search files..." class="search-input" />
        </div>
        <div class="panel-empty">
          <p>Search across your workspace</p>
        </div>
      </div>


      <!-- AI Panel -->
      <div v-else-if="ui.sidebarActivePanel === 'ai'" class="panel-body">
        <div class="panel-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
            <path d="M12 2a4 4 0 0 1 4 4v1a1 1 0 0 0 1 1h1a4 4 0 0 1 0 8h-1a1 1 0 0 0-1 1v1a4 4 0 0 1-8 0v-1a1 1 0 0 0-1-1H6a4 4 0 0 1 0-8h1a1 1 0 0 0 1-1V6a4 4 0 0 1 4-4z" />
            <circle cx="12" cy="12" r="1" />
          </svg>
          <p>AI Assistant</p>
          <small>Configure AI providers in settings</small>
        </div>
      </div>

      <!-- Plugins Panel -->
      <div v-else-if="ui.sidebarActivePanel === 'plugins'" class="panel-body">
        <div class="panel-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
          <p>Plugins</p>
          <small>Browse and manage plugins</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  width: 280px;
  min-width: 200px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-primary);
  flex-shrink: 0;
}

.activity-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 42px;
  padding: var(--space-2) 0;
  gap: var(--space-1);
  background: var(--bg-tertiary);
  border-right: 1px solid var(--border-primary);
  flex-shrink: 0;
}

.activity-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  transition: all var(--transition-fast);
  position: relative;

  &:hover {
    color: var(--text-primary);
    background: var(--bg-hover);
  }

  &.active {
    color: var(--accent-blue);
    &::before {
      content: '';
      position: absolute;
      left: -4px;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background: var(--accent-blue);
      border-radius: 0 2px 2px 0;
    }
  }
}

.panel-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  height: var(--toolbar-height);
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
}

.panel-title {
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.panel-actions {
  display: flex;
  gap: var(--space-1);
}

.icon-btn-sm {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  transition: all var(--transition-fast);

  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
}

.panel-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-6);
  text-align: center;
  color: var(--text-tertiary);

  p {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  small {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }
}

.search-box {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--border-primary);
  color: var(--text-tertiary);

  .search-input {
    flex: 1;
    padding: 4px;
    font-size: var(--font-size-sm);
    color: var(--text-primary);

    &::placeholder {
      color: var(--text-muted);
    }
  }
}
</style>