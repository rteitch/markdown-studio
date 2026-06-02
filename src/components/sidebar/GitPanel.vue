<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGitStore } from '@/stores/git'
import { useEditorStore } from '@/stores/editor'

const git = useGitStore()
const editor = useEditorStore()
const commitMessage = ref('')
const activeTab = ref<'changes' | 'history'>('changes')

onMounted(() => {
  git.loadDemoChanges()
})

function getFileStatusColor(status: string) {
  switch (status) {
    case 'added': return 'var(--accent-green)'
    case 'modified': return 'var(--accent-yellow)'
    case 'deleted': return 'var(--accent-red)'
    case 'renamed': return 'var(--accent-blue)'
    default: return 'var(--text-secondary)'
  }
}

function getFileStatusIcon(status: string) {
  switch (status) {
    case 'added': return 'A'
    case 'modified': return 'M'
    case 'deleted': return 'D'
    case 'renamed': return 'R'
    default: return '?'
  }
}

function handleCommit() {
  if (commitMessage.value.trim()) {
    git.commit(commitMessage.value)
    commitMessage.value = ''
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}
</script>

<template>
  <div class="git-panel">
    <!-- Git Header -->
    <div class="git-header">
      <div class="git-branch">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" />
          <path d="M13 6h3a2 2 0 0 1 2 2v7" /><line x1="6" y1="9" x2="6" y2="21" />
        </svg>
        <select class="branch-select" :value="git.currentBranch" @change="git.switchBranch(($event.target as HTMLSelectElement).value)">
          <option v-for="branch in git.branches" :key="branch.name" :value="branch.name">{{ branch.name }}</option>
        </select>
      </div>
      <div class="git-actions">
        <button class="git-action-btn" title="Pull" @click="git.refreshStatus()">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <polyline points="6 14 12 20 18 14" />
          </svg>
        </button>
        <button class="git-action-btn" title="Push">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
          </svg>
        </button>
        <button class="git-action-btn" title="Refresh" @click="git.refreshStatus()">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="git-tabs">
      <button
        class="git-tab"
        :class="{ active: activeTab === 'changes' }"
        @click="activeTab = 'changes'"
      >
        Changes
        <span class="tab-badge" v-if="git.totalChanges > 0">{{ git.totalChanges }}</span>
      </button>
      <button
        class="git-tab"
        :class="{ active: activeTab === 'history' }"
        @click="activeTab = 'history'"
      >
        History
      </button>
    </div>

    <!-- Changes Tab -->
    <div v-if="activeTab === 'changes'" class="git-content scrollable">
      <!-- Staged Changes -->
      <div v-if="git.status.staged.length > 0" class="change-section">
        <div class="section-header">
          <span class="section-label">Staged Changes</span>
          <button class="unstage-all-btn" @click="git.unstageAll()">Unstage All</button>
        </div>
        <div
          v-for="file in git.status.staged"
          :key="file.path"
          class="change-item"
          @click="git.showDiff(file.path)"
        >
          <span class="file-status" :style="{ color: getFileStatusColor(file.status) }">
            {{ getFileStatusIcon(file.status) }}
          </span>
          <span class="file-path">{{ file.path.split('/').pop() }}</span>
          <button class="unstage-btn" @click.stop="git.unstageFile(file.path)" title="Unstage">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Unstaged Changes -->
      <div v-if="git.status.unstaged.length > 0" class="change-section">
        <div class="section-header">
          <span class="section-label">Changes</span>
          <button class="stage-all-btn" @click="git.stageAll()">Stage All</button>
        </div>
        <div
          v-for="file in git.status.unstaged"
          :key="file.path"
          class="change-item"
          @click="git.showDiff(file.path)"
        >
          <span class="file-status" :style="{ color: getFileStatusColor(file.status) }">
            {{ getFileStatusIcon(file.status) }}
          </span>
          <span class="file-path">{{ file.path.split('/').pop() }}</span>
          <button class="stage-btn" @click.stop="git.stageFile(file.path)" title="Stage">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="5 9 2 12 5 15" /><polyline points="9 5 12 2 15 5" />
              <polyline points="15 19 12 22 9 19" /><polyline points="19 9 22 12 19 15" />
              <line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Untracked Files -->
      <div v-if="git.status.untracked.length > 0" class="change-section">
        <div class="section-header">
          <span class="section-label">Untracked Files</span>
        </div>
        <div
          v-for="path in git.status.untracked"
          :key="path"
          class="change-item"
        >
          <span class="file-status" style="color: var(--accent-green)">U</span>
          <span class="file-path">{{ path.split('/').pop() }}</span>
          <button class="stage-btn" @click="git.stageFile(path)" title="Stage">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- No Changes -->
      <div v-if="git.status.isClean" class="no-changes">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>No changes</span>
      </div>

      <!-- Commit Box -->
      <div class="commit-box" v-if="git.status.staged.length > 0">
        <textarea
          v-model="commitMessage"
          class="commit-input"
          placeholder="Commit message..."
          rows="2"
        ></textarea>
        <button class="commit-btn" @click="handleCommit" :disabled="!commitMessage.trim()">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Commit
        </button>
      </div>

      <!-- Diff View -->
      <div v-if="git.diffContent" class="diff-view">
        <div class="diff-header">
          <span>Diff</span>
          <button class="close-btn" @click="git.clearDiff()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <pre class="diff-content">{{ git.diffContent }}</pre>
      </div>
    </div>

    <!-- History Tab -->
    <div v-if="activeTab === 'history'" class="git-content scrollable">
      <div
        v-for="commit in git.recentCommits"
        :key="commit.hash"
        class="commit-item"
      >
        <div class="commit-dot"></div>
        <div class="commit-info">
          <span class="commit-msg">{{ commit.message }}</span>
          <div class="commit-meta">
            <span class="commit-hash">{{ commit.shortHash }}</span>
            <span class="commit-date">{{ formatDate(commit.date) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.git-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.git-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--border-primary);
}

.git-branch {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--accent-blue);

  svg { flex-shrink: 0; }
}

