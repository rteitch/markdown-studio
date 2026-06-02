<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useGraphStore } from '@/stores/graph'

const editor = useEditorStore()
const graph = useGraphStore()

const currentBacklinks = computed(() => {
  if (!editor.currentFile) return []
  return graph.getBacklinks(editor.currentFile)
})

const currentTags = computed(() => {
  if (!editor.currentFile) return []
  return graph.tags.filter(t => t.files.includes(editor.currentFile!))
})
</script>

<template>
  <div class="backlinks-panel">
    <!-- Backlinks Section -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">Backlinks</span>
        <span class="section-count">{{ currentBacklinks.length }}</span>
      </div>
      <div class="section-body">
        <div v-if="currentBacklinks.length === 0" class="empty-hint">
          No backlinks found
        </div>
        <div
          v-for="(link, i) in currentBacklinks"
          :key="i"
          class="backlink-item"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <div class="backlink-info">
            <span class="backlink-source">{{ link.fromFile.split('/').pop() }}</span>
            <span class="backlink-context">links to this note</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tags Section -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">Tags</span>
        <span class="section-count">{{ currentTags.length }}</span>
      </div>
      <div class="section-body">
        <div v-if="currentTags.length === 0" class="empty-hint">
          No tags
        </div>
        <div class="tags-list">
          <span
            v-for="tag in currentTags"
            :key="tag.name"
            class="tag-chip"
          >
            #{{ tag.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Outgoing Links Section -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">Outgoing Links</span>
      </div>
      <div class="section-body">
        <div v-if="!editor.currentFile" class="empty-hint">
          No file selected
        </div>
        <div
          v-for="link in graph.wikiLinks.filter(l => l.fromFile === editor.currentFile)"
          :key="link.target"
          class="backlink-item"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <div class="backlink-info">
            <span class="backlink-source">{{ link.target }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.backlinks-panel {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--border-primary);
}

.section {
  background: var(--bg-secondary);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--border-primary);
}

.section-title {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section-count {
  font-size: 10px;
  color: var(--text-muted);
  background: var(--bg-tertiary);
  padding: 0 6px;
  border-radius: 8px;
}

.section-body {
  padding: var(--space-2);
}

.empty-hint {
  padding: var(--space-3);
  text-align: center;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.backlink-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  transition: background var(--transition-fast);

  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  svg { flex-shrink: 0; color: var(--accent-blue); }
}

.backlink-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.backlink-source {
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.backlink-context {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  padding: var(--space-1);
}

.tag-chip {
  padding: 2px 8px;
  background: rgba(166, 227, 161, 0.1);
  color: var(--accent-green);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  cursor: pointer;

  &:hover {
    background: rgba(166, 227, 161, 0.2);
  }
}
</style>