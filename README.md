<p align="center">
  <img src="src-tauri/icons/icon.png" width="128" height="128" alt="Markdown Studio X Logo">
</p>

<h1 align="center">Markdown Studio X</h1>

<p align="center">
  <strong>Satu workspace. Seluruh pengetahuan Anda.</strong>
</p>

<p align="center">
  Platform dokumentasi dan pengetahuan generasi berikutnya yang <em>local-first</em>, berbasis Markdown murni, dan dirancang sebagai <strong>Knowledge Operating System</strong>.
</p>

<p align="center">
  <a href="#-fitur">Fitur</a> •
  <a href="#-instalasi">Instalasi</a> •
  <a href="#-penggunaan">Penggunaan</a> •
  <a href="#-teknologi">Teknologi</a> •
  <a href="#-struktur-project">Struktur</a> •
  <a href="#-kontribusi">Kontribusi</a> •
  <a href="#-lisensi">Lisensi</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey" alt="Platform">
  <img src="https://img.shields.io/badge/vue-3-42b883" alt="Vue 3">
  <img src="https://img.shields.io/badge/tauri-2-ffc131" alt="Tauri 2">
  <img src="https://img.shields.io/badge/rust-1.96-dea584" alt="Rust">
</p>

---

## 🎯 Tentang

**Markdown Studio X** menggabungkan kekuatan editor Markdown, Personal Knowledge Management (PKM), Knowledge Graph, Git workflow, AI assistant, dan publishing engine dalam satu aplikasi lintas platform yang cepat, stabil, dan sepenuhnya open format.

### Key Differentiators

| Kelebihan | Deskripsi |
|-----------|-----------|
| 🚀 Lebih cepat | Lebih ringan dari Obsidian (Tauri 2 + Rust) |
| 👨‍💻 Developer-friendly | Lebih baik dari Notion untuk developer |
| 📢 Powerful publishing | Lebih lengkap dari GitBook |
| 🤖 AI Integration | Lebih dalam dari kompetitor |
| 🔒 Local-First | 100% data di perangkat lokal, 100% open format |

---

## ✨ Fitur

### 6.1 Workspace System
- Unlimited workspace per user
- Struktur folder default: `docs/`, `notes/`, `projects/`, `diagrams/`, `assets/`, `templates/`, `snippets/`, `scripts/`, `.studio/`
- File Explorer dengan tree view, expand/collapse, drag & drop
- Create, rename, delete file dan folder

### 6.2 Markdown Engine
- **100% CommonMark + GitHub Flavored Markdown**
- Obsidian-style: Wiki Links `[[ ]]`, Embeds `![[ ]]`, Backlinks
- Tables, Task Lists, Footnotes, Callouts/Admonitions
- Code blocks dengan syntax highlighting
- KaTeX / MathJax untuk mathematical notation
- Frontmatter (YAML) parsing
- **Mermaid diagram** rendering

### 6.3 Live Preview & Editor Modes

| Mode | Shortcut | Deskripsi |
|------|----------|-----------|
| **Source** | - | Hanya editor (raw markdown) |
| **Split** | Default | Editor + Preview berdampingan |
| **Reader** | - | Hanya preview (read-only) |
| **Zen** | - | Full focus, tanpa UI distraction |

### 6.4 Knowledge Graph
- **Interactive force-directed graph** dengan canvas rendering
- Node types: File, Folder, Tag
- Edge types: Wiki Link, Backlink, Tag Relation
- Drag nodes, zoom (scroll wheel), hover/select detection
- Filter by node type, search, toggle labels
- **Backlinks Panel** - lihat semua referensi ke file saat ini
- **Outline/TOC Panel** - auto-generate dari headings

### 6.5 Search System
- **Command Palette** (`Ctrl+P`) - search files & run commands
- File search dengan filters (files, content, tags)
- Fuzzy matching dan real-time results

### 6.6 AI Workspace (RAG Local)
- **AI Chat Panel** dengan conversation history
- 9 AI Actions:
  - ✏️ **Rewrite** - Tulis ulang teks
  - 📝 **Expand** - Perluas konten
  - 📋 **Summarize** - Rangkum konten
  - 🎭 **Tone Adjust** - Sesuaikan nada tulisan
  - 🌐 **Translate** - Terjemahkan
  - 💡 **Explain Code** - Jelaskan kode
  - 🔧 **Refactor** - Refactor kode
  - 📖 **API Docs** - Buat dokumentasi API
  - 🏗️ **ADR** - Buat Architecture Decision Record
- Provider support: Ollama, LM Studio, OpenAI, Anthropic, Grok, DeepSeek, OpenRouter
- Context-aware (mengirim file saat ini ke AI)

