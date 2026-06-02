<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import type { AIMessage, AIChat, AIAction } from '@/types'
import { nanoid } from 'nanoid'

const editor = useEditorStore()
const messages = ref<AIMessage[]>([])
const inputText = ref('')
const isLoading = ref(false)
const chatContainer = ref<HTMLDivElement | null>(null)
const activeChat = ref<AIChat | null>(null)

// Demo AI actions
const actions: AIAction[] = [
  { id: 'rewrite', name: 'Rewrite', icon: '✏️', description: 'Rewrite selected text', prompt: 'Rewrite this text to be clearer and more concise:', category: 'writing' },
  { id: 'expand', name: 'Expand', icon: '📝', description: 'Expand selected text', prompt: 'Expand on this text with more detail:', category: 'writing' },
  { id: 'summarize', name: 'Summarize', icon: '📋', description: 'Summarize the content', prompt: 'Summarize the following content:', category: 'writing' },
  { id: 'tone', name: 'Tone Adjust', icon: '🎭', description: 'Adjust the writing tone', prompt: 'Rewrite this with a professional tone:', category: 'writing' },
  { id: 'translate', name: 'Translate', icon: '🌐', description: 'Translate to another language', prompt: 'Translate this to English:', category: 'writing' },
  { id: 'explain', name: 'Explain Code', icon: '💡', description: 'Explain selected code', prompt: 'Explain what this code does:', category: 'code' },
  { id: 'refactor', name: 'Refactor', icon: '🔧', description: 'Refactor selected code', prompt: 'Refactor this code for better readability:', category: 'code' },
  { id: 'api-docs', name: 'API Docs', icon: '📖', description: 'Generate API documentation', prompt: 'Generate API documentation for:', category: 'documentation' },
  { id: 'adr', name: 'ADR', icon: '🏗️', description: 'Create Architecture Decision Record', prompt: 'Create an ADR for:', category: 'documentation' },
]

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return

  // Add user message
  messages.value.push({
    id: nanoid(),
    role: 'user',
    content: text,
    timestamp: new Date().toISOString(),
    context: editor.currentFile ? {
      type: 'file',
      path: editor.currentFile,
      content: editor.activeFileContent?.substring(0, 500),
    } : undefined,
  })

  inputText.value = ''
  isLoading.value = true
  scrollToBottom()

  // Simulate AI response (demo)
  setTimeout(() => {
    const responses: Record<string, string> = {
      'default': `I understand your question about "${text}". In a production environment, this would connect to your configured AI provider (Ollama, OpenAI, Anthropic, etc.) to generate intelligent responses based on your workspace content.\n\nCurrent file: ${editor.currentFile || 'None selected'}\nWord count: ${editor.wordCount}`,
      'help': `Here are some things I can help with:\n\n• **Writing**: Rewrite, expand, summarize, adjust tone\n• **Code**: Explain, refactor, debug, generate\n• **Documentation**: API docs, ADR, SOP\n• **Knowledge**: Search across your workspace\n\nTry selecting some text in the editor and use the action buttons below!`,
    }

    const response = text.toLowerCase().includes('help') ? responses['help'] : responses['default']

    messages.value.push({
      id: nanoid(),
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
      tokens: { input: text.length, output: response.length },
    })

    isLoading.value = false
    scrollToBottom()
  }, 1000)
}

function executeAction(action: AIAction) {
  inputText.value = action.prompt + (editor.activeFileContent ? '\n\n' + editor.activeFileContent.substring(0, 200) : '')
  sendMessage()
}

function clearChat() {
  messages.value = []
}

const messageCount = computed(() => messages.value.length)
</script>

