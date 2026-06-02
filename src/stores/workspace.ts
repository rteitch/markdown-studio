import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Workspace, FileNode } from '@/types'
import { nanoid } from 'nanoid'

export const useWorkspaceStore = defineStore('workspace', () => {
  // --- State ---
  const currentWorkspace = ref<Workspace | null>(null)
  const workspaces = ref<Workspace[]>([])
  const fileTree = ref<FileNode[]>([])
  const isLoading = ref(false)
  const recentFiles = ref<string[]>([])
  const starredFiles = ref<string[]>([])
  const pinnedFiles = ref<string[]>([])

  // Demo file tree
  const demoFileTree: FileNode[] = [
    {
      id: nanoid(),
      name: 'docs',
      path: '/docs',
      type: 'directory',
      isExpanded: true,
      children: [
        {
          id: nanoid(),
          name: 'Getting Started',
          path: '/docs/Getting Started.md',
          type: 'file',
          extension: 'md',
          modifiedAt: '2026-06-02T10:00:00Z',
        },
        {
          id: nanoid(),
          name: 'API Reference',
          path: '/docs/API Reference.md',
          type: 'file',
          extension: 'md',
          modifiedAt: '2026-06-02T09:30:00Z',
        },
        {
          id: nanoid(),
          name: 'Architecture',
          path: '/docs/Architecture.md',
          type: 'file',
          extension: 'md',
          modifiedAt: '2026-06-01T15:00:00Z',
        },
      ],
    },
    {
      id: nanoid(),
      name: 'notes',
      path: '/notes',
      type: 'directory',
      isExpanded: false,
      children: [
        {
          id: nanoid(),
          name: 'Meeting Notes',
          path: '/notes/Meeting Notes.md',
          type: 'file',
          extension: 'md',
          modifiedAt: '2026-06-02T08:00:00Z',
        },
        {
          id: nanoid(),
          name: 'Ideas',
          path: '/notes/Ideas.md',
          type: 'file',
          extension: 'md',
          modifiedAt: '2026-05-30T12:00:00Z',
        },
      ],
    },
    {
      id: nanoid(),
      name: 'projects',
      path: '/projects',
      type: 'directory',
      isExpanded: false,
      children: [
        {
          id: nanoid(),
          name: 'Roadmap',
          path: '/projects/Roadmap.md',
          type: 'file',
          extension: 'md',
          modifiedAt: '2026-06-01T10:00:00Z',
        },
      ],
    },
    {
      id: nanoid(),
      name: 'diagrams',
      path: '/diagrams',
      type: 'directory',
      isExpanded: false,
      children: [
        {
          id: nanoid(),
          name: 'System Architecture',
          path: '/diagrams/System Architecture.md',
          type: 'file',
          extension: 'md',
          modifiedAt: '2026-05-28T14:00:00Z',
        },
      ],
    },
    {
      id: nanoid(),
      name: 'templates',
      path: '/templates',
      type: 'directory',
      isExpanded: false,
      children: [
        {
          id: nanoid(),
          name: 'ADR Template',
          path: '/templates/ADR Template.md',
          type: 'file',
          extension: 'md',
          modifiedAt: '2026-05-20T10:00:00Z',
        },
        {
          id: nanoid(),
          name: 'Meeting Template',
          path: '/templates/Meeting Template.md',
          type: 'file',
          extension: 'md',
          modifiedAt: '2026-05-20T10:00:00Z',
        },
      ],
    },
    {
      id: nanoid(),
      name: 'welcome.md',
      path: '/welcome.md',
      type: 'file',
      extension: 'md',
      modifiedAt: '2026-06-02T12:00:00Z',
    },
    {
      id: nanoid(),
      name: 'README.md',
      path: '/README.md',
      type: 'file',
      extension: 'md',
      modifiedAt: '2026-06-02T12:00:00Z',
    },
  ]

  // --- Computed ---
  const allFiles = computed(() => {
    const files: FileNode[] = []
    function walk(nodes: FileNode[]) {
      for (const node of nodes) {
        if (node.type === 'file') {
          files.push(node)
        }
        if (node.children) {
          walk(node.children)
        }
      }
    }
    walk(fileTree.value)
    return files
  })

  const allFolders = computed(() => {
    const folders: FileNode[] = []
    function walk(nodes: FileNode[]) {
      for (const node of nodes) {
        if (node.type === 'directory') {
          folders.push(node)
        }
        if (node.children) {
          walk(node.children)
        }
      }
    }
    walk(fileTree.value)
    return folders
  })

  const totalFiles = computed(() => allFiles.value.length)
  const totalFolders = computed(() => allFolders.value.length)

  // --- Actions ---
  function loadDemoWorkspace() {
    const demoWorkspace: Workspace = {
      id: nanoid(),
      name: 'My Workspace',
      path: '/workspace',
      isDefault: true,
      createdAt: '2026-06-02T00:00:00Z',
      updatedAt: '2026-06-02T12:00:00Z',
      config: {
        defaultNoteFolder: 'notes',
        assetFolder: 'assets',
        templateFolder: 'templates',
        diagramFolder: 'diagrams',
        snippetFolder: 'snippets',
        scriptsFolder: 'scripts',
        studioFolder: '.studio',
        enableGit: true,
        enableAI: true,
        aiProvider: 'ollama',
        theme: 'dark',
        editorFontSize: 14,
        editorFontFamily: 'JetBrains Mono, Consolas, monospace',
        editorLineHeight: 1.6,
        autoSave: true,
        autoSaveDelay: 1000,
      },
    }

    currentWorkspace.value = demoWorkspace
    workspaces.value = [demoWorkspace]
    fileTree.value = demoFileTree
  }

  function toggleFolder(path: string) {
    function walk(nodes: FileNode[]): boolean {
      for (const node of nodes) {
        if (node.path === path && node.type === 'directory') {
          node.isExpanded = !node.isExpanded
          return true
        }
        if (node.children && walk(node.children)) {
          return true
        }
      }
      return false
    }
    walk(fileTree.value)
  }

  function expandFolder(path: string) {
    function walk(nodes: FileNode[]): boolean {
      for (const node of nodes) {
        if (node.path === path && node.type === 'directory') {
          node.isExpanded = true
          return true
        }
        if (node.children && walk(node.children)) {
          return true
        }
      }
      return false
    }
    walk(fileTree.value)
  }

  function collapseAll() {
    function walk(nodes: FileNode[]) {
      for (const node of nodes) {
        if (node.type === 'directory') {
          node.isExpanded = false
        }
        if (node.children) {
          walk(node.children)
        }
      }
    }
    walk(fileTree.value)
  }

  function expandAll() {
    function walk(nodes: FileNode[]) {
      for (const node of nodes) {
        if (node.type === 'directory') {
          node.isExpanded = true
        }
        if (node.children) {
          walk(node.children)
        }
      }
    }
    walk(fileTree.value)
  }

  function addToRecentFiles(path: string) {
    recentFiles.value = [path, ...recentFiles.value.filter(p => p !== path)].slice(0, 20)
  }

  function toggleStarred(path: string) {
    const index = starredFiles.value.indexOf(path)
    if (index === -1) {
      starredFiles.value.push(path)
    } else {
      starredFiles.value.splice(index, 1)
    }
  }

  function togglePinned(path: string) {
    const index = pinnedFiles.value.indexOf(path)
    if (index === -1) {
      pinnedFiles.value.push(path)
    } else {
      pinnedFiles.value.splice(index, 1)
    }
  }

  function createFile(parentPath: string, name: string) {
    const newNode: FileNode = {
      id: nanoid(),
      name,
      path: `${parentPath}/${name}`,
      type: 'file',
      extension: name.split('.').pop(),
      modifiedAt: new Date().toISOString(),
    }

    function walk(nodes: FileNode[]): boolean {
      for (const node of nodes) {
        if (node.path === parentPath && node.type === 'directory') {
          if (!node.children) node.children = []
          node.children.push(newNode)
          node.isExpanded = true
          return true
        }
        if (node.children && walk(node.children)) {
          return true
        }
      }
      return false
    }

    walk(fileTree.value)
    return newNode
  }

  function createFolder(parentPath: string, name: string) {
    const newNode: FileNode = {
      id: nanoid(),
      name,
      path: `${parentPath}/${name}`,
      type: 'directory',
      isExpanded: false,
      children: [],
    }

    function walk(nodes: FileNode[]): boolean {
      for (const node of nodes) {
        if (node.path === parentPath && node.type === 'directory') {
          if (!node.children) node.children = []
          node.children.push(newNode)
          node.isExpanded = true
          return true
        }
        if (node.children && walk(node.children)) {
          return true
        }
      }
      return false
    }

    walk(fileTree.value)
    return newNode
  }

  function deleteNode(path: string) {
    function walk(nodes: FileNode[]): boolean {
      const index = nodes.findIndex(n => n.path === path)
      if (index !== -1) {
        nodes.splice(index, 1)
        return true
      }
      for (const node of nodes) {
        if (node.children && walk(node.children)) {
          return true
        }
      }
      return false
    }
    walk(fileTree.value)
  }

  function renameNode(oldPath: string, newName: string) {
    function walk(nodes: FileNode[]): boolean {
      for (const node of nodes) {
        if (node.path === oldPath) {
          const parentPath = oldPath.substring(0, oldPath.lastIndexOf('/'))
          node.name = newName
          node.path = `${parentPath}/${newName}`
          if (node.type === 'file') {
            node.extension = newName.split('.').pop()
          }
          return true
        }
        if (node.children && walk(node.children)) {
          return true
        }
      }
      return false
    }
    walk(fileTree.value)
  }

  function findNode(path: string): FileNode | undefined {
    function walk(nodes: FileNode[]): FileNode | undefined {
      for (const node of nodes) {
        if (node.path === path) return node
        if (node.children) {
          const found = walk(node.children)
          if (found) return found
        }
      }
      return undefined
    }
    return walk(fileTree.value)
  }

  return {
    // State
    currentWorkspace,
    workspaces,
    fileTree,
    isLoading,
    recentFiles,
    starredFiles,
    pinnedFiles,
    // Computed
    allFiles,
    allFolders,
    totalFiles,
    totalFolders,
    // Actions
    loadDemoWorkspace,
    toggleFolder,
    expandFolder,
    collapseAll,
    expandAll,
    addToRecentFiles,
    toggleStarred,
    togglePinned,
    createFile,
    createFolder,
    deleteNode,
    renameNode,
    findNode,
  }
})