.branch-select {
  background: transparent;
  border: none;
  color: var(--accent-blue);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  padding: 0;

  option {
    background: var(--bg-surface);
    color: var(--text-primary);
  }
}

.git-actions {
  display: flex;
  gap: var(--space-1);
}

.git-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  transition: all var(--transition-fast);

  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
}

.git-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-primary);
}

.git-tab {
  flex: 1;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--text-secondary);
  text-align: center;
  position: relative;
  transition: all var(--transition-fast);

  &:hover { color: var(--text-primary); }
  
  &.active {
    color: var(--accent-blue);
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--accent-blue);
    }
  }
}

.tab-badge {
  margin-left: 4px;
  padding: 0 5px;
  background: var(--accent-blue);
  color: white;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
}

.git-content {
  flex: 1;
  overflow-y: auto;
}

.change-section {
  border-bottom: 1px solid var(--border-primary);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
}

.section-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
}

.stage-all-btn, .unstage-all-btn {
  font-size: 10px;
  color: var(--text-muted);
  padding: 1px 6px;
  border-radius: var(--radius-sm);

  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
}

.change-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 3px var(--space-3);
  padding-left: var(--space-4);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  transition: background var(--transition-fast);

  &:hover {
    background: var(--bg-hover);
    
    .stage-btn, .unstage-btn { opacity: 1; }
  }
}

.file-status {
  font-size: 10px;
  font-weight: 700;
  font-family: var(--font-mono);
  flex-shrink: 0;
  width: 12px;
  text-align: center;
}

.file-path {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stage-btn, .unstage-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  opacity: 0;
  flex-shrink: 0;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--bg-active);
    color: var(--accent-blue);
  }
}

.no-changes {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-6);
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}

.commit-box {
  padding: var(--space-2) var(--space-3);
  border-top: 1px solid var(--border-primary);
}

.commit-input {
  width: 100%;
  padding: var(--space-2);
  background: var(--bg-surface);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  resize: none;
  margin-bottom: var(--space-2);

  &::placeholder { color: var(--text-muted); }
}

.commit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  width: 100%;
  padding: var(--space-2);
  background: var(--accent-green);
  color: #000;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  transition: all var(--transition-fast);

  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.diff-view {
  border-top: 1px solid var(--border-primary);
}

.diff-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);

  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
}

.diff-content {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-xs);
  font-family: var(--font-mono);
  color: var(--text-secondary);
  white-space: pre-wrap;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}

.commit-item {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  cursor: pointer;
  transition: background var(--transition-fast);

  &:hover { background: var(--bg-hover); }
}

.commit-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-purple);
  flex-shrink: 0;
  margin-top: 4px;
}

.commit-info {
  flex: 1;
  min-width: 0;
}

.commit-msg {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.commit-meta {
  display: flex;
  gap: var(--space-2);
  margin-top: 2px;
}

.commit-hash {
  font-size: var(--font-size-xs);
  font-family: var(--font-mono);
  color: var(--accent-purple);
}

.commit-date {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}
</style>