<template>
  <div class="ai-chat-panel">
    <!-- Header -->
    <div class="chat-header">
      <div class="header-left">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2a4 4 0 0 1 4 4v1a1 1 0 0 0 1 1h1a4 4 0 0 1 0 8h-1a1 1 0 0 0-1 1v1a4 4 0 0 1-8 0v-1a1 1 0 0 0-1-1H6a4 4 0 0 1 0-8h1a1 1 0 0 0 1-1V6a4 4 0 0 1 4-4z" />
          <circle cx="12" cy="12" r="1" />
        </svg>
        <span class="header-title">AI Assistant</span>
        <span class="message-count" v-if="messageCount > 0">{{ messageCount }}</span>
      </div>
      <div class="header-actions">
        <button class="action-btn" title="Clear Chat" @click="clearChat()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <button
        v-for="action in actions"
        :key="action.id"
        class="quick-action-btn"
        :title="action.description"
        @click="executeAction(action)"
      >
        <span class="action-icon">{{ action.icon }}</span>
        <span class="action-name">{{ action.name }}</span>
      </button>
    </div>

    <!-- Messages -->
    <div ref="chatContainer" class="chat-messages scrollable">
      <div v-if="messages.length === 0" class="welcome-message">
        <div class="welcome-icon">🤖</div>
        <h4>AI Assistant</h4>
        <p>Ask me anything about your workspace, or use the quick actions above.</p>
        <div class="welcome-hints">
          <div class="hint" @click="inputText = 'Help me write better documentation'; sendMessage()">
            💡 Help me write better documentation
          </div>
          <div class="hint" @click="inputText = 'Explain the current file'; sendMessage()">
            📖 Explain the current file
          </div>
          <div class="hint" @click="inputText = 'Summarize my workspace'; sendMessage()">
            📋 Summarize my workspace
          </div>
        </div>
      </div>

      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message"
        :class="msg.role"
      >
        <div class="message-avatar">
          <span v-if="msg.role === 'user'">👤</span>
          <span v-else>🤖</span>
        </div>
        <div class="message-content">
          <div class="message-text" v-html="msg.content.replace(/\n/g, '<br>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')"></div>
          <div class="message-meta">
            <span class="message-time">{{ new Date(msg.timestamp).toLocaleTimeString() }}</span>
            <span v-if="msg.tokens" class="message-tokens">{{ msg.tokens.output }} chars</span>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="message assistant loading">
        <div class="message-avatar">🤖</div>
        <div class="message-content">
          <div class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="chat-input-wrapper">
      <div class="input-context" v-if="editor.currentFile">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span>{{ editor.currentFile.split('/').pop() }}</span>
      </div>
      <textarea
        v-model="inputText"
        class="chat-input"
        placeholder="Ask AI anything... (Enter to send)"
        rows="2"
        @keydown.enter.exact.prevent="sendMessage"
      ></textarea>
      <button
        class="send-btn"
        :disabled="!inputText.trim() || isLoading"
        @click="sendMessage"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ai-chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-secondary);
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--accent-purple);
}

.header-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.message-count {
  font-size: 10px;
  background: var(--accent-purple);
  color: white;
  padding: 0 5px;
  border-radius: 8px;
}

.header-actions {
  display: flex;
  gap: var(--space-1);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  &:hover { background: var(--bg-hover); color: var(--text-primary); }
}

.quick-actions {
  display: flex;
  gap: var(--space-1);
  padding: var(--space-2);
  overflow-x: auto;
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-primary);

  &::-webkit-scrollbar { height: 0; }
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: var(--bg-surface);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--accent-purple);
    color: var(--accent-purple);
    background: rgba(203, 166, 247, 0.1);
  }
}

.action-icon { font-size: 11px; }
.action-name { font-size: 11px; }

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-3);
}

.welcome-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-6) var(--space-4);
  gap: var(--space-3);

  .welcome-icon { font-size: 32px; }
  
  h4 {
    font-size: var(--font-size-base);
    color: var(--text-primary);
  }
  
  p {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
    max-width: 280px;
  }
}

.welcome-hints {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  width: 100%;
  max-width: 280px;
}

.hint {
  padding: var(--space-2) var(--space-3);
  background: var(--bg-surface);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  cursor: pointer;
  text-align: left;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--accent-purple);
    background: rgba(203, 166, 247, 0.05);
  }
}

.message {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-3);

  &.user {
    flex-direction: row-reverse;
    .message-content { align-items: flex-end; }
    .message-text {
      background: var(--accent-blue);
      color: white;
      border-radius: var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg);
    }
  }

  &.assistant .message-text {
    background: var(--bg-surface);
    color: var(--text-primary);
    border-radius: var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm);
  }
}

.message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  min-width: 0;
}

.message-text {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  word-wrap: break-word;

  :deep(strong) { font-weight: 600; }
}

.message-meta {
  display: flex;
  gap: var(--space-2);
  margin-top: 2px;
  padding: 0 var(--space-1);
}

.message-time, .message-tokens {
  font-size: 10px;
  color: var(--text-muted);
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: var(--space-3);

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-muted);
    animation: typing 1.4s infinite;
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-4px); opacity: 1; }
}

.chat-input-wrapper {
  padding: var(--space-2);
  border-top: 1px solid var(--border-primary);
  flex-shrink: 0;
}

.input-context {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: 2px var(--space-2);
  margin-bottom: var(--space-1);
  font-size: 10px;
  color: var(--text-muted);
  svg { color: var(--accent-blue); }
}

.chat-input {
  width: 100%;
  padding: var(--space-2);
  background: var(--bg-surface);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  resize: none;
  line-height: 1.4;

  &::placeholder { color: var(--text-muted); }
  &:focus { border-color: var(--accent-purple); }
}

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: var(--space-2);
  margin-top: var(--space-1);
  background: var(--accent-purple);
  color: white;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);

  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}
</style>