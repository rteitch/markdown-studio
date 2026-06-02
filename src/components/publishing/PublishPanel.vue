<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWorkspaceStore } from '@/stores/workspace'
import type { PublishTarget } from '@/types'
import { nanoid } from 'nanoid'

const workspace = useWorkspaceStore()
const selectedTarget = ref<string | null>(null)
const isPublishing = ref(false)
const publishLog = ref<string[]>([])

const targets: PublishTarget[] = [
  { id: 'vitepress', name: 'VitePress', type: 'static-site', config: {} },
  { id: 'docusaurus', name: 'Docusaurus', type: 'static-site', config: {} },
  { id: 'mkdocs', name: 'MkDocs Material', type: 'static-site', config: {} },
  { id: 'hugo', name: 'Hugo', type: 'static-site', config: {} },
  { id: 'github-pages', name: 'GitHub Pages', type: 'github-pages', config: {} },
  { id: 'cloudflare', name: 'Cloudflare Pages', type: 'cloudflare', config: {} },
  { id: 'netlify', name: 'Netlify', type: 'netlify', config: {} },
  { id: 'vercel', name: 'Vercel', type: 'vercel', config: {} },
  { id: 'pdf', name: 'PDF Export', type: 'pdf', config: {} },
  { id: 'gitbook', name: 'GitBook', type: 'gitbook', config: {} },
]

function getTargetIcon(type: string) {
  switch (type) {
    case 'static-site': return '🌐'
    case 'github-pages': return '🐙'
    case 'cloudflare': return '☁️'
    case 'netlify': return '🔷'
    case 'vercel': return '▲'
    case 'pdf': return '📄'
    case 'gitbook': return '📖'
    default: return '📦'
  }
}

function getTargetCategory(type: string) {
  switch (type) {
    case 'static-site': return 'Static Site Generators'
    case 'github-pages': case 'cloudflare': case 'netlify': case 'vercel': return 'Hosting Platforms'
    case 'pdf': case 'gitbook': return 'Document Formats'
    default: return 'Other'
  }
}

const groupedTargets = computed(() => {
  const groups: Record<string, PublishTarget[]> = {}
  for (const target of targets) {
    const cat = getTargetCategory(target.type)
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(target)
  }
  return groups
})

async function handlePublish() {
  if (!selectedTarget.value) return
  isPublishing.value = true
  publishLog.value = []

  const steps = [
    'Preparing workspace...',
    'Scanning markdown files...',
    'Processing frontmatter...',
    'Generating table of contents...',
    'Building static assets...',
    'Optimizing images...',
    'Generating HTML pages...',
    'Creating sitemap...',
    'Uploading to hosting...',
    'Publish complete! ✅',
  ]

  for (const step of steps) {
    await new Promise(r => setTimeout(r, 500))
    publishLog.value.push(`[${new Date().toLocaleTimeString()}] ${step}`)
  }

  isPublishing.value = false
}

const selectedTargetName = computed(() => targets.find(t => t.id === selectedTarget.value)?.name)
</script>

<template>
  <div class="publish-panel">
    <div class="publish-header">
      <h3>Publishing Engine</h3>
      <p class="publish-desc">Publish your workspace to various platforms</p>
    </div>

    <!-- Target Selection -->
    <div class="target-groups">
      <div v-for="(groupTargets, category) in groupedTargets" :key="category" class="target-group">
        <div class="group-label">{{ category }}</div>
        <div class="target-grid">
          <button
            v-for="target in groupTargets"
            :key="target.id"
            class="target-card"
            :class="{ selected: selectedTarget === target.id }"
            @click="selectedTarget = target.id"
          >
            <span class="target-icon">{{ getTargetIcon(target.type) }}</span>
            <span class="target-name">{{ target.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Publish Actions -->
    <div class="publish-actions" v-if="selectedTarget">
      <div class="selected-target">
        <span>Publishing to: <strong>{{ selectedTargetName }}</strong></span>
      </div>
      <div class="publish-options">
        <label class="option-item">
          <input type="checkbox" checked />
          <span>Include all files</span>
        </label>
        <label class="option-item">
          <input type="checkbox" checked />
          <span>Generate search index</span>
        </label>
        <label class="option-item">
          <input type="checkbox" />
          <span>Draft mode (include drafts)</span>
        </label>
      </div>
      <button
        class="publish-btn"
        :disabled="isPublishing"
        @click="handlePublish"
      >
        <span v-if="isPublishing" class="spinner"></span>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        {{ isPublishing ? 'Publishing...' : `Publish to ${selectedTargetName}` }}
      </button>
    </div>

    <!-- Publish Log -->
    <div v-if="publishLog.length > 0" class="publish-log">
      <div class="log-header">
        <span>Publish Log</span>
        <button class="clear-log-btn" @click="publishLog = []">Clear</button>
      </div>
      <div class="log-content scrollable">
        <div v-for="(line, i) in publishLog" :key="i" class="log-line">{{ line }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.publish-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--editor-bg);
  overflow-y: auto;
}

.publish-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-primary);

  h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-1);
  }
}

.publish-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.target-groups {
  padding: var(--space-4) var(--space-6);
}

.target-group {
  margin-bottom: var(--space-4);
}

.group-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
}

.target-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--space-2);
}

.target-card {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--bg-surface);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--accent-blue);
    background: rgba(137, 180, 250, 0.05);
  }

  &.selected {
    border-color: var(--accent-blue);
    background: rgba(137, 180, 250, 0.1);
    box-shadow: 0 0 0 1px var(--accent-blue);
  }
}

.target-icon { font-size: 18px; }
.target-name { font-size: var(--font-size-sm); color: var(--text-primary); }

.publish-actions {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border-primary);
}

.selected-target {
  margin-bottom: var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  strong { color: var(--accent-blue); }
}

.publish-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.option-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  cursor: pointer;

  input {
    accent-color: var(--accent-blue);
    width: 16px;
    height: 16px;
  }
}

.publish-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-3);
  background: var(--accent-blue);
  color: white;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  transition: all var(--transition-fast);

  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.publish-log {
  margin: var(--space-4) var(--space-6);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.log-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-primary);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
}

.clear-log-btn {
  font-size: 10px;
  color: var(--text-muted);
  &:hover { color: var(--text-primary); }
}

.log-content {
  max-height: 200px;
  padding: var(--space-2);
  background: var(--bg-tertiary);
}

.log-line {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--accent-green);
  padding: 1px 0;
}
</style>