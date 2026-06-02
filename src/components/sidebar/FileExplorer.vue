<script setup lang="ts">
import type { FileNode } from '@/types'

defineProps<{
  nodes: FileNode[]
  currentFile: string | null
}>()

const emit = defineEmits<{
  'file-click': [path: string, name: string]
  'folder-toggle': [path: string]
}>()

function getFileIcon(node: FileNode): string {
  if (node.type === 'directory') return node.isExpanded ? 'folder-open' : 'folder'
  const ext = node.extension?.toLowerCase()
  switch (ext) {
    case 'md': return 'markdown'
    case 'json': return 'json'
    case 'yaml': case 'yml': return 'yaml'
    case 'ts': case 'tsx': return 'typescript'
    case 'js': case 'jsx': return 'javascript'
    case 'css': case 'scss': return 'css'
    case 'html': return 'html'
    case 'png': case 'jpg': case 'jpeg': case 'gif': case 'svg': case 'webp': return 'image'
    case 'pdf': return 'pdf'
    default: return 'file'
  }
}

function getIndent(level: number): string {
  return `padding-left: ${level * 16 + 8}px`
}
</script>

<template>
  <div class="file-explorer">
    <template v-for="node in nodes" :key="node.id">
      <!-- Directory -->
      <div
        v-if="node.type === 'directory'"
        class="tree-item folder-item"
        :style="getIndent(0)"
        @click="emit('folder-toggle', node.path)"
      >
        <span class="folder-arrow" :class="{ expanded: node.isExpanded }">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
        <svg class="item-icon folder-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path v-if="node.isExpanded" d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          <path v-else d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <span class="item-name">{{ node.name }}</span>
        <span class="item-count" v-if="node.children">{{ node.children.length }}</span>
      </div>

      <!-- Directory Children (recursive) -->
      <template v-if="node.type === 'directory' && node.isExpanded && node.children">
        <FileExplorer
          :nodes="node.children"
          :current-file="currentFile"
          @file-click="(p, n) => emit('file-click', p, n)"
          @folder-toggle="(p) => emit('folder-toggle', p)"
          :style="{ paddingLeft: '16px' }"
        />
      </template>

      <!-- File -->
      <div
        v-if="node.type === 'file'"
        class="tree-item file-item"
        :class="{ active: currentFile === node.path }"
        :style="getIndent(0)"
        @click="emit('file-click', node.path, node.name)"
        @dblclick="emit('file-click', node.path, node.name)"
      >
        <!-- File Icons -->
        <svg v-if="getFileIcon(node) === 'markdown'" class="item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M8 13h2l1-2 1 4 1-2h2" />
        </svg>
        <svg v-else-if="getFileIcon(node) === 'image'" class="item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <svg v-else class="item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span class="item-name">{{ node.name }}</span>
        <span class="item-dot" v-if="currentFile === node.path"></span>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.file-explorer {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.tree-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  transition: background var(--transition-fast);
  white-space: nowrap;
  min-height: 26px;

  &:hover {
    background: var(--bg-hover);
  }

  &.active {
    background: var(--bg-active);
    color: var(--text-primary);
  }
}

.folder-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  transition: transform var(--transition-fast);
  color: var(--text-muted);

  &.expanded {
    transform: rotate(90deg);
  }
}

.item-icon {
  flex-shrink: 0;
  color: var(--text-muted);
}

.folder-icon {
  color: var(--accent-yellow);
}

.item-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-count {
  font-size: 10px;
  color: var(--text-muted);
  background: var(--bg-tertiary);
  padding: 0 5px;
  border-radius: 8px;
  flex-shrink: 0;
}

.item-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-blue);
  flex-shrink: 0;
}
</style>