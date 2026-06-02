import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GitStatus, GitCommit, GitBranch, GitFileChange } from '@/types'
import { nanoid } from 'nanoid'

export const useGitStore = defineStore('git', () => {
  // --- State ---
  const isInitialized = ref(true)
  const status = ref<GitStatus>({
    branch: 'main',
    ahead: 0,
    behind: 0,
    staged: [],
    unstaged: [],
    untracked: [],
    conflicted: [],
    isClean: true,
  })
  const branches = ref<GitBranch[]>([
    { name: 'main', current: true, remote: 'origin/main' },
    { name: 'feature/ai-integration', current: false },
    { name: 'feature/publishing', current: false },
  ])
  const commits = ref<GitCommit[]>([
    {
      hash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
      shortHash: 'a1b2c3d',
      message: 'feat: add Markdown Studio X welcome page',
      author: 'Developer',
      email: 'dev@markdownstudio.x',
      date: '2026-06-02T12:00:00Z',
      parents: [],
    },
    {
      hash: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
      shortHash: 'b2c3d4e',
      message: 'docs: add architecture documentation',
      author: 'Developer',
      email: 'dev@markdownstudio.x',
      date: '2026-06-01T15:00:00Z',
      parents: ['a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2'],
    },
    {
      hash: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
      shortHash: 'c3d4e5f',
      message: 'initial: project setup with Vue 3 + TypeScript',
      author: 'Developer',
      email: 'dev@markdownstudio.x',
      date: '2026-06-02T00:00:00Z',
      parents: [],
    },
  ])
  const isLoading = ref(false)
  const diffContent = ref<string | null>(null)

  // --- Computed ---
  const currentBranch = computed(() => branches.value.find(b => b.current)?.name || 'main')
  const hasChanges = computed(() => !status.value.isClean)
  const totalChanges = computed(() =>
    status.value.staged.length +
    status.value.unstaged.length +
    status.value.untracked.length
  )
  const recentCommits = computed(() => commits.value.slice(0, 50))

  // --- Actions ---
  function refreshStatus() {
    isLoading.value = true
    // Demo: simulate status
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  }

  function stageFile(path: string) {
    const index = status.value.unstaged.findIndex(f => f.path === path)
    if (index !== -1) {
      const file = status.value.unstaged.splice(index, 1)[0]
      status.value.staged.push(file)
    }
    const untrackedIndex = status.value.untracked.indexOf(path)
    if (untrackedIndex !== -1) {
      status.value.untracked.splice(untrackedIndex, 1)
      status.value.staged.push({ path, status: 'added' })
    }
    status.value.isClean = status.value.staged.length === 0 &&
                          status.value.unstaged.length === 0 &&
                          status.value.untracked.length === 0
  }

  function unstageFile(path: string) {
    const index = status.value.staged.findIndex(f => f.path === path)
    if (index !== -1) {
      const file = status.value.staged.splice(index, 1)[0]
      if (file.status === 'added') {
        status.value.untracked.push(path)
      } else {
        status.value.unstaged.push(file)
      }
    }
    status.value.isClean = false
  }

  function stageAll() {
    status.value.staged.push(...status.value.unstaged)
    for (const path of status.value.untracked) {
      status.value.staged.push({ path, status: 'added' })
    }
    status.value.unstaged = []
    status.value.untracked = []
    status.value.isClean = true
  }

  function unstageAll() {
    status.value.unstaged.push(...status.value.staged.filter(f => f.status !== 'added'))
    const addedFiles = status.value.staged.filter(f => f.status === 'added')
    for (const f of addedFiles) {
      status.value.untracked.push(f.path)
    }
    status.value.staged = []
    status.value.isClean = false
  }

  function commit(message: string) {
    if (!message.trim()) return
    if (status.value.staged.length === 0) return

    const newCommit: GitCommit = {
      hash: nanoid(40),
      shortHash: nanoid(7),
      message,
      author: 'Developer',
      email: 'dev@markdownstudio.x',
      date: new Date().toISOString(),
      parents: commits.value.length > 0 ? [commits.value[0].hash] : [],
    }

    commits.value.unshift(newCommit)
    status.value.staged = []
    status.value.isClean = status.value.unstaged.length === 0 && status.value.untracked.length === 0
  }

  function switchBranch(name: string) {
    branches.value.forEach(b => {
      b.current = b.name === name
    })
    status.value.branch = name
  }

  function createBranch(name: string) {
    branches.value.push({
      name,
      current: false,
    })
  }

  function deleteBranch(name: string) {
    if (name === 'main') return
    const index = branches.value.findIndex(b => b.name === name)
    if (index !== -1) {
      branches.value.splice(index, 1)
    }
  }

  function showDiff(path: string) {
    // Demo diff
    diffContent.value = `--- a/${path}
+++ b/${path}
@@ -1,3 +1,4 @@
 # Hello World
 
 This is a test file.
+New line added.`
  }

  function clearDiff() {
    diffContent.value = null
  }

  // Simulate some demo changes
  function loadDemoChanges() {
    status.value = {
      branch: 'main',
      ahead: 0,
      behind: 0,
      staged: [],
      unstaged: [
        { path: 'docs/Getting Started.md', status: 'modified' },
        { path: 'notes/Ideas.md', status: 'modified' },
      ],
      untracked: [
        'notes/New Note.md',
      ],
      conflicted: [],
      isClean: false,
    }
  }

  return {
    // State
    isInitialized,
    status,
    branches,
    commits,
    isLoading,
    diffContent,
    // Computed
    currentBranch,
    hasChanges,
    totalChanges,
    recentCommits,
    // Actions
    refreshStatus,
    stageFile,
    unstageFile,
    stageAll,
    unstageAll,
    commit,
    switchBranch,
    createBranch,
    deleteBranch,
    showDiff,
    clearDiff,
    loadDemoChanges,
  }
})