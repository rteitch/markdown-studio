<script setup lang="ts">
import { ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useEditorStore } from '@/stores/editor'

const ui = useUIStore()
const editor = useEditorStore()

const activeSection = ref('general')

const sections = [
  { id: 'general', label: 'General', icon: '⚙️' },
  { id: 'editor', label: 'Editor', icon: '✏️' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'ai', label: 'AI', icon: '🤖' },
  { id: 'git', label: 'Git', icon: '🔀' },
  { id: 'plugins', label: 'Plugins', icon: '🧩' },
  { id: 'keybindings', label: 'Keybindings', icon: '⌨️' },
]
</script>

<template>
  <div class="settings-view">
    <div class="settings-sidebar">
      <div class="settings-title">Settings</div>
      <button
        v-for="section in sections"
        :key="section.id"
        class="settings-nav-item"
        :class="{ active: activeSection === section.id }"
        @click="activeSection = section.id"
      >
        <span class="nav-icon">{{ section.icon }}</span>
        <span>{{ section.label }}</span>
      </button>
    </div>

    <div class="settings-content scrollable">
      <!-- General Settings -->
      <div v-if="activeSection === 'general'" class="settings-section">
        <h3>General</h3>
        
        <div class="setting-group">
          <div class="setting-item">
            <div class="setting-info">
              <label>Theme</label>
              <span class="setting-desc">Choose your preferred color theme</span>
            </div>
            <select class="setting-select" :value="ui.theme" @change="ui.setTheme($event.target.value)">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Language</label>
              <span class="setting-desc">Interface language</span>
            </div>
            <select class="setting-select">
              <option value="en">English</option>
              <option value="id">Bahasa Indonesia</option>
            </select>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Auto Save</label>
              <span class="setting-desc">Automatically save files after changes</span>
            </div>
            <label class="toggle">
              <input type="checkbox" checked />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Editor Settings -->
      <div v-if="activeSection === 'editor'" class="settings-section">
        <h3>Editor</h3>
        
        <div class="setting-group">
          <div class="setting-item">
            <div class="setting-info">
              <label>Font Size</label>
              <span class="setting-desc">Editor font size in pixels</span>
            </div>
            <input type="number" class="setting-input-sm" :value="editor.editorFontSize" min="10" max="32" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Font Family</label>
              <span class="setting-desc">Editor font family</span>
            </div>
            <input type="text" class="setting-input" :value="editor.editorFontFamily" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Line Height</label>
              <span class="setting-desc">Line height multiplier</span>
            </div>
            <input type="number" class="setting-input-sm" :value="editor.editorLineHeight" min="1" max="3" step="0.1" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Word Wrap</label>
              <span class="setting-desc">Wrap lines at the editor width</span>
            </div>
            <label class="toggle">
              <input type="checkbox" :checked="editor.wordWrap" @change="editor.toggleWordWrap()" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Line Numbers</label>
              <span class="setting-desc">Show line numbers in the editor gutter</span>
            </div>
            <label class="toggle">
              <input type="checkbox" :checked="editor.lineNumbers" @change="editor.toggleLineNumbers()" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Appearance Settings -->
      <div v-if="activeSection === 'appearance'" class="settings-section">
        <h3>Appearance</h3>
        <div class="setting-group">
          <div class="setting-item">
            <div class="setting-info">
              <label>Sidebar Width</label>
              <span class="setting-desc">Width of the sidebar in pixels</span>
            </div>
            <input type="number" class="setting-input-sm" :value="ui.sidebarWidth" min="180" max="500" />
          </div>
        </div>
      </div>

      <!-- AI Settings -->
      <div v-if="activeSection === 'ai'" class="settings-section">
        <h3>AI Assistant</h3>
        <div class="setting-group">
          <div class="setting-item">
            <div class="setting-info">
              <label>AI Provider</label>
              <span class="setting-desc">Choose your AI provider</span>
            </div>
            <select class="setting-select">
              <option value="ollama">Ollama (Local)</option>
              <option value="lmstudio">LM Studio (Local)</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="deepseek">DeepSeek</option>
              <option value="openrouter">OpenRouter</option>
            </select>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>API Key</label>
              <span class="setting-desc">Your API key for the selected provider</span>
            </div>
            <input type="password" class="setting-input" placeholder="sk-..." />
          </div>
        </div>
      </div>

      <!-- Git Settings -->
      <div v-if="activeSection === 'git'" class="settings-section">
        <h3>Git</h3>
        <div class="setting-group">
          <div class="setting-item">
            <div class="setting-info">
              <label>Enable Git</label>
              <span class="setting-desc">Enable Git integration for workspace</span>
            </div>
            <label class="toggle">
              <input type="checkbox" checked />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <label>Auto Commit</label>
              <span class="setting-desc">Automatically commit changes</span>
            </div>
            <label class="toggle">
              <input type="checkbox" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Plugins Settings -->
      <div v-if="activeSection === 'plugins'" class="settings-section">
        <h3>Plugins</h3>
        <p class="section-desc">Manage installed plugins and browse the marketplace</p>
        <div class="plugins-empty">
          <p>No plugins installed</p>
          <button class="btn-primary">Browse Marketplace</button>
        </div>
      </div>

      <!-- Keybindings Settings -->
      <div v-if="activeSection === 'keybindings'" class="settings-section">
        <h3>Keybindings</h3>
        <div class="setting-group">
          <div class="keybinding-item"><span>Command Palette</span><kbd>Ctrl+P</kbd></div>
          <div class="keybinding-item"><span>Save</span><kbd>Ctrl+S</kbd></div>
          <div class="keybinding-item"><span>Toggle Sidebar</span><kbd>Ctrl+B</kbd></div>
          <div class="keybinding-item"><span>Toggle Preview</span><kbd>Ctrl+\</kbd></div>
          <div class="keybinding-item"><span>Toggle Terminal</span><kbd>Ctrl+J</kbd></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-view {
  display: flex;
  flex: 1;
  background: var(--editor-bg);
  overflow: hidden;
}

