import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GraphNode, GraphEdge, GraphData, GraphFilter, WikiLink, Tag } from '@/types'
import { nanoid } from 'nanoid'
import { useWorkspaceStore } from './workspace'

export const useGraphStore = defineStore('graph', () => {
  // --- State ---
  const nodes = ref<GraphNode[]>([])
  const edges = ref<GraphEdge[]>([])
  const wikiLinks = ref<WikiLink[]>([])
  const backlinks = ref<Map<string, WikiLink[]>>(new Map())
  const tags = ref<Tag[]>([])
  const filter = ref<GraphFilter>({
    nodeTypes: ['file', 'folder', 'tag'],
    edgeTypes: ['wikilink', 'backlink', 'tag'],
    searchQuery: '',
    depth: 3,
    showOrphans: true,
    clusterBy: 'none',
  })
  const selectedNode = ref<string | null>(null)
  const hoveredNode = ref<string | null>(null)
  const isLoading = ref(false)

  // Color map for node types
  const nodeColors: Record<string, string> = {
    file: '#89b4fa',
    folder: '#f9e2af',
    tag: '#a6e3a1',
    attachment: '#fab387',
    url: '#89dceb',
    heading: '#cba6f7',
    block: '#f5c2e7',
  }

  // --- Computed ---
  const filteredData = computed<GraphData>(() => {
    let filteredNodes = nodes.value.filter(n =>
      filter.value.nodeTypes.includes(n.type)
    )

    if (filter.value.searchQuery) {
      const q = filter.value.searchQuery.toLowerCase()
      filteredNodes = filteredNodes.filter(n =>
        n.label.toLowerCase().includes(q) || n.path.toLowerCase().includes(q)
      )
    }

    const nodeIds = new Set(filteredNodes.map(n => n.id))

    let filteredEdges = edges.value.filter(e =>
      filter.value.edgeTypes.includes(e.type) &&
      nodeIds.has(e.source) &&
      nodeIds.has(e.target)
    )

    if (!filter.value.showOrphans) {
      const connectedIds = new Set<string>()
      filteredEdges.forEach(e => {
        connectedIds.add(e.source)
        connectedIds.add(e.target)
      })
      filteredNodes = filteredNodes.filter(n => connectedIds.has(n.id))
    }

    return { nodes: filteredNodes, edges: filteredEdges }
  })

  const nodeCount = computed(() => filteredData.value.nodes.length)
  const edgeCount = computed(() => filteredData.value.edges.length)

  // --- Actions ---
  function buildGraph() {
    const workspace = useWorkspaceStore()
    isLoading.value = true

    nodes.value = []
    edges.value = []
    wikiLinks.value = []
    backlinks.value.clear()
    tags.value = []

    // Create nodes from file tree
    function walkTree(items: any[], parentPath?: string) {
      for (const item of items) {
        const node: GraphNode = {
          id: item.id || nanoid(),
          label: item.name.replace('.md', ''),
          type: item.type === 'directory' ? 'folder' : 'file',
          path: item.path,
          size: item.type === 'directory' ? 20 : 12,
          color: nodeColors[item.type === 'directory' ? 'folder' : 'file'],
          metadata: {
            extension: item.extension,
            modifiedAt: item.modifiedAt,
          },
        }
        nodes.value.push(node)

        // Create parent-child edge
        if (parentPath) {
          const parentNode = nodes.value.find(n => n.path === parentPath)
          if (parentNode) {
            edges.value.push({
              id: nanoid(),
              source: parentNode.id,
              target: node.id,
              type: 'manual',
              weight: 1,
              label: 'contains',
            })
          }
        }

        // Recurse into children
        if (item.children) {
          walkTree(item.children, item.path)
        }
      }
    }

    walkTree(workspace.fileTree)

    // Parse wiki links from file content (demo)
    parseWikiLinks()

    // Extract tags
    extractTags()

    isLoading.value = false
  }

  function parseWikiLinks() {
    // Demo: create some sample wiki links between files
    const fileNodes = nodes.value.filter(n => n.type === 'file')
    if (fileNodes.length < 2) return

    // Create sample connections
    const connections = [
      { from: 'welcome.md', to: 'Getting Started', type: 'wikilink' as const },
      { from: 'welcome.md', to: 'API Reference', type: 'wikilink' as const },
      { from: 'welcome.md', to: 'Changelog', type: 'wikilink' as const },
    ]

    for (const conn of connections) {
      const source = fileNodes.find(n => n.label === conn.from.replace('.md', ''))
      const target = fileNodes.find(n => n.label === conn.to)

      if (source && target) {
        edges.value.push({
          id: nanoid(),
          source: source.id,
          target: target.id,
          type: conn.type,
          weight: 2,
          label: 'links to',
        })

        const link: WikiLink = {
          target: conn.to,
          fromFile: source.path,
          position: { start: 0, end: 0 },
        }
        wikiLinks.value.push(link)

        // Build backlinks
        const existing = backlinks.value.get(target.path) || []
        existing.push(link)
        backlinks.value.set(target.path, existing)
      }
    }
  }

  function extractTags() {
    // Demo tags
    const demoTags: Tag[] = [
      { name: 'welcome', count: 1, files: ['/welcome.md'] },
      { name: 'getting-started', count: 1, files: ['/welcome.md'] },
      { name: 'api', count: 1, files: ['/docs/API Reference.md'] },
      { name: 'architecture', count: 1, files: ['/docs/Architecture.md'] },
    ]

    tags.value = demoTags

    // Create tag nodes
    for (const tag of demoTags) {
      const tagNode: GraphNode = {
        id: `tag-${tag.name}`,
        label: `#${tag.name}`,
        type: 'tag',
        path: `#tag/${tag.name}`,
        size: 10,
        color: nodeColors.tag,
        metadata: { count: tag.count },
      }
      nodes.value.push(tagNode)

      // Create edges from tag to files
      for (const filePath of tag.files) {
        const fileNode = nodes.value.find(n => n.path === filePath)
        if (fileNode) {
          edges.value.push({
            id: nanoid(),
            source: fileNode.id,
            target: tagNode.id,
            type: 'tag',
            weight: 1,
            label: `#${tag.name}`,
          })
        }
      }
    }
  }

  function getBacklinks(filePath: string): WikiLink[] {
    return backlinks.value.get(filePath) || []
  }

  function setFilter(newFilter: Partial<GraphFilter>) {
    filter.value = { ...filter.value, ...newFilter }
  }

  function selectNode(nodeId: string | null) {
    selectedNode.value = nodeId
  }

  function hoverNode(nodeId: string | null) {
    hoveredNode.value = nodeId
  }

  function clearGraph() {
    nodes.value = []
    edges.value = []
    wikiLinks.value = []
    backlinks.value.clear()
    tags.value = []
    selectedNode.value = null
    hoveredNode.value = null
  }

  return {
    // State
    nodes,
    edges,
    wikiLinks,
    backlinks,
    tags,
    filter,
    selectedNode,
    hoveredNode,
    isLoading,
    // Computed
    filteredData,
    nodeCount,
    edgeCount,
    // Actions
    buildGraph,
    parseWikiLinks,
    extractTags,
    getBacklinks,
    setFilter,
    selectNode,
    hoverNode,
    clearGraph,
  }
})