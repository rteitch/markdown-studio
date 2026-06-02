<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Plugin } from '@/types'
import { nanoid } from 'nanoid'

const searchQuery = ref('')
const activeTab = ref<'installed' | 'marketplace'>('installed')

const installedPlugins = ref<Plugin[]>([])
const marketplacePlugins = ref<Plugin[]>([
  {
    id: 'mermaid-preview',
    name: 'Mermaid Preview',
    version: '1.2.0',
    description: 'Live preview for Mermaid diagrams in the editor',
    author: 'Markdown Studio',
    enabled: true,
    permissions: ['renderer'],
    type: 'renderer',
    entry: 'mermaid-preview.js',
  },
  {
    id: 'git-blame',
    name: 'Git Blame',
    version: '0.9.0',
    description: 'Show git blame information in the editor gutter',
    author: 'Community',
    enabled: false,
    permissions: ['git', 'ui'],
    type: 'editor',
    entry: 'git-blame.js',
  },
  {
    id: 'ai-autocomplete',
    name: 'AI Autocomplete',
    version: '2.1.0',
    description: 'AI-powered code and text autocomplete suggestions',
    author: 'Markdown Studio',
    enabled: false,
    permissions: ['ai', 'network'],
    type: 'ai',
    entry: 'ai-autocomplete.js',
  },
  {
    id: 'katex-renderer',
    name: 'KaTeX Renderer',
    version: '1.0.0',
    description: 'Render KaTeX math expressions in preview',
    author: 'Markdown Studio',
    enabled: true,
    permissions: ['renderer'],
    type: 'renderer',
    entry: 'katex-renderer.js',
  },
  {
    id: 'table-of-contents',
    name: 'Table of Contents',
    version: '1.5.0',
    description: 'Auto-generate table of contents from headings',
    author: 'Community',
    enabled: false,
    permissions: ['editor'],
    type: 'editor',
    entry: 'toc.js',
  },
  {
    id: 'word-count-pro',
    name: 'Word Count Pro',
    version: '0.8.0',
    description: 'Advanced word, character, and reading time statistics',
    author: 'Community',
    enabled: false,
    permissions: ['ui'],
    type: 'sidebar',
    entry: 'word-count.js',
  },
  {
    id: 'export-pdf',
    name: 'Export PDF',
    version: '1.3.0',
    description: 'Export documents to beautifully formatted PDF',
    author: 'Markdown Studio',
    enabled: false,
    permissions: ['read-files'],
    type: 'command',
    entry: 'export-pdf.js',
  },
  {
    id: 'custom-theme',
    name: 'Custom Themes',
    version: '2.0.0',
    description: 'Create and apply custom editor themes',
    author: 'Community',
    enabled: false,
    permissions: ['ui'],
    type: 'theme',
    entry: 'custom-themes.js',
  },
])

const filteredMarketplace = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return marketplacePlugins.value
  return marketplacePlugins.value.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.author.toLowerCase().includes(q)
  )
})

function installPlugin(plugin: Plugin) {
  installedPlugins.value.push({ ...plugin, enabled: true })
  marketplacePlugins.value = marketplacePlugins.value.filter(p => p.id !== plugin.id)
}

function uninstallPlugin(plugin: Plugin) {
  installedPlugins.value = installedPlugins.value.filter(p => p.id !== plugin.id)
  marketplacePlugins.value.push({ ...plugin, enabled: false })
}

function togglePlugin(plugin: Plugin) {
  plugin.enabled = !plugin.enabled
}

function getPluginTypeIcon(type: string) {
  switch (type) {
    case 'sidebar': return '📊'
    case 'command': return '⌨️'
    case 'editor': return '✏️'
    case 'renderer': return '🎨'
    case 'parser': return '📝'
    case 'theme': return '🎭'
    case 'search': return '🔍'
    case 'ai': return '🤖'
    default: return '🧩'
  }
}
</script>

<template>
  <div class="plugin-manager">
    <div class="plugin-header">
      <h3>Plugin Manager</h3>
      <p class="plugin-desc">Extend Markdown Studio X with plugins</p>
    </div>

    <!-- Tabs -->
    <div class="plugin-tabs">
      <button class="tab-btn" :class="{ active: activeTab === 'installed' }" @click="activeTab = 'installed'">
        Installed
        <span class="tab-count" v-if="installedPlugins.length > 0">{{ installedPlugins.length }}</span>
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'marketplace' }" @click="activeTab = 'marketplace'">
        Marketplace
        <span class="tab-count" v-if="filteredMarketplace.length > 0">{{ filteredMarketplace.length }}</span>
      </button>
    </div>

    <!-- Search -->
    <div class="plugin-search" v-if="activeTab === 'marketplace'">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
      </svg>
      <input v-model="searchQuery" type="text" placeholder="Search plugins..." class="search-input" />
    </div>

    <!-- Installed Plugins -->
    <div v-if="activeTab === 'installed'" class="plugin-list scrollable">
      <div v-if="installedPlugins.length === 0" class="empty-state">
        <p>No plugins installed</p>
        <small>Browse the marketplace to find plugins</small>
      </div>
      <div v-for="plugin in installedPlugins" :key="plugin.id" class="plugin-card">
        <div class="plugin-icon">{{ getPluginTypeIcon(plugin.type) }}</div>
        <div class="plugin-info">
          <span class="plugin-name">{{ plugin.name }}</span>
          <span class="plugin-description">{{ plugin.description }}</span>
          <div class="plugin-meta">
            <span class="plugin-version">v{{ plugin.version }}</span>
            <span class="plugin-author">{{ plugin.author }}</span>
          </div>
        </div>
        <div class="plugin-actions">
          <label class="toggle">
            <input type="checkbox" :checked="plugin.enabled" @change="togglePlugin(plugin)" />
            <span class="toggle-slider"></span>
          </label>
          <button class="uninstall-btn" @click="uninstallPlugin(plugin)">Uninstall</button>
        </div>
      </div>
    </div>

    <!-- Marketplace Plugins -->
    <div v-if="activeTab === 'marketplace'" class="plugin-list scrollable">
      <div v-if="filteredMarketplace.length === 0" class="empty-state">
        <p>No plugins found</p>
        <small>Try a different search query</small>
      </div>
      <div v-for="plugin in filteredMarketplace" :key="plugin.id" class="plugin-card">
        <div class="plugin-icon">{{ getPluginTypeIcon(plugin.type) }}</div>
        <div class="plugin-info">
          <span class="plugin-name">{{ plugin.name }}</span>
          <span class="plugin-description">{{ plugin.description }}</span>
          <div class="plugin-meta">
            <span class="plugin-version">v{{ plugin.version }}</span>
            <span class="plugin-author">{{ plugin.author }}</span>
            <span class="plugin-type">{{ plugin.type }}</span>
          </div>
        </div>
        <div class="plugin-actions">
          <button class="install-btn" @click="installPlugin(plugin)">Install</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.plugin-manager {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--editor-bg);
  overflow: hidden;
}

.plugin-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-primary);

  h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-1);
  }
}

.plugin-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.plugin-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-primary);
}

.tab-btn {
  flex: 1;
  padding: var(--space-3);
  font-size: var(--font-size-sm);
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

.tab-count {
  margin-left: 4px;
  padding: 0 5px;
  background: var(--accent-blue);
  color: white;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
}

.plugin-search {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-primary);
  color: var(--text-tertiary);

  .search-input {
    flex: 1;
    font-size: var(--font-size-sm);
    color: var(--text-primary);
    &::placeholder { color: var(--text-muted); }
  }
}

.plugin-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-8);
  text-align: center;

  p { font-size: var(--font-size-sm); color: var(--text-secondary); }
  small { font-size: var(--font-size-xs); color: var(--text-muted); }
}

.plugin-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-surface);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2);
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--border-secondary);
  }
}

.plugin-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.plugin-info {
  flex: 1;
  min-width: 0;
}

.plugin-name {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.plugin-description {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  margin-top: 2px;
}

.plugin-meta {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-1);
}

.plugin-version, .plugin-author, .plugin-type {
  font-size: 10px;
  color: var(--text-muted);
  padding: 0 4px;
  background: var(--bg-tertiary);
  border-radius: 3px;
}

.plugin-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  cursor: pointer;

  input { opacity: 0; width: 0; height: 0; }

  .toggle-slider {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: var(--bg-tertiary);
    border-radius: 10px;
    transition: all var(--transition-fast);
    border: 1px solid var(--border-primary);

    &::before {
      content: '';
      position: absolute;
      height: 14px;
      width: 14px;
      left: 2px;
      bottom: 2px;
      background: var(--text-muted);
      border-radius: 50%;
      transition: all var(--transition-fast);
    }
  }

  input:checked + .toggle-slider {
    background: var(--accent-blue);
    border-color: var(--accent-blue);
    &::before { transform: translateX(16px); background: white; }
  }
}

.install-btn, .uninstall-btn {
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.install-btn {
  background: var(--accent-blue);
  color: white;
  &:hover { opacity: 0.9; }
}

.uninstall-btn {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-primary);
  &:hover { background: var(--accent-red); color: white; border-color: var(--accent-red); }
}
</style>