.settings-sidebar {
  width: 200px;
  padding: var(--space-4);
  border-right: 1px solid var(--border-primary);
  background: var(--bg-secondary);
  flex-shrink: 0;
}

.settings-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-4);
  color: var(--text-primary);
}

.settings-nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-align: left;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  &.active {
    background: var(--bg-active);
    color: var(--accent-blue);
  }
}

.nav-icon {
  font-size: var(--font-size-base);
}

.settings-content {
  flex: 1;
  padding: var(--space-6);
  overflow-y: auto;
}

.settings-section {
  max-width: 600px;
  
  h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin-bottom: var(--space-4);
    color: var(--text-primary);
  }
}

.section-desc {
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
  font-size: var(--font-size-sm);
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  border: 1px solid var(--border-primary);
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 2px;

  label {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--text-primary);
  }

  .setting-desc {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }
}

.setting-select {
  padding: 4px 8px;
  background: var(--bg-input);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  min-width: 160px;
}

.setting-input {
  padding: 4px 8px;
  background: var(--bg-input);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  min-width: 200px;
}

.setting-input-sm {
  padding: 4px 8px;
  background: var(--bg-input);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  width: 80px;
  text-align: center;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  cursor: pointer;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-slider {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: var(--bg-tertiary);
    border-radius: 11px;
    transition: all var(--transition-fast);
    border: 1px solid var(--border-primary);

    &::before {
      content: '';
      position: absolute;
      height: 16px;
      width: 16px;
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

    &::before {
      transform: translateX(18px);
      background: white;
    }
  }
}

.keybinding-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  border: 1px solid var(--border-primary);
  font-size: var(--font-size-sm);

  kbd {
    padding: 2px 8px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
  }
}

.plugins-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-8);
  text-align: center;
  color: var(--text-muted);
}

.btn-primary {
  padding: 6px 16px;
  background: var(--accent-blue);
  color: white;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);

  &:hover {
    opacity: 0.9;
  }
}
</style>