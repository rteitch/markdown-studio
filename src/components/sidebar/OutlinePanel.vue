<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editor'

const editor = useEditorStore()

interface HeadingItem {
  level: number
  text: string
  line: number
}

const headings = computed<HeadingItem[]>(() => {
  const content = editor.activeFileContent
  if (!content) return []

  const result: HeadingItem[] = []
  const lines = content.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      result.push({
        level: match[1].length,
        text: match[2].replace(/[*_`]/g, ''),
        line: i + 1,
      })
    }
  }

  return result
})

function scrollToHeading(line: number) {
  // For now, just update cursor position
  editor.setCursorPosition(line, 1)
}
</script>

<template>
  <div class="outline-panel">
    <div class="outline-header">
      <span class="outline-title">Outline</span>
    </div>
    <div class="outline-body scrollable">
      <div v-if="headings.length === 0" class="outline-empty">
        <p>No headings found</p>
      </div>
      <div
        v-for="(heading, i) in headings"
        :key="i"
        class="outline-item"
        :style="{ paddingLeft: `${(heading.level - 1) * 12 + 8}px` }"
        @click="scrollToHeading(heading.line)"
      >
        <span class="heading-marker" :class="`h${heading.level}`">H{{ heading.level }}</span>
        <span class="heading-text">{{ heading.text }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.outline-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.outline-header {
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--border-primary);
}

.outline-title {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.outline-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-1);
}

.outline-empty {
  padding: var(--space-4);
  text-align: center;
  color: var(--text-muted);
  font-size: var(--font-size-xs);
}

.outline-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  transition: background var(--transition-fast);

  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
}

.heading-marker {
  font-size: 9px;
  font-weight: 700;
  font-family: var(--font-mono);
  padding: 0 4px;
  border-radius: 2px;
  flex-shrink: 0;

  &.h1 { color: var(--accent-red); }
  &.h2 { color: var(--accent-orange); }
  &.h3 { color: var(--accent-yellow); }
  &.h4 { color: var(--accent-green); }
  &.h5 { color: var(--accent-blue); }
  &.h6 { color: var(--accent-purple); }
}

.heading-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>