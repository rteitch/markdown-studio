<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWorkspaceStore } from '@/stores/workspace'
import { useEditorStore } from '@/stores/editor'
import type { FileNode } from '@/types'

const workspace = useWorkspaceStore()
const editor = useEditorStore()

const searchQuery = ref('')
const searchType = ref<'files' | 'content' | 'tags'>('files')

const searchResults = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return []

  if (searchType.value === 'files') {
    return workspace.allFiles.filter(f =>
      f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q)
    )
  }
  return []
})

function openResult(file: FileNode) {
  editor.openFile(file.path, file.name)
}
</script>

<template>
  <div class="search-view">
    <div class="search-header">
      <h3>Search</h3>
    </div>
    <div class="search-form">
      <div class="search-input-wrapper">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Search across workspace..."
          autofocus
        />
      </div>
      <div class="search-types">
        <button class="type-btn" :class="{ active: searchType === 'files' }" @click="searchType = 'files'">files</button>
        <button class="type-btn" :class="{ active: searchType === 'content' }" @click="searchType = 'content'">content</button>
        <button class="type-btn" :class="{ active: searchType === 'tags' }" @click="searchType = 'tags'">tags</button>
      </div>
    </div>
    <div class="search-results scrollable">
      <div v-if="searchQuery && searchResults.length === 0" class="no-results">
        <p>No results found for "{{ searchQuery }}"</p>
      </div>
      <div
        v-for="result in searchResults"
        :key="result.path"
        class="result-item"
        @click="openResult(result)"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <div class="result-info">
          <span class="result-name">{{ result.name }}</span>
          <span class="result-path">{{ result.path }}</span>
        </div>
      </div>
      <div v-if="!searchQuery" class="search-hint">
        <p>Type to search across your workspace</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--editor-bg);
  overflow: hidden;
}

.search-header {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;

  h3 {
    font-size: var(--font-size-base);
    font-weight: 600;
  }
}

.search-form {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--bg-surface);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2);
  color: var(--text-tertiary);

  .search-input {
    flex: 1;
    font-size: var(--font-size-sm);
    color: var(--text-primary);
    &::placeholder { color: var(--text-muted); }
  }
}

.search-types {
  display: flex;
  gap: var(--space-1);
}

.type-btn {
  padding: 2px 10px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  background: var(--bg-surface);
  border: 1px solid var(--border-primary);

  &:hover { background: var(--bg-hover); }
  &.active {
    background: var(--accent-blue);
    color: #fff;
    border-color: var(--accent-blue);
  }
}

.search-results {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2);
}

.result-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-secondary);
  transition: background var(--transition-fast);

  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
}

.result-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.result-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.result-path {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-results, .search-hint {
  padding: var(--space-6);
  text-align: center;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}
</style>