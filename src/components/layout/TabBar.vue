<script setup lang="ts">
import { useEditorStore } from '@/stores/editor'
import { useUIStore } from '@/stores/ui'

const editor = useEditorStore()
const ui = useUIStore()

function getFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'md': return 'markdown'
    default: return 'file'
  }
}

function handleTabClick(path: string) {
  editor.setActiveFile(path)
}

function handleCloseTab(e: Event, path: string) {
  e.stopPropagation()
  editor.closeFile(path)
}

const modeOptions = [
  { value: 'source', label: 'Source', icon: 'code' },
  { value: 'split', label: 'Split', icon: 'split' },
  { value: 'reader', label: 'Reader', icon: 'book' },
  { value: 'zen', label: 'Zen', icon: 'zen' },
]
</script>

<template>
  <div class="tabbar">
    <!-- Editor Mode Selector -->
    <div class="mode-selector">
      <button
        v-for="opt in modeOptions"
        :key="opt.value"
        class="mode-btn"
        :class="{ active: editor.mode === opt.value }"
        @click="editor.setMode(opt.value)"
        :title="opt.label"
      >
        <svg v-if="opt.icon === 'code'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
        </svg>
        <svg v-else-if="opt.icon === 'split'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="3" x2="12" y2="21" />
        </svg>
        <svg v-else-if="opt.icon === 'book'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        <svg v-else-if="opt.icon === 'zen'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" /><path d="M8 12s1.5-2 4-2 4 2 4 2-1.5 2-4 2-4-2-4-2z" />
        </svg>
      </button>
    </div>

    <!-- Tabs -->
    <div class="tabs-container scrollable">
      <div
        v-for="tab in editor.openFiles"
        :key="tab.path"
        class="tab"
        :class="{ active: tab.isActive, dirty: tab.isDirty }"
        @click="handleTabClick(tab.path)"
      >
        <svg v-if="getFileIcon(tab.name) === 'markdown'" class="tab-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span class="tab-name">{{ tab.name }}</span>
        <span class="tab-dot" v-if="tab.isDirty"></span>
        <button class="tab-close" @click="handleCloseTab($event, tab.path)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Right actions -->
    <div class="tabbar-actions">
      <button class="icon-btn-xs tooltip" data-tooltip="Toggle Right Panel" @click="ui.toggleRightPanel()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="15" y1="3" x2="15" y2="21" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tabbar {
  display: flex;
  align-items: center;
  height: var(--tab-height);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
  min-width: 0;
}

.mode-selector {
  display: flex;
  align-items: center;
  gap: 1px;
  padding: 0 var(--space-2);
  flex-shrink: 0;
  border-right: 1px solid var(--border-primary);
  height: 100%;
}

.mode-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 24px;
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  transition: all var(--transition-fast);

  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  &.active {
    background: var(--bg-active);
    color: var(--accent-blue);
  }
}

.tabs-container {
  display: flex;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  height: 100%;
  align-items: stretch;

  &::-webkit-scrollbar {
    height: 3px;
  }
}

.tab {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: 0 var(--space-3);
  min-width: 0;
  max-width: 180px;
  height: 100%;
  border-right: 1px solid var(--border-primary);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  flex-shrink: 0;
  position: relative;

  &:hover {
    background: var(--bg-hover);
    .tab-close { opacity: 1; }
  }

  &.active {
    background: var(--bg-primary);
    color: var(--text-primary);
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--accent-blue);
    }
  }
}

.tab-icon {
  flex-shrink: 0;
  color: var(--accent-purple);
}

.tab-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
  flex-shrink: 0;
}

.tab-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  opacity: 0;
  flex-shrink: 0;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--bg-active);
    color: var(--accent-red);
  }
}

.tabbar-actions {
  display: flex;
  align-items: center;
  padding: 0 var(--space-2);
  flex-shrink: 0;
  height: 100%;
}

.icon-btn-xs {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  transition: all var(--transition-fast);

  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
}
</style>