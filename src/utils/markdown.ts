// ============================================================
// Markdown Studio X - Advanced Markdown Renderer
// Integrates Mermaid, KaTeX, and enhanced GFM support
// ============================================================

import mermaid from 'mermaid'
import katex from 'katex'

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#89b4fa',
    primaryTextColor: '#cdd6f4',
    primaryBorderColor: '#313244',
    lineColor: '#45475a',
    secondaryColor: '#252536',
    tertiaryColor: '#1e1e2e',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
  },
  securityLevel: 'loose',
  flowchart: { useMaxWidth: true, htmlLabels: true },
  sequence: { useMaxWidth: true },
  gantt: { useMaxWidth: true },
})

// Mermaid render counter
let mermaidCounter = 0

/**
 * Render Mermaid diagram to SVG
 */
export async function renderMermaid(code: string): Promise<string> {
  try {
    mermaidCounter++
    const id = `mermaid-${mermaidCounter}-${Date.now()}`
    const { svg } = await mermaid.render(id, code.trim())
    return `<div class="mermaid-container">${svg}</div>`
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return `<div class="mermaid-error">
      <div class="error-title">Mermaid Error</div>
      <div class="error-message">${escapeHtml(errorMessage)}</div>
      <pre class="error-code">${escapeHtml(code)}</pre>
    </div>`
  }
}

/**
 * Render KaTeX math expression
 */
export function renderKatex(expression: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(expression.trim(), {
      displayMode,
      throwOnError: false,
      errorColor: '#f38ba8',
      trust: true,
      strict: false,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'KaTeX error'
    return `<span class="katex-error" title="${escapeHtml(errorMessage)}">${escapeHtml(expression)}</span>`
  }
}

/**
 * Full markdown to HTML renderer with Mermaid + KaTeX + GFM
 */
export async function renderMarkdownFull(md: string): Promise<string> {
  let html = md

  // Remove frontmatter
  html = html.replace(/^---[\s\S]*?---\n*/m, '')

  // Store code blocks to prevent processing inside them
  const codeBlocks: string[] = []
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const index = codeBlocks.length
    if (lang === 'mermaid') {
      codeBlocks.push(`%%MERMAID_${index}%%`)
      return `%%MERMAID_${index}%%`
    }
    codeBlocks.push(`<pre class="code-block"><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`)
    return `%%CODE_${index}%%`
  })

  // Store inline code
  const inlineCodes: string[] = []
  html = html.replace(/`([^`]+)`/g, (_match, code) => {
    const index = inlineCodes.length
    inlineCodes.push(`<code class="inline-code">${escapeHtml(code)}</code>`)
    return `%%INLINE_${index}%%`
  })

  // Store math blocks
  const mathBlocks: string[] = []
  // Block math $$...$$
  html = html.replace(/\$\$\n?([\s\S]*?)\n?\$\$/g, (_match, expr) => {
    const index = mathBlocks.length
    mathBlocks.push(`<div class="math-block">${renderKatex(expr, true)}</div>`)
    return `%%MATH_${index}%%`
  })
  // Inline math $...$
  html = html.replace(/\$([^\$\n]+?)\$/g, (_match, expr) => {
    const index = mathBlocks.length
    mathBlocks.push(renderKatex(expr, false))
    return `%%MATH_${index}%%`
  })

  // Headers
  html = html.replace(/^######\s+(.+)$/gm, '<h6 id="$1">$1</h6>')
  html = html.replace(/^#####\s+(.+)$/gm, '<h5 id="$1">$1</h5>')
  html = html.replace(/^####\s+(.+)$/gm, '<h4 id="$1">$1</h4>')
  html = html.replace(/^###\s+(.+)$/gm, '<h3 id="$1">$1</h3>')
  html = html.replace(/^##\s+(.+)$/gm, '<h2 id="$1">$1</h2>')
  html = html.replace(/^#\s+(.+)$/gm, '<h1 id="$1">$1</h1>')

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>')

  // Strikethrough (GFM)
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>')

  // Blockquotes (including callouts)
  html = html.replace(/^>\s*\[!(tip|note|warning|danger|info)\]\s*(.*)\n((?:>.*\n?)*)/gm,
    (_match, type, title, content) => {
      const cleanContent = content.replace(/^>\s?/gm, '').trim()
      return `<div class="callout callout-${type}"><div class="callout-title">${title || type}</div><div class="callout-content">${cleanContent}</div></div>`
    })
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')

  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr />')
  html = html.replace(/^\*\*\*+$/gm, '<hr />')

  // Task lists (GFM)
  html = html.replace(/^- \[x\]\s+(.+)$/gm, '<div class="task-item"><input type="checkbox" checked disabled /><span class="task-done">$1</span></div>')
  html = html.replace(/^- \[ \]\s+(.+)$/gm, '<div class="task-item"><input type="checkbox" disabled /><span>$1</span></div>')

  // Tables (GFM)
  const tableRegex = /(?:^|\n)((?:\|.+\|(?:\n|$))+)/g
  html = html.replace(tableRegex, (_match, tableBlock) => {
    const rows = tableBlock.trim().split('\n').filter((r: string) => r.trim())
    if (rows.length < 2) return tableBlock

    const headerCells = rows[0].split('|').filter((c: string) => c.trim())
    const isSeparator = (row: string) => /^[\s|:-]+$/.test(row)

    let tableHtml = '<div class="table-wrapper"><table><thead><tr>'
    headerCells.forEach((cell: string) => {
      tableHtml += `<th>${cell.trim()}</th>`
    })
    tableHtml += '</tr></thead><tbody>'

    const dataRows = isSeparator(rows[1]) ? rows.slice(2) : rows.slice(1)
    dataRows.forEach((row: string) => {
      const cells = row.split('|').filter((c: string) => c.trim())
      tableHtml += '<tr>'
      cells.forEach((cell: string) => {
        tableHtml += `<td>${cell.trim()}</td>`
      })
      tableHtml += '</tr>'
    })

    tableHtml += '</tbody></table></div>'
    return tableHtml
  })

  // Unordered lists
  html = html.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="ordered">$1</li>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')

  // Wiki links [[target|display]] or [[target]]
  html = html.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '<span class="wiki-link" data-target="$1">$2</span>')
  html = html.replace(/\[\[([^\]]+)\]\]/g, '<span class="wiki-link" data-target="$1">📎 $1</span>')

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')

  // Footnotes
  const footnotes: Record<string, string> = {}
  html = html.replace(/^\[\^(\w+)\]:\s+(.+)$/gm, (_match, id, content) => {
    footnotes[id] = content
    return ''
  })
  html = html.replace(/\[\^(\w+)\]/g, (_match, id) => {
    return `<sup class="footnote-ref"><a href="#fn-${id}" id="fnref-${id}">${id}</a></sup>`
  })

  // Definition lists
  html = html.replace(/^([^:\n]+)\n:\s+(.+)$/gm, '<dl><dt>$1</dt><dd>$2</dd></dl>')

  // Paragraphs
  html = html.replace(/^(?!<[a-z]|%%|\n|$)(.+)$/gm, '<p>$1</p>')

  // Restore code blocks
  codeBlocks.forEach((block, i) => {
    if (block.startsWith('%%MERMAID_')) {
      // Mermaid blocks will be rendered async - leave placeholder
    } else {
      html = html.replace(`%%CODE_${i}%%`, block)
    }
  })

  // Restore inline codes
  inlineCodes.forEach((code, i) => {
    html = html.replace(`%%INLINE_${i}%%`, code)
  })

  // Restore math blocks
  mathBlocks.forEach((math, i) => {
    html = html.replace(`%%MATH_${i}%%`, math)
  })

  return html
}

/**
 * Post-process HTML to render Mermaid diagrams
 */
export async function renderMermaidInHtml(html: string, mermaidCodes: string[]): Promise<string> {
  let processedHtml = html
  for (let i = 0; i < mermaidCodes.length; i++) {
    const svg = await renderMermaid(mermaidCodes[i])
    processedHtml = processedHtml.replace(`%%MERMAID_${i}%%`, svg)
  }
  return processedHtml
}

/**
 * Extract mermaid code blocks from markdown
 */
export function extractMermaidBlocks(md: string): string[] {
  const blocks: string[] = []
  const regex = /```mermaid\n([\s\S]*?)```/g
  let match
  while ((match = regex.exec(md)) !== null) {
    blocks.push(match[1])
  }
  return blocks
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;')
}

/**
 * Generate table of contents from markdown
 */
export interface TocItem {
  level: number
  text: string
  id: string
  line: number
}

export function generateToc(md: string): TocItem[] {
  const items: TocItem[] = []
  const lines = md.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const text = match[2].replace(/[*_`~\[\]]/g, '')
      items.push({
        level: match[1].length,
        text,
        id: text.toLowerCase().replace(/[^\w]+/g, '-'),
        line: i + 1,
      })
    }
  }
  return items
}

/**
 * Parse frontmatter from markdown
 */
export function parseFrontmatter(md: string): { frontmatter: Record<string, any>; content: string } {
  const match = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { frontmatter: {}, content: md }

  const yamlContent = match[1]
  const frontmatter: Record<string, any> = {}

  // Simple YAML parser (handles basic key-value pairs)
  for (const line of yamlContent.split('\n')) {
    const kvMatch = line.match(/^(\w+):\s*(.+)$/)
    if (kvMatch) {
      let value: any = kvMatch[2].trim()
      // Handle arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map((v: string) => v.trim())
      }
      frontmatter[kvMatch[1]] = value
    }
  }

  return { frontmatter, content: match[2] }
}

/**
 * Count words in text (handles CJK characters)
 */
export function countWords(text: string): number {
  // Remove markdown syntax
  const clean = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/[#*_~\[\]\(\)>|-]/g, '')
    .trim()

  if (!clean) return 0

  // Count CJK characters as individual words
  const cjkCount = (clean.match(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/g) || []).length
  // Count space-separated words
  const latinWords = clean.replace(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/g, ' ').trim().split(/\s+/).filter(w => w.length > 0)

  return latinWords.length + cjkCount
}

/**
 * Estimate reading time
 */
export function estimateReadingTime(text: string): string {
  const words = countWords(text)
  const minutes = Math.ceil(words / 200) // Average reading speed
  if (minutes < 1) return 'Less than 1 min read'
  return `${minutes} min read`
}