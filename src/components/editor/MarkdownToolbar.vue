<script setup lang="ts">
const emit = defineEmits<{
  action: [action: string]
}>()

const tools = [
  { id: 'heading', label: 'Heading', icon: 'H', shortcut: '' },
  { id: 'bold', label: 'Bold', icon: 'B', shortcut: 'Ctrl+B' },
  { id: 'italic', label: 'Italic', icon: 'I', shortcut: 'Ctrl+I' },
  { id: 'strikethrough', label: 'Strikethrough', icon: 'S', shortcut: '' },
  { id: 'separator1', type: 'separator' },
  { id: 'code', label: 'Code', icon: '<>', shortcut: '' },
  { id: 'codeblock', label: 'Code Block', icon: '{}', shortcut: '' },
  { id: 'math', label: 'Math', icon: '∑', shortcut: '' },
  { id: 'separator2', type: 'separator' },
  { id: 'link', label: 'Link', icon: '🔗', shortcut: 'Ctrl+K' },
  { id: 'image', label: 'Image', icon: '🖼', shortcut: '' },
  { id: 'wikilink', label: 'Wiki Link', icon: '📎', shortcut: '' },
  { id: 'separator3', type: 'separator' },
  { id: 'ul', label: 'Bullet List', icon: '•', shortcut: '' },
  { id: 'ol', label: 'Numbered List', icon: '1.', shortcut: '' },
  { id: 'task', label: 'Task List', icon: '☐', shortcut: '' },
  { id: 'separator4', type: 'separator' },
  { id: 'quote', label: 'Blockquote', icon: '❝', shortcut: '' },
  { id: 'hr', label: 'Horizontal Rule', icon: '—', shortcut: '' },
  { id: 'table', label: 'Table', icon: '▦', shortcut: '' },
  { id: 'callout', label: 'Callout', icon: '💡', shortcut: '' },
]

function handleAction(tool: any) {
  if (tool.type === 'separator') return
  emit('action', tool.id)
}
</script>

<template>
  <div class="markdown-toolbar">
    <template v-for="tool in tools" :key="tool.id">
      <div v-if="tool.type === 'separator'" class="toolbar-separator"></div>
      <button
        v-else
        class="toolbar-btn tooltip"
        :data-tooltip="tool.label + (tool.shortcut ? ` (${tool.shortcut})` : '')"
        @click="handleAction(tool)"
      >
        <span class="toolbar-icon">{{ tool.icon }}</span>
      </button>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.markdown-toolbar {
  display: flex;
  align-items: center;
  gap: 1px;
  padding: 0 var(--space-2);
  height: 32px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 0;
  }
}

.toolbar-separator {
  width: 1px;
  height: 18px;
  background: var(--border-primary);
  margin: 0 4px;
  flex-shrink: 0;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 24px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  transition: all var(--transition-fast);
  flex-shrink: 0;

  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  &:active {
    background: var(--bg-active);
  }
}

.toolbar-icon {
  font-family: var(--font-mono);
  font-size: 11px;
}
</style>