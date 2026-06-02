<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useUIStore } from '@/stores/ui'
import MarkdownEditor from '@/components/editor/MarkdownEditor.vue'
import MarkdownToolbar from '@/components/editor/MarkdownToolbar.vue'
import { renderMarkdownFull, renderMermaidInHtml, extractMermaidBlocks } from '@/utils/markdown'

const editor = useEditorStore()
const ui = useUIStore()

const previewContent = ref('')
const cmEditorRef = ref<InstanceType<typeof MarkdownEditor> | null>(null)

// Update preview on content change using advanced renderer
watch(() => editor.activeFileContent, async (content) => {
  if (!content) {
    previewContent.value = ''
    return
  }
  // Use advanced renderer with Mermaid + KaTeX support
  const mermaidBlocks = extractMermaidBlocks(content)
  let html = await renderMarkdownFull(content)
  if (mermaidBlocks.length > 0) {
    html = await renderMermaidInHtml(html, mermaidBlocks)
  }
  previewContent.value = html
}, { immediate: true })

function handleContentUpdate(content: string) {
  editor.updateContent(content)
}

function handleCursorChange(line: number, column: number) {
  editor.setCursorPosition(line, column)
}

function handleToolbarAction(action: string) {
  // Toolbar actions will be handled by the CodeMirror editor
  // For now, just emit the action
}

// Word count, line count
const stats = computed(() => ({
  words: editor.wordCount,
  chars: editor.charCount,
  lines: editor.lineCount,
}))
</script>

<template>
  <div class="editor-view" :class="{ 'zen-mode': editor.mode === 'zen' }">
    <!-- No file open state -->
    <div v-if="!editor.currentFile" class="editor-empty">
      <div class="empty-content">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        <h2>Markdown Studio X</h2>
        <p>Satu workspace. Seluruh pengetahuan Anda.</p>
        <div class="shortcuts-hint">
          <div class="shortcut"><kbd>Ctrl+P</kbd> Command Palette</div>
          <div class="shortcut"><kbd>Ctrl+N</kbd> New File</div>
          <div class="shortcut"><kbd>Ctrl+O</kbd> Open File</div>
        </div>
      </div>
    </div>

    <!-- Editor Content -->
    <template v-else>
      <!-- Editor Pane -->
      <div
        v-if="editor.mode === 'source' || editor.mode === 'split' || editor.mode === 'zen'"
        class="editor-pane"
        :class="{ 'full-width': editor.mode !== 'split' }"
      >
        <MarkdownToolbar @action="handleToolbarAction" />
        <MarkdownEditor
          ref="cmEditorRef"
          :content="editor.activeFileContent"
          :word-wrap="editor.wordWrap"
          :line-numbers-enabled="editor.lineNumbers"
          :font-size="editor.editorFontSize"
          :font-family="editor.editorFontFamily"
          :line-height="editor.editorLineHeight"
          @update:content="handleContentUpdate"
          @cursor-change="handleCursorChange"
        />
      </div>

      <!-- Preview Pane -->
      <div
        v-if="editor.mode === 'split' || editor.mode === 'reader'"
        class="preview-pane"
        :class="{ 'full-width': editor.mode === 'reader' }"
      >
        <div class="preview-content" v-html="previewContent"></div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.editor-view {
  display: flex;
  flex: 1;
  overflow: hidden;
  background: var(--editor-bg);
  min-height: 0;

  &.zen-mode {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    background: var(--editor-bg);
  }
}

.editor-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  background: var(--editor-bg);

  .empty-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);

    h2 {
      font-size: var(--font-size-2xl);
      font-weight: 600;
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    p {
      color: var(--text-tertiary);
      font-size: var(--font-size-base);
    }
  }

  .shortcuts-hint {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin-top: var(--space-4);

    .shortcut {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--font-size-sm);
      color: var(--text-muted);

      kbd {
        padding: 2px 8px;
        background: var(--bg-surface);
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-sm);
        font-size: var(--font-size-xs);
        font-family: var(--font-mono);
        color: var(--text-secondary);
        min-width: 60px;
        text-align: center;
      }
    }
  }
}

.editor-pane {
  flex: 1;
  min-width: 0;
  border-right: 1px solid var(--border-primary);
  display: flex;

  &.full-width {
    border-right: none;
  }
}

.editor-textarea {
  width: 100%;
  height: 100%;
  padding: var(--space-4);
  background: var(--editor-bg);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  border: none;
  outline: none;
  tab-size: 2;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-y: auto;

  &::placeholder {
    color: var(--text-muted);
  }
}

.preview-pane {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &.full-width {
    border-right: none;
  }
}

.preview-content {
  flex: 1;
  padding: var(--space-6) var(--space-8);
  overflow-y: auto;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;

  // Markdown rendered styles
  :deep(h1) {
    font-size: 2em;
    font-weight: 700;
    margin: 0.67em 0 0.3em;
    padding-bottom: 0.3em;
    border-bottom: 1px solid var(--border-primary);
    color: var(--text-primary);
  }

  :deep(h2) {
    font-size: 1.5em;
    font-weight: 600;
    margin: 1em 0 0.3em;
    padding-bottom: 0.2em;
    border-bottom: 1px solid var(--border-primary);
    color: var(--text-primary);
  }

  :deep(h3) {
    font-size: 1.25em;
    font-weight: 600;
    margin: 1em 0 0.3em;
    color: var(--text-primary);
  }

  :deep(h4), :deep(h5), :deep(h6) {
    font-size: 1em;
    font-weight: 600;
    margin: 1em 0 0.3em;
    color: var(--text-primary);
  }

  :deep(p) {
    margin: 0.5em 0;
    line-height: 1.7;
    color: var(--text-primary);
  }

  :deep(strong) {
    font-weight: 600;
    color: var(--text-primary);
  }

  :deep(em) {
    font-style: italic;
  }

  :deep(del) {
    text-decoration: line-through;
    color: var(--text-tertiary);
  }

  :deep(a) {
    color: var(--accent-blue);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  :deep(.wiki-link) {
    color: var(--accent-purple);
    background: rgba(203, 166, 247, 0.1);
    padding: 1px 4px;
    border-radius: 3px;
    cursor: pointer;
    &:hover {
      background: rgba(203, 166, 247, 0.2);
    }
  }

  :deep(ul), :deep(ol) {
    padding-left: 1.5em;
    margin: 0.5em 0;
  }

  :deep(li) {
    margin: 0.25em 0;
    line-height: 1.7;
  }

  :deep(.task-item) {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 4px 0;
    
    input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: var(--accent-blue);
    }
    
    span {
      color: var(--text-primary);
    }
  }

  :deep(blockquote) {
    margin: 0.5em 0;
    padding: 0.5em 1em;
    border-left: 3px solid var(--accent-blue);
    background: rgba(137, 180, 250, 0.05);
    color: var(--text-secondary);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  }

  :deep(.callout) {
    margin: 0.5em 0;
    padding: 0.75em 1em;
    border-radius: var(--radius-md);
    border-left: 3px solid;
    
    .callout-title {
      font-weight: 600;
      margin-bottom: 4px;
      text-transform: capitalize;
    }
    
    .callout-content {
      color: var(--text-secondary);
    }

    &.callout-tip {
      border-color: var(--accent-green);
      background: rgba(166, 227, 161, 0.08);
      .callout-title { color: var(--accent-green); }
    }
    &.callout-warning {
      border-color: var(--accent-yellow);
      background: rgba(249, 226, 175, 0.08);
      .callout-title { color: var(--accent-yellow); }
    }
    &.callout-danger {
      border-color: var(--accent-red);
      background: rgba(243, 139, 168, 0.08);
      .callout-title { color: var(--accent-red); }
    }
    &.callout-info, &.callout-note {
      border-color: var(--accent-blue);
      background: rgba(137, 180, 250, 0.08);
      .callout-title { color: var(--accent-blue); }
    }
  }

  :deep(.code-block) {
    margin: 0.5em 0;
    padding: 1em;
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-primary);
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 0.875em;
    line-height: 1.6;
    color: var(--text-primary);
  }

  :deep(.inline-code) {
    padding: 2px 6px;
    background: var(--bg-tertiary);
    border-radius: 3px;
    font-family: var(--font-mono);
    font-size: 0.9em;
    color: var(--accent-peach);
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 0.5em 0;
  }

  :deep(td), :deep(th) {
    padding: 8px 12px;
    border: 1px solid var(--border-primary);
    text-align: left;
  }

  :deep(tr:nth-child(even)) {
    background: var(--bg-surface);
  }

  :deep(hr) {
    border: none;
    height: 1px;
    background: var(--border-primary);
    margin: 1.5em 0;
  }

  :deep(img) {
    max-width: 100%;
    border-radius: var(--radius-md);
  }

  :deep(.math-block) {
    margin: 1em 0;
    padding: 1em;
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    text-align: center;
    font-family: var(--font-mono);
    color: var(--text-primary);
  }

  :deep(.math-inline) {
    font-family: var(--font-mono);
    color: var(--accent-green);
  }

  :deep(.mermaid-block) {
    margin: 1em 0;
    padding: 1em;
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-primary);
    
    pre {
      font-family: var(--font-mono);
      font-size: 0.85em;
      color: var(--text-secondary);
      white-space: pre-wrap;
    }
  }
}
</style>