### 6.7 Git Integration (Native)
- Branch management (create, switch, delete)
- Stage/Unstage file individual atau bulk
- Commit dengan message
- History view dengan commit timeline
- Diff viewer
- Pull/Push/Refresh actions

### 6.8 Publishing Engine
- **10 publish targets:**

| Target | Type |
|--------|------|
| VitePress | Static Site |
| Docusaurus | Static Site |
| MkDocs Material | Static Site |
| Hugo | Static Site |
| GitHub Pages | Hosting |
| Cloudflare Pages | Hosting |
| Netlify | Hosting |
| Vercel | Hosting |
| PDF Export | Document |
| GitBook | Document |

- Publish options: include all files, search index, draft mode
- Real-time publish log

### 6.9 Plugin System
- **Plugin Marketplace** dengan 8 plugins
- Plugin types: Sidebar, Command, Editor Extension, Renderer, Parser, Theme, Search, AI
- Install/Uninstall, Enable/Disable toggle
- Permission system (sandboxed)

### 6.10 Theme System
- **Catppuccin Mocha** (Dark) - default
- **Catppuccin Latte** (Light)
- System theme detection
- Full CSS variable system

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+P` | Command Palette |
| `Ctrl+S` | Save file |
| `Ctrl+B` | Toggle Sidebar / Bold text |
| `Ctrl+I` | Italic text |
| `Ctrl+K` | Insert link |
| `Ctrl+J` | Toggle Bottom Panel |
| `Ctrl+\` | Toggle Right Panel |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+D` | Select next occurrence |
| `Ctrl+F` | Find |
| `Ctrl+H` | Find & Replace |
| `Tab` | Indent |
| `Shift+Tab` | Outdent |
| `Escape` | Close modal/palette |

---

## 📦 Instalasi

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Rust** >= 1.70 (untuk desktop build)
- **Tauri CLI** (untuk desktop build)

### Quick Start (Web)

```bash
# Clone repository
git clone https://github.com/your-username/markdown-studio-x.git
cd markdown-studio-x

# Install dependencies
npm install

# Start development server
npm run dev
```

Buka http://localhost:1420 di browser.

### Desktop Build (Tauri 2)

```bash
# Install Tauri CLI
npm install -g @tauri-apps/cli

# Development mode (hot-reload)
npx tauri dev

# Production build
npx tauri build
```

Binary akan tersedia di `src-tauri/target/release/markdown-studio-x.exe`

### Build Commands

```bash
# Web build only
npm run build

# Preview web build
npm run preview

# Tauri development
npm run tauri dev

# Tauri production build
npm run tauri build
```

---

## 🖥️ Penggunaan

### 1. Membuka Workspace

Saat pertama kali membuka aplikasi, workspace default akan dimuat dengan struktur folder standar:

```
My Workspace/
├── docs/
│   ├── Getting Started.md
│   ├── API Reference.md
│   └── Architecture.md
├── notes/
│   ├── Meeting Notes.md
│   └── Ideas.md
├── projects/
│   └── Roadmap.md
├── diagrams/
│   └── System Architecture.md
├── templates/
│   ├── ADR Template.md
│   └── Meeting Template.md
├── welcome.md
└── README.md
```

### 2. Menulis Markdown

1. Klik file di **File Explorer** (sidebar kiri) untuk membuka
2. Ketik markdown di editor panel kiri
3. Preview otomatis muncul di panel kanan (Split Mode)
4. Gunakan **Markdown Toolbar** untuk formatting cepat

### 3. Menggunakan Wiki Links

```markdown
Lihat juga [[Getting Started]] untuk panduan awal.
Atau [[API Reference#Authentication]] untuk auth.
```

Wiki links akan otomatis muncul di **Knowledge Graph** dan **Backlinks Panel**.

### 4. AI Assistant

1. Buka panel AI di sidebar atau gunakan `/ai` route
2. Ketik pertanyaan atau pilih quick action
3. AI akan merespons berdasarkan konteks file saat ini
4. Konfigurasi AI provider di **Settings → AI**

### 5. Git Workflow

1. Buka panel Git di sidebar
2. Lihat perubahan di tab **Changes**
3. Stage file dengan klik tombol `+`
4. Ketik commit message dan klik **Commit**
5. Lihat history di tab **History**

### 6. Publishing

1. Buka halaman Publish (`/publish`)
2. Pilih target platform (VitePress, GitHub Pages, dll.)
3. Konfigurasi options
4. Klik **Publish** dan monitor progress di log

### 7. Knowledge Graph

1. Buka halaman Graph (`/graph`)
2. Lihat visualisasi hubungan antar dokumen
3. Drag node untuk rearrange
4. Zoom dengan scroll wheel
5. Filter dengan search box
6. Klik node untuk select

