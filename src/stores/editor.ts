import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EditorMode, EditorTheme, OpenFile } from '@/types'
import { nanoid } from 'nanoid'

export const useEditorStore = defineStore('editor', () => {
  // --- State ---
  const mode = ref<EditorMode>('split')
  const theme = ref<EditorTheme>('dark')
  const currentFile = ref<string | null>(null)
  const openFiles = ref<OpenFile[]>([])
  const activeFileContent = ref('')
  const isDirty = ref(false)
  const cursorPosition = ref({ line: 1, column: 1 })
  const scrollPosition = ref(0)
  const wordWrap = ref(true)
  const lineNumbers = ref(true)
  const minimap = ref(false)
  const typewriterMode = ref(false)
  const focusMode = ref(false)
  const editorFontSize = ref(14)
  const editorFontFamily = ref('JetBrains Mono, Consolas, monospace')
  const editorLineHeight = ref(1.6)

  // Demo content for initial state
  const welcomeContent = `---
title: Welcome to Markdown Studio X
tags: [welcome, getting-started]
created: 2026-06-02
---

# Welcome to Markdown Studio X 🚀

> "Satu workspace. Seluruh pengetahuan Anda."

Markdown Studio X adalah platform dokumentasi dan pengetahuan generasi berikutnya yang **local-first**, berbasis **Markdown murni**, dan dirancang sebagai **Knowledge Operating System**.

## ✨ Key Features

- [x] **Live Preview** - Editor dengan split view real-time
- [x] **Knowledge Graph** - Visualisasi hubungan antar dokumen
- [x] **Wiki Links** - Gunakan \`[[wikilink]]\` untuk menghubungkan catatan
- [x] **AI Assistant** - Integrasi AI untuk membantu menulis
- [ ] **Git Integration** - Version control native
- [ ] **Publishing Engine** - Publish ke berbagai platform

## 📝 Markdown Support

### Code Block

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}! Welcome to Markdown Studio X.\`
}

console.log(greet('World'))
\`\`\`

### Math (KaTeX)

Inline math: $E = mc^2$

Block math:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

### Mermaid Diagram

\`\`\`mermaid
graph TD
    A[Markdown Studio X] --> B[Editor]
    A --> C[Knowledge Graph]
    A --> D[AI Assistant]
    A --> E[Git Integration]
    A --> F[Publishing Engine]
    B --> G[Live Preview]
    B --> H[Multiple Modes]
\`\`\`

### Table

| Feature | Status | Priority |
|---------|--------|----------|
| Editor | ✅ Done | High |
| Preview | ✅ Done | High |
| Graph | 🔄 WIP | Medium |
| AI | 📋 Planned | Medium |
| Git | 📋 Planned | Low |

### Callout

> [!tip] Pro Tip
> Gunakan keyboard shortcut \`Ctrl+P\` untuk membuka Command Palette!

> [!warning] Perhatian
> Pastikan selalu save pekerjaan Anda.

### Task List

- [x] Buat project structure
- [x] Setup Vue 3 + TypeScript + Vite
- [ ] Implementasi CodeMirror 6 Editor
- [ ] Implementasi Knowledge Graph
- [ ] Implementasi Search System
- [ ] Implementasi Git Integration

## 🔗 Links

- [[Getting Started]] - Panduan memulai
- [[API Reference]] - Referensi API
- [[Changelog]] - Riwayat perubahan

---

*Markdown Studio X v1.0.0 - Built with Vue 3 + TypeScript + CodeMirror 6*
`

  // --- Computed ---
  const activeFile = computed(() => openFiles.value.find(f => f.isActive))
  const hasUnsavedChanges = computed(() => openFiles.value.some(f => f.isDirty))
  const openFileCount = computed(() => openFiles.value.length)
  const wordCount = computed(() => {
    const content = activeFileContent.value
    if (!content.trim()) return 0
    return content.trim().split(/\s+/).length
  })
  const charCount = computed(() => activeFileContent.value.length)
  const lineCount = computed(() => {
    if (!activeFileContent.value) return 0
    return activeFileContent.value.split('\n').length
  })

  // --- Actions ---
  function openFile(path: string, name: string, content?: string) {
    const existing = openFiles.value.find(f => f.path === path)
    if (existing) {
      setActiveFile(path)
      return
    }

    // Deactivate all other files
    openFiles.value.forEach(f => (f.isActive = false))

    openFiles.value.push({
      path,
      name,
      content: content || '',
      isDirty: false,
      isActive: true,
    })

    currentFile.value = path
    activeFileContent.value = content || ''
  }

  function closeFile(path: string) {
    const index = openFiles.value.findIndex(f => f.path === path)
    if (index === -1) return

    openFiles.value.splice(index, 1)

    if (currentFile.value === path) {
      if (openFiles.value.length > 0) {
        const nextIndex = Math.min(index, openFiles.value.length - 1)
        setActiveFile(openFiles.value[nextIndex].path)
      } else {
        currentFile.value = null
        activeFileContent.value = ''
      }
    }
  }

  function setActiveFile(path: string) {
    openFiles.value.forEach(f => {
      f.isActive = f.path === path
    })
    currentFile.value = path
    const file = openFiles.value.find(f => f.path === path)
    if (file) {
      activeFileContent.value = file.content
    }
  }

  function updateContent(content: string) {
    activeFileContent.value = content
    const file = openFiles.value.find(f => f.path === currentFile.value)
    if (file) {
      file.content = content
      file.isDirty = true
      isDirty.value = true
    }
  }

  function saveFile(path?: string) {
    const targetPath = path || currentFile.value
    const file = openFiles.value.find(f => f.path === targetPath)
    if (file) {
      file.isDirty = false
      if (targetPath === currentFile.value) {
        isDirty.value = false
      }
    }
  }

  function setMode(newMode: EditorMode) {
    mode.value = newMode
    if (newMode === 'zen' || newMode === 'reader') {
      focusMode.value = true
    } else {
      focusMode.value = false
    }
  }

  function setCursorPosition(line: number, column: number) {
    cursorPosition.value = { line, column }
  }

  function toggleWordWrap() {
    wordWrap.value = !wordWrap.value
  }

  function toggleLineNumbers() {
    lineNumbers.value = !lineNumbers.value
  }

  function toggleTypewriterMode() {
    typewriterMode.value = !typewriterMode.value
  }

  function toggleFocusMode() {
    focusMode.value = !focusMode.value
  }

  function loadWelcomeFile() {
    openFile('/welcome.md', 'welcome.md', welcomeContent)
  }

  return {
    // State
    mode,
    theme,
    currentFile,
    openFiles,
    activeFileContent,
    isDirty,
    cursorPosition,
    scrollPosition,
    wordWrap,
    lineNumbers,
    minimap,
    typewriterMode,
    focusMode,
    editorFontSize,
    editorFontFamily,
    editorLineHeight,
    // Computed
    activeFile,
    hasUnsavedChanges,
    openFileCount,
    wordCount,
    charCount,
    lineCount,
    // Actions
    openFile,
    closeFile,
    setActiveFile,
    updateContent,
    saveFile,
    setMode,
    setCursorPosition,
    toggleWordWrap,
    toggleLineNumbers,
    toggleTypewriterMode,
    toggleFocusMode,
    loadWelcomeFile,
  }
})