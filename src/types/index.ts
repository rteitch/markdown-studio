// ============================================================
// Markdown Studio X - Core Type Definitions
// ============================================================

// --- Workspace Types ---
export interface Workspace {
  id: string
  name: string
  path: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
  config: WorkspaceConfig
}

export interface WorkspaceConfig {
  defaultNoteFolder: string
  assetFolder: string
  templateFolder: string
  diagramFolder: string
  snippetFolder: string
  scriptsFolder: string
  studioFolder: string
  enableGit: boolean
  enableAI: boolean
  aiProvider: AIProvider
  theme: 'light' | 'dark' | 'system'
  editorFontSize: number
  editorFontFamily: string
  editorLineHeight: number
  autoSave: boolean
  autoSaveDelay: number
}

export type AIProvider = 'ollama' | 'lmstudio' | 'openai' | 'anthropic' | 'grok' | 'deepseek' | 'openrouter'

// --- File System Types ---
export interface FileNode {
  id: string
  name: string
  path: string
  type: 'file' | 'directory'
  extension?: string
  size?: number
  children?: FileNode[]
  isExpanded?: boolean
  parentPath?: string
  createdAt?: string
  modifiedAt?: string
}

export interface FileContent {
  path: string
  content: string
  frontmatter?: Frontmatter
  lastModified: string
  wordCount: number
  charCount: number
  lineCount: number
}

// --- Markdown Types ---
export interface Frontmatter {
  title?: string
  tags?: string[]
  aliases?: string[]
  cssclass?: string
  created?: string
  modified?: string
  author?: string
  description?: string
  status?: 'draft' | 'review' | 'published' | 'archived'
  [key: string]: any
}

export interface WikiLink {
  target: string
  display?: string
  section?: string
  blockId?: string
  fromFile: string
  position: { start: number; end: number }
}

export interface Embed {
  type: 'file' | 'image' | 'heading' | 'block' | 'pdf'
  target: string
  fromFile: string
  position: { start: number; end: number }
}

export interface Tag {
  name: string
  count: number
  files: string[]
  parent?: string
  children?: Tag[]
}

// --- Editor Types ---
export type EditorMode = 'source' | 'split' | 'reader' | 'zen'
export type EditorTheme = 'light' | 'dark'

export interface EditorState {
  mode: EditorMode
  theme: EditorTheme
  currentFile: string | null
  openFiles: OpenFile[]
  activeFileContent: string
  isDirty: boolean
  cursorPosition: { line: number; column: number }
  scrollPosition: number
  wordWrap: boolean
  lineNumbers: boolean
  minimap: boolean
  typewriterMode: boolean
  focusMode: boolean
}

export interface OpenFile {
  path: string
  name: string
  content: string
  isDirty: boolean
  isActive: boolean
  cursorPosition?: { line: number; column: number }
  scrollPosition?: number
}

// --- Knowledge Graph Types ---
export interface GraphNode {
  id: string
  label: string
  type: 'file' | 'folder' | 'tag' | 'attachment' | 'url' | 'heading' | 'block'
  path: string
  size: number
  color: string
  x?: number
  y?: number
  metadata?: Record<string, any>
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  type: 'wikilink' | 'backlink' | 'embed' | 'tag' | 'citation' | 'manual'
  weight: number
  label?: string
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface GraphFilter {
  nodeTypes: GraphNode['type'][]
  edgeTypes: GraphEdge['type'][]
  searchQuery: string
  depth: number
  showOrphans: boolean
  clusterBy: 'none' | 'type' | 'folder' | 'tag'
}

// --- Search Types ---
export type SearchType = 'fulltext' | 'advanced' | 'semantic' | 'ai'

export interface SearchResult {
  id: string
  filePath: string
  fileName: string
  title: string
  excerpt: string
  score: number
  highlights: SearchHighlight[]
  type: SearchType
  matchedAt: string
  tags: string[]
  lastModified: string
}

export interface SearchHighlight {
  field: 'title' | 'content' | 'tags' | 'heading'
  snippet: string
  positions: { start: number; end: number }[]
}

export interface SearchQuery {
  text: string
  type: SearchType
  filters: {
    fileTypes: string[]
    tags: string[]
    dateRange?: { from: string; to: string }
    paths: string[]
    excludePaths: string[]
  }
  options: {
    caseSensitive: boolean
    wholeWord: boolean
    regex: boolean
    maxResults: number
  }
}

// --- Git Types ---
export interface GitStatus {
  branch: string
  ahead: number
  behind: number
  staged: GitFileChange[]
  unstaged: GitFileChange[]
  untracked: string[]
  conflicted: string[]
  isClean: boolean
}

export interface GitFileChange {
  path: string
  status: 'added' | 'modified' | 'deleted' | 'renamed' | 'copied'
  oldPath?: string
}

export interface GitCommit {
  hash: string
  shortHash: string
  message: string
  author: string
  email: string
  date: string
  parents: string[]
}

export interface GitBranch {
  name: string
  current: boolean
  remote?: string
  lastCommit?: GitCommit
}

// --- AI Types ---
export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  context?: AIContext
  tokens?: { input: number; output: number }
}

export interface AIContext {
  type: 'file' | 'selection' | 'folder' | 'workspace' | 'block'
  path?: string
  content?: string
  range?: { start: number; end: number }
}

export interface AIChat {
  id: string
  title: string
  messages: AIMessage[]
  createdAt: string
  updatedAt: string
  context?: AIContext
}

export interface AIAction {
  id: string
  name: string
  icon: string
  description: string
  prompt: string
  category: 'writing' | 'knowledge' | 'code' | 'documentation'
}

// --- Publishing Types ---
export interface PublishTarget {
  id: string
  name: string
  type: 'static-site' | 'github-pages' | 'cloudflare' | 'netlify' | 'vercel' | 'pdf' | 'gitbook'
  config: Record<string, any>
  lastPublished?: string
}

export interface PublishConfig {
  target: PublishTarget
  sourcePath: string
  outputPath: string
  include: string[]
  exclude: string[]
  options: {
    title: string
    description: string
    baseUrl: string
    theme: string
    sidebar: boolean
    search: boolean
    editLink: boolean
    lastUpdated: boolean
  }
}

// --- Plugin Types ---
export interface Plugin {
  id: string
  name: string
  version: string
  description: string
  author: string
  enabled: boolean
  permissions: PluginPermission[]
  type: PluginType
  entry: string
  config?: Record<string, any>
}

export type PluginType = 'sidebar' | 'command' | 'editor' | 'renderer' | 'parser' | 'theme' | 'search' | 'ai'

export type PluginPermission = 'read-files' | 'write-files' | 'network' | 'ai' | 'git' | 'ui' | 'renderer' | 'editor' | 'parser'

// --- UI State Types ---
export interface UIState {
  sidebar: {
    visible: boolean
    width: number
    activePanel: 'files' | 'graph' | 'search' | 'git' | 'ai' | 'plugins'
  }
  rightPanel: {
    visible: boolean
    width: number
    activePanel: 'preview' | 'outline' | 'backlinks' | 'ai-chat' | 'properties'
  }
  bottomPanel: {
    visible: boolean
    height: number
    activePanel: 'terminal' | 'output' | 'problems' | 'git'
  }
  commandPalette: {
    visible: boolean
    query: string
  }
  modal: {
    visible: boolean
    component: string | null
    props?: Record<string, any>
  }
  notifications: Notification[]
  theme: 'light' | 'dark' | 'system'
  locale: string
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message?: string
  timestamp: string
  read: boolean
  actions?: { label: string; action: string }[]
}

// --- Template Types ---
export interface Template {
  id: string
  name: string
  description: string
  content: string
  frontmatter?: Frontmatter
  variables: TemplateVariable[]
  category: string
  icon: string
}

export interface TemplateVariable {
  name: string
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'tags'
  label: string
  default?: any
  options?: string[]
  required: boolean
}

// --- Snippet Types ---
export interface Snippet {
  id: string
  name: string
  prefix: string
  content: string
  description: string
  scope: string[]
  variables: { name: string; default: string }[]
}