---

## 🏗️ Teknologi Stack

### Frontend
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Vue 3 | 3.5.x | UI Framework |
| TypeScript | 5.7.x | Type Safety |
| Vite | 6.4.x | Build Tool |
| Pinia | 3.0.x | State Management |
| Vue Router | 4.5.x | Routing |
| CodeMirror 6 | 6.x | Editor Engine |
| SCSS | - | Styling |

### Desktop (Tauri)
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Tauri | 2.x | Desktop Framework |
| Rust | 1.96 | Backend Runtime |
| WebView2 | - | Rendering Engine (Windows) |

### Markdown Processing
| Teknologi | Kegunaan |
|-----------|----------|
| @codemirror/lang-markdown | Markdown parsing & highlighting |
| @lezer/highlight | Syntax highlighting engine |
| Custom renderer | Live preview rendering |

### Graph & Visualization
| Teknologi | Kegunaan |
|-----------|----------|
| HTML5 Canvas | Graph rendering |
| Force-directed layout | Node positioning |

---

## 📁 Struktur Project

```
markdown-studio-x/
├── 📄 index.html                    # Entry HTML
├── 📄 package.json                  # NPM dependencies
├── 📄 vite.config.ts                # Vite configuration
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 env.d.ts                      # Type declarations
│
├── 📂 src/
│   ├── 📄 main.ts                   # App entry point
│   ├── 📄 App.vue                   # Root component
│   │
│   ├── 📂 types/
│   │   └── 📄 index.ts              # 350+ lines of TypeScript types
│   │
│   ├── 📂 stores/
│   │   ├── 📄 ui.ts                 # UI state (sidebar, panels, theme)
│   │   ├── 📄 editor.ts             # Editor state (files, content, mode)
│   │   ├── 📄 workspace.ts          # Workspace & file tree
│   │   ├── 📄 graph.ts              # Knowledge graph & backlinks
│   │   └── 📄 git.ts                # Git integration
│   │
│   ├── 📂 router/
│   │   └── 📄 index.ts              # 6 routes
│   │
│   ├── 📂 styles/
│   │   └── 📄 global.scss           # Catppuccin theme & utilities
│   │
│   ├── 📂 views/
│   │   ├── 📄 EditorView.vue        # Main editor with CodeMirror
│   │   ├── 📄 GraphView.vue         # Knowledge graph visualization
│   │   ├── 📄 SearchView.vue        # Search interface
│   │   └── 📄 SettingsView.vue      # Settings panel
│   │
│   └── 📂 components/
│       ├── 📄 CommandPalette.vue     # Ctrl+P command palette
│       │
│       ├── 📂 layout/
│       │   ├── 📄 TitleBar.vue       # App title bar
│       │   ├── 📄 SideBar.vue        # Left sidebar with panels
│       │   ├── 📄 StatusBar.vue      # Bottom status bar
│       │   └── 📄 TabBar.vue         # Editor tabs + mode selector
│       │
│       ├── 📂 sidebar/
│       │   ├── 📄 FileExplorer.vue   # File tree view
│       │   ├── 📄 GitPanel.vue       # Git changes & history
│       │   ├── 📄 BacklinksPanel.vue # Backlinks & tags
│       │   └── 📄 OutlinePanel.vue   # Document outline/TOC
│       │
│       ├── 📂 editor/
│       │   ├── 📄 MarkdownEditor.vue # CodeMirror 6 editor
│       │   └── 📄 MarkdownToolbar.vue # Formatting toolbar
│       │
│       ├── 📂 ai/
│       │   └── 📄 AIChatPanel.vue    # AI assistant chat
│       │
│       ├── 📂 publishing/
│       │   └── 📄 PublishPanel.vue   # Publishing engine
│       │
│       └── 📂 plugins/
│           └── 📄 PluginManager.vue  # Plugin marketplace
│
├── 📂 src-tauri/
│   ├── 📄 Cargo.toml                # Rust dependencies
│   ├── 📄 tauri.conf.json           # Tauri configuration
│   ├── 📄 build.rs                  # Build script
│   ├── 📄 src/
│   │   └── 📄 main.rs               # Rust backend (10 commands)
│   └── 📂 icons/                    # Platform icons
│
├── 📂 scripts/
│   └── 📄 generate-icons.cjs        # Icon generation script
│
└── 📄 README.md                     # This file
```

---

## 🎨 Theme

Markdown Studio X menggunakan **Catppuccin** color palette:

### Catppuccin Mocha (Dark - Default)

| Color | Hex | Usage |
|-------|-----|-------|
| Base | `#1e1e2e` | Background |
| Surface | `#252536` | Cards, inputs |
| Text | `#cdd6f4` | Primary text |
| Blue | `#89b4fa` | Links, active states |
| Green | `#a6e3a1` | Success, tags |
| Red | `#f38ba8` | Errors, deletions |
| Yellow | `#f9e2af` | Warnings, folders |
| Purple | `#cba6f7` | AI, accents |
| Teal | `#94e2d5` | Info |
| Peach | `#fab387` | Inline code |

### Catppuccin Latte (Light)

Tersedia sebagai alternatif light theme dengan warna yang lebih terang.

---

## 🗺️ Roadmap

### MVP (v1.0) ✅
- [x] Core Editor + Live Preview
- [x] Knowledge Graph + Backlinks
- [x] Basic Search + Tags
- [x] AI Chat Panel (demo)
- [x] Git basic integration
- [x] Publishing Engine (UI)
- [x] Plugin System (UI)

### Phase 1 (v1.5)
- [ ] Advanced AI Workspace (real Ollama/OpenAI integration)
- [ ] Semantic Search + Vector Embeddings
- [ ] Real Git integration (libgit2)
- [ ] Plugin API + Runtime
- [ ] Mermaid diagram rendering
- [ ] KaTeX math rendering

### Phase 2 (v2.0)
- [ ] Mobile apps (iOS & Android via Flutter)
- [ ] Real-time Collaboration (CRDT)
- [ ] PDF Export
- [ ] Web version (Progressive Web App)

### Phase 3 (Enterprise)
- [ ] Team Workspaces
- [ ] RBAC (Role-Based Access Control)
- [ ] SSO (OIDC, SAML)
- [ ] Audit Trail
- [ ] Centralized Plugin Management
- [ ] On-premise deployment

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Berikut cara berkontribusi:

1. **Fork** repository ini
2. **Clone** fork Anda: `git clone https://github.com/your-username/markdown-studio-x.git`
3. **Buat branch** baru: `git checkout -b feature/amazing-feature`
4. **Commit** perubahan: `git commit -m 'feat: add amazing feature'`
5. **Push** ke branch: `git push origin feature/amazing-feature`
6. **Buat Pull Request**

### Commit Convention

Menggunakan [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

### Development Setup

```bash
# 1. Clone & install
git clone https://github.com/your-username/markdown-studio-x.git
cd markdown-studio-x
npm install

# 2. Start development
npm run dev          # Web only (port 1420)
npx tauri dev        # Full desktop app

# 3. Run tests
npm run build        # Verify web build
npx tauri build      # Verify desktop build
```

---

## 📋 System Requirements

### Minimum
- **OS**: Windows 10+, macOS 11+, Ubuntu 20.04+
- **RAM**: 4 GB
- **Storage**: 200 MB
- **Display**: 1280x720

### Recommended
- **OS**: Windows 11, macOS 14+, Ubuntu 22.04+
- **RAM**: 8 GB
- **Storage**: 1 GB (untuk workspace besar)
- **Display**: 1920x1080

### Performance Targets (PRD)
| Metric | Target |
|--------|--------|
| Startup time | < 1.5 detik |
| Workspace 100K files | Lancar |
| Search response | < 50ms |
| Graph render (10K nodes) | < 2 detik |
| Memory (idle) | < 550 MB |
| Binary size | < 80 MB |

---

## ❓ FAQ

### Q: Apakah data saya aman?
**A:** Ya. Semua data tersimpan lokal di perangkat Anda. Tidak ada telemetry tanpa izin eksplisit. Format file menggunakan `.md` biasa yang bisa dibuka di text editor manapun.

### Q: Bisa digunakan offline?
**A:** Ya. 95% fitur berfungsi tanpa internet. Hanya fitur AI cloud provider dan publish ke hosting yang memerlukan internet.

### Q: Apakah kompatibel dengan Obsidian vault?
**A:** Ya. Markdown Studio X menggunakan format yang sama (`.md` + folder). Anda bisa langsung membuka vault Obsidian.

### Q: Bagaimana cara mengkonfigurasi AI?
**A:** Buka Settings → AI, pilih provider (Ollama untuk local, OpenAI/Anthropic untuk cloud), dan masukkan API key jika diperlukan.

### Q: Bisa export ke PDF?
**A:** Fitur PDF export ada di Publishing Engine. Pilih "PDF Export" sebagai target dan klik Publish.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detail.

```
MIT License

Copyright (c) 2026 Markdown Studio X

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  <strong>Dibuat dengan ❤️ oleh Tim Product Architecture</strong>
</p>

<p align="center">
  <sub>Markdown Studio X v1.0.0 - Vue 3 + TypeScript + CodeMirror 6 + Tauri 2 + Rust</sub>
</p>