Markdown Studio X
Product Requirements Document (Enterprise Edition)
Version: 2.0.0
Status: Detailed Requirements
Classification: Strategic Product
Author: Product Architecture Team
Last Updated: 2026-06-02

1. Executive Summary
Markdown Studio X adalah platform dokumentasi dan pengetahuan generasi berikutnya yang local-first, berbasis Markdown murni, dan dirancang sebagai Knowledge Operating System untuk individu, developer, tim teknis, dan perusahaan.
Aplikasi ini menggabungkan kekuatan editor Markdown, Personal Knowledge Management (PKM), Knowledge Graph, Git workflow, AI assistant, dan publishing engine dalam satu aplikasi lintas platform yang cepat, stabil, dan sepenuhnya open format.
Tagline:
“Satu workspace. Seluruh pengetahuan Anda.”

2. Product Vision
Menjadi aplikasi utama untuk menulis, mengorganisasi, menghubungkan, memahami, dan mempublikasikan pengetahuan — menggantikan kombinasi Obsidian + Typora + Notion + GitBook + VS Code + ChatGPT.
Key Differentiators:

Lebih cepat dan ringan dari Obsidian
Lebih developer-friendly dari Notion
Lebih powerful publishing-nya dari GitBook
Lebih dalam integrasi AI-nya dibanding kompetitor
100% Local-First + Open Format


3. Product Mission
Memberikan pengalaman all-in-one sehingga pengguna tidak perlu lagi membuka 5–7 aplikasi berbeda untuk mengelola pengetahuan dan dokumentasi mereka.

4. Target Users & Personas
Primary Users

Software Engineer / Technical Writer – butuh Git + documentation + diagram
Knowledge Worker / Researcher – butuh knowledge graph + semantic search
Product Manager / Analyst – butuh SOP, requirement docs, dan AI assistant
Content Creator / Educator – butuh publishing ke website
Enterprise Team – butuh collaboration, RBAC, audit trail


5. Core Principles

Local First – Data utama selalu di perangkat lokal
Open Format – Semua file menggunakan .md + folder biasa
Offline First – 95% fitur berfungsi tanpa internet
Extensible – Semua fitur melalui Plugin API
Privacy First – Tidak ada telemetry tanpa izin eksplisit
Developer Friendly – Semua data dapat diakses via API dan file system


6. Functional Requirements
6.1 Workspace System

Satu user dapat memiliki unlimited workspace
Struktur folder default:textWorkspace Name/
├── docs/
├── notes/
├── projects/
├── diagrams/
├── assets/
├── templates/
├── snippets/
├── scripts/
└── .studio/ (konfigurasi, cache, settings)

6.2 Markdown Engine
Support:

100% CommonMark + GitHub Flavored Markdown
Obsidian-style features (Wiki Links [[ ]], ![[ ]] embed, Backlinks)
Tables, Task Lists, Footnotes, Callouts/Admonitions, Definition Lists
Mermaid, PlantUML, Excalidraw, Draw.io integration
KaTeX / MathJax
Frontmatter (YAML + TOML)
Custom Components & Embeds

6.3 Live Preview & Editor Modes

Source Mode
Split View (Editor + Preview)
Reader Mode
Zen Mode (full focus)
Typewriter Mode
Distraction-free

6.4 Knowledge Graph

Nodes: File, Folder, Tag, Attachment, URL, Heading, Block
Edges: Wiki Link, Backlink, Embed, Tag Relation, Citation, Manual Link
Graph View dengan filtering, clustering, dan search
Local vector embeddings untuk semantic relationship

6.5 Search System (4 Layer)






























LayerTeknologiKemampuan1SQLite FTS5Full text cepat2MiniSearch / TantivyAdvanced ranking3Vector SearchSemantic search4AI SearchNatural language query
Contoh query: "cara setup nginx reverse proxy dengan docker" → menemukan dokumen relevan meski tidak ada kata yang persis sama.
6.6 AI Workspace (RAG Local)
AI Features:

Writing Assistant (Rewrite, Expand, Summarize, Tone Adjust)
Knowledge Assistant (tanya seluruh workspace)
Code Assistant (generate, explain, refactor, debug)
Documentation Assistant (buat API docs, SOP, architecture decision record)
Chat dengan selected block / file / folder

Provider Support:

Local: Ollama, LM Studio, GPT4All
Cloud: OpenAI, Anthropic, Grok, DeepSeek, OpenRouter

6.7 Git Integration (Native)

Clone, Commit, Push, Pull, Branch, Merge
Visual Diff
Conflict resolver dengan preview
Git blame & history
Auto-commit dengan AI summary

6.8 Publishing Engine
Bisa publish workspace atau folder menjadi:

Static Site (VitePress, Docusaurus, MkDocs Material, Hugo, Astro)
GitHub Pages, Cloudflare Pages, Netlify, Vercel (one-click)
PDF Export (beautiful formatting)
GitBook-style output

6.9 Plugin System

Plugin Marketplace resmi
Plugin types: Sidebar, Command Palette, Editor Extension, Renderer, Parser, Theme, Search Provider, AI Provider
Plugin permission system (sandboxed)


7. Non-Functional Requirements
Performance Targets

Startup time: < 1.5 detik
Buka workspace 100.000 files: lancar
Search response: < 50ms
Graph render (10.000 nodes): < 2 detik
Memory usage: < 550 MB (idle)
Binary size: < 80 MB (Tauri)

Security

Sandboxed plugin runtime
Content Security Policy (CSP)
Encrypted vault untuk secrets & API keys
Plugin permission granular
Audit log untuk Enterprise

Platform Support

Desktop: Windows, macOS, Linux (Tauri 2)
Mobile: iOS & Android (Flutter) – Phase 2
Future: Web version (progressive)


8. Technology Stack (Final)

Runtime: Tauri 2 + Rust
Frontend: Vue 3 + TypeScript + Vite + Pinia
Editor: CodeMirror 6
Markdown: Unified + Remark + Rehype + custom plugins
Database: SQLite + FTS5 + LiteFS (future)
Search: Tantivy (Rust) + Vector (LanceDB atau Chroma)
Graph: Custom + Graphology
AI: Provider agnostic + Local embeddings (sentence-transformers)


9. Enterprise Edition Features (Phase 3)

Team Workspaces
Realtime Collaboration (CRDT)
Role-Based Access Control (RBAC)
SSO (OIDC, SAML, Google, Microsoft, Okta)
Audit Trail & Version History
Centralized Plugin Management
On-premise / Air-gapped deployment
SLA Support


10. Roadmap
MVP (v1.0)

Core Editor + Live Preview
Knowledge Graph + Backlinks
Basic Search + Tags
Local AI (Ollama)
Git basic

Phase 1 (v1.5)

Advanced AI Workspace
Semantic Search + Embeddings
Publishing Engine
Plugin System + Marketplace

Phase 2 (v2.0)

Native Git deep integration
Mobile apps
Enterprise features


11. Success Metrics

Adoption: 50.000 active users dalam 12 bulan pertama
Retention: > 65% user aktif mingguan
Satisfaction: NPS > 70
Performance: Memenuhi semua target teknis
Market Position: Diakui sebagai salah satu dari 3 aplikasi PKM terbaik di 2027