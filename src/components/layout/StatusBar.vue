<script setup lang="ts">
import { useUIStore } from '@/stores/ui'
import { useEditorStore } from '@/stores/editor'

const ui = useUIStore()
const editor = useEditorStore()
</script>

<template>
  <div class="statusbar">
    <div class="statusbar-left">
      <!-- Branch indicator -->
      <button class="status-item clickable">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><line x1="6" y1="9" x2="6" y2="21" />
        </svg>
        <span>main</span>
      </button>

      <!-- Sync indicator -->
      <button class="status-item clickable">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
        <span>0↓ 0↑</span>
      </button>

      <!-- Errors/Warnings -->
      <button class="status-item clickable">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>0</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>0</span>
      </button>
    </div>

    <div class="statusbar-right">
      <!-- Cursor Position -->
      <button class="status-item clickable" v-if="editor.currentFile">
        <span>Ln {{ editor.cursorPosition.line }}, Col {{ editor.cursorPosition.column }}</span>
      </button>

      <!-- Word Count -->
      <button class="status-item clickable" v-if="editor.currentFile">
        <span>{{ editor.wordCount }} words</span>
      </button>

      <!-- Encoding -->
      <button class="status-item clickable">
        <span>UTF-8</span>
      </button>

      <!-- Line Ending -->
      <button class="status-item clickable">
        <span>LF</span>
      </button>

      <!-- Language -->
      <button class="status-item clickable" v-if="editor.currentFile">
        <span>Markdown</span>
      </button>

      <!-- Editor Mode -->
      <button class="status-item clickable" @click="editor.setMode(editor.mode === 'split' ? 'source' : 'split')">
        <svg v-if="editor.mode === 'split'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="3" x2="12" y2="21" />
        </svg>
        <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        </svg>
        <span>{{ editor.mode }}</span>
      </button>

      <!-- Auto-save indicator -->
      <button class="status-item" v-if="editor.isDirty">
        <span class="unsaved-dot"></span>
        <span>Unsaved</span>
      </button>
      <button class="status-item" v-else-if="editor.currentFile">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>Saved</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--statusbar-height);
  padding: 0 var(--space-2);
  background: var(--bg-tertiary);
  border-top: 1px solid var(--border-primary);
  font-size: 11px;
  color: var(--text-secondary);
  user-select: none;
  flex-shrink: 0;
}

.statusbar-left,
.statusbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.status-item {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 0 6px;
  height: var(--statusbar-height);
  font-size: 11px;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
  white-space: nowrap;

  &.clickable {
    cursor: pointer;
    &:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }
  }
}

.unsaved-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-yellow);
}
</style>