<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue'
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, rectangularSelection, crosshairCursor, highlightSpecialChars, dropCursor } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
import { autocompletion, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { syntaxHighlighting, indentOnInput, bracketMatching, foldGutter, foldKeymap, HighlightStyle, indentUnit } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { useEditorStore } from '@/stores/editor'

const props = defineProps<{
  content: string
  wordWrap: boolean
  lineNumbersEnabled: boolean
  fontSize: number
  fontFamily: string
  lineHeight: number
}>()

const emit = defineEmits<{
  'update:content': [content: string]
  'cursor-change': [line: number, column: number]
}>()

const editorContainer = ref<HTMLDivElement | null>(null)
const editorView = shallowRef<EditorView | null>(null)

// Catppuccin Mocha theme
const catppuccinTheme = EditorView.theme({
  '&': {
    backgroundColor: '#1e1e2e',
    color: '#cdd6f4',
    fontSize: `${props.fontSize}px`,
    fontFamily: props.fontFamily,
    height: '100%',
  },
  '.cm-content': {
    caretColor: '#f5e0dc',
    lineHeight: props.lineHeight.toString(),
    padding: '8px 0',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: '#f5e0dc',
    borderLeftWidth: '2px',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#45475a66',
  },
  '.cm-activeLine': {
    backgroundColor: '#2a2a3d33',
  },
  '.cm-gutters': {
    backgroundColor: '#1e1e2e',
    color: '#6c7086',
    border: 'none',
    borderRight: '1px solid #313244',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#2a2a3d33',
    color: '#cdd6f4',
  },
  '.cm-foldPlaceholder': {
    backgroundColor: '#313244',
    color: '#a6adc8',
    border: 'none',
  },
  '.cm-matchingBracket': {
    backgroundColor: '#45475a66',
    outline: '1px solid #89b4fa',
  },
  '.cm-selectionMatch': {
    backgroundColor: '#45475a66',
  },
  '.cm-searchMatch': {
    backgroundColor: '#f9e2af33',
    outline: '1px solid #f9e2af',
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: '#f9e2af66',
  },
  '.cm-tooltip': {
    backgroundColor: '#252536',
    border: '1px solid #313244',
    borderRadius: '6px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  '.cm-tooltip.cm-tooltip-autocomplete': {
    '& > ul > li[aria-selected]': {
      backgroundColor: '#333350',
      color: '#cdd6f4',
    },
  },
  '.cm-panels': {
    backgroundColor: '#181825',
    color: '#cdd6f4',
  },
  '.cm-panel.cm-search': {
    backgroundColor: '#181825',
    '& input, & button, & label': {
      color: '#cdd6f4',
    },
    '& input': {
      backgroundColor: '#1e1e2e',
      border: '1px solid #313244',
      borderRadius: '4px',
    },
  },
  '.cm-scroller': {
    fontFamily: props.fontFamily,
    overflow: 'auto',
  },
  '.cm-line': {
    padding: '0 12px',
  },
}, { dark: true })

// Syntax highlighting for Catppuccin Mocha
const catppuccinHighlight = HighlightStyle.define([
  { tag: tags.heading1, color: '#f38ba8', fontWeight: 'bold', fontSize: '1.5em' },
  { tag: tags.heading2, color: '#fab387', fontWeight: 'bold', fontSize: '1.3em' },
  { tag: tags.heading3, color: '#f9e2af', fontWeight: 'bold', fontSize: '1.15em' },
  { tag: tags.heading4, color: '#a6e3a1', fontWeight: 'bold' },
  { tag: tags.heading5, color: '#89b4fa', fontWeight: 'bold' },
  { tag: tags.heading6, color: '#cba6f7', fontWeight: 'bold' },
  { tag: tags.strong, color: '#f5c2e7', fontWeight: 'bold' },
  { tag: tags.emphasis, color: '#f5c2e7', fontStyle: 'italic' },
  { tag: tags.strikethrough, color: '#6c7086', textDecoration: 'line-through' },
  { tag: tags.link, color: '#89dceb', textDecoration: 'underline' },
  { tag: tags.url, color: '#89dceb' },
  { tag: tags.string, color: '#a6e3a1' },
  { tag: tags.keyword, color: '#cba6f7' },
  { tag: tags.comment, color: '#6c7086', fontStyle: 'italic' },
  { tag: tags.meta, color: '#f9e2af' },
  { tag: tags.processingInstruction, color: '#89b4fa' },
  { tag: tags.bool, color: '#fab387' },
  { tag: tags.null, color: '#fab387' },
  { tag: tags.number, color: '#fab387' },
  { tag: tags.regexp, color: '#f38ba8' },
  { tag: tags.escape, color: '#f5c2e7' },
  { tag: tags.monospace, color: '#f5c2e7', fontFamily: 'monospace' },
  { tag: tags.quote, color: '#89b4fa', fontStyle: 'italic' },
  { tag: tags.separator, color: '#45475a' },
  { tag: tags.atom, color: '#fab387' },
  { tag: tags.tagName, color: '#f38ba8' },
  { tag: tags.attributeName, color: '#f9e2af' },
  { tag: tags.attributeValue, color: '#a6e3a1' },
])

// Wrap config compartment
const wrapCompartment = new Compartment()
const lineNumbersCompartment = new Compartment()

function createExtensions() {
  const extensions = [
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    highlightSelectionMatches(),
    indentUnit.of('  '),
    EditorView.lineWrapping,
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      indentWithTab,
    ]),
    markdown({ base: markdownLanguage }),
    catppuccinTheme,
    syntaxHighlighting(catppuccinHighlight),
    wrapCompartment.of(props.wordWrap ? EditorView.lineWrapping : []),
    lineNumbersCompartment.of(props.lineNumbersEnabled ? lineNumbers() : []),
    foldGutter({
      openText: '▼',
      closedText: '▶',
    }),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        emit('update:content', update.state.doc.toString())
      }
      // Track cursor position
      const pos = update.state.selection.main.head
      const line = update.state.doc.lineAt(pos)
      emit('cursor-change', line.number, pos - line.from + 1)
    }),
    EditorView.domEventHandlers({
      keydown: (e, view) => {
        // Bold: Ctrl+B
        if (e.ctrlKey && e.key === 'b' && !e.shiftKey) {
          e.preventDefault()
          wrapSelection(view, '**', '**')
          return true
        }
        // Italic: Ctrl+I
        if (e.ctrlKey && e.key === 'i' && !e.shiftKey) {
          e.preventDefault()
          wrapSelection(view, '*', '*')
          return true
        }
        // Strikethrough: Ctrl+Shift+X
        if (e.ctrlKey && e.shiftKey && e.key === 'X') {
          e.preventDefault()
          wrapSelection(view, '~~', '~~')
          return true
        }
        // Code: Ctrl+`
        if (e.ctrlKey && e.key === '`') {
          e.preventDefault()
          wrapSelection(view, '`', '`')
          return true
        }
        // Link: Ctrl+K
        if (e.ctrlKey && e.key === 'k') {
          e.preventDefault()
          insertLink(view)
          return true
        }
        return false
      },
    }),
  ]

  return extensions
}

function wrapSelection(view: EditorView, before: string, after: string) {
  const { from, to } = view.state.selection.main
  const selected = view.state.sliceDoc(from, to)
  const wrapped = `${before}${selected || 'text'}${after}`
  view.dispatch({
    changes: { from, to, insert: wrapped },
    selection: {
      anchor: from + before.length,
      head: from + before.length + (selected ? selected.length : 4),
    },
  })
}

function insertLink(view: EditorView) {
  const { from, to } = view.state.selection.main
  const selected = view.state.sliceDoc(from, to)
  const link = selected ? `[${selected}](url)` : '[text](url)'
  view.dispatch({
    changes: { from, to, insert: link },
    selection: {
      anchor: from + 1,
      head: from + 1 + (selected ? selected.length : 4),
    },
  })
}

onMounted(() => {
  if (!editorContainer.value) return

  const state = EditorState.create({
    doc: props.content,
    extensions: createExtensions(),
  })

  editorView.value = new EditorView({
    state,
    parent: editorContainer.value,
  })
})

// Watch for external content changes
watch(() => props.content, (newContent) => {
  if (editorView.value) {
    const currentContent = editorView.value.state.doc.toString()
    if (currentContent !== newContent) {
      editorView.value.dispatch({
        changes: {
          from: 0,
          to: currentContent.length,
          insert: newContent,
        },
      })
    }
  }
})

// Watch word wrap changes
watch(() => props.wordWrap, (wrap) => {
  if (editorView.value) {
    editorView.value.dispatch({
      effects: wrapCompartment.reconfigure(wrap ? EditorView.lineWrapping : []),
    })
  }
})

// Watch line numbers changes
watch(() => props.lineNumbersEnabled, (enabled) => {
  if (editorView.value) {
    editorView.value.dispatch({
      effects: lineNumbersCompartment.reconfigure(enabled ? lineNumbers() : []),
    })
  }
})

onUnmounted(() => {
  editorView.value?.destroy()
})

// Expose editor view for parent access
defineExpose({
  editorView,
  focus: () => editorView.value?.focus(),
  scrollTo: (pos: number) => {
    if (editorView.value) {
      editorView.value.dispatch({
        effects: EditorView.scrollIntoView(pos),
      })
    }
  },
})
</script>

<template>
  <div ref="editorContainer" class="cm-editor-wrapper"></div>
</template>

<style lang="scss" scoped>
.cm-editor-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;

  :deep(.cm-editor) {
    height: 100%;
    outline: none;
  }

  :deep(.cm-scroller) {
    overflow: auto;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: #45475a;
      border-radius: 3px;
      &:hover { background: #585b70; }
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }

  :deep(.cm-gutters) {
    min-width: 40px;
  }

  :deep(.cm-foldGutter) {
    width: 14px;
  }
}
</style>