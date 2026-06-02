<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useGraphStore } from '@/stores/graph'
import { useEditorStore } from '@/stores/editor'
import type { GraphNode } from '@/types'

const graph = useGraphStore()
const editor = useEditorStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const searchQuery = ref('')
const showLabels = ref(true)

// Animation state
const animNodes = ref<{ id: string; x: number; y: number; vx: number; vy: number; label: string; color: string; size: number; type: string }[]>([])
let animFrame = 0
let isDragging = false
let dragNode: typeof animNodes.value[0] | null = null
let mouseX = 0
let mouseY = 0
let offsetX = 0
let offsetY = 0
let scale = 1
let panX = 0
let panY = 0

function initGraph() {
  graph.buildGraph()
  const data = graph.filteredData
  
  // Initialize node positions in a force-directed layout
  const centerX = 400
  const centerY = 300
  
  animNodes.value = data.nodes.map((node, i) => {
    const angle = (2 * Math.PI * i) / data.nodes.length
    const radius = 100 + Math.random() * 100
    return {
      id: node.id,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      vx: 0,
      vy: 0,
      label: node.label,
      color: node.color,
      size: node.size,
      type: node.type,
    }
  })
}

function animate() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Resize canvas
  const container = containerRef.value
  if (container) {
    canvas.width = container.clientWidth * window.devicePixelRatio
    canvas.height = container.clientHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  }

  const w = canvas.width / window.devicePixelRatio
  const h = canvas.height / window.devicePixelRatio

  // Clear
  ctx.clearRect(0, 0, w, h)
  ctx.save()
  ctx.translate(panX, panY)
  ctx.scale(scale, scale)

  const data = graph.filteredData
  const nodeMap = new Map(animNodes.value.map(n => [n.id, n]))

  // Apply forces (simple spring model)
  if (!isDragging) {
    const k = 0.001 // Spring constant
    const repulsion = 5000
    const damping = 0.95
    const centerX = w / 2
    const centerY = h / 2

    for (const node of animNodes.value) {
      // Center gravity
      node.vx += (centerX - node.x) * 0.0001
      node.vy += (centerY - node.y) * 0.0001

      // Repulsion between nodes
      for (const other of animNodes.value) {
        if (node.id === other.id) continue
        const dx = node.x - other.x
        const dy = node.y - other.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = repulsion / (dist * dist)
        node.vx += (dx / dist) * force
        node.vy += (dy / dist) * force
      }
    }

    // Attraction along edges
    for (const edge of data.edges) {
      const source = nodeMap.get(edge.source)
      const target = nodeMap.get(edge.target)
      if (!source || !target) continue
      const dx = target.x - source.x
      const dy = target.y - source.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const force = (dist - 150) * k
      source.vx += (dx / dist) * force
      source.vy += (dy / dist) * force
      target.vx -= (dx / dist) * force
      target.vy -= (dy / dist) * force
    }

    // Update positions
    for (const node of animNodes.value) {
      node.vx *= damping
      node.vy *= damping
      node.x += node.vx
      node.y += node.vy
      // Bounds
      node.x = Math.max(30, Math.min(w - 30, node.x))
      node.y = Math.max(30, Math.min(h - 30, node.y))
    }
  }

  // Draw edges
  for (const edge of data.edges) {
    const source = nodeMap.get(edge.source)
    const target = nodeMap.get(edge.target)
    if (!source || !target) continue

    ctx.beginPath()
    ctx.moveTo(source.x, source.y)
    ctx.lineTo(target.x, target.y)
    ctx.strokeStyle = edge.type === 'wikilink' ? 'rgba(137, 180, 250, 0.4)' :
                      edge.type === 'tag' ? 'rgba(166, 227, 161, 0.3)' :
                      'rgba(205, 214, 244, 0.15)'
    ctx.lineWidth = edge.type === 'wikilink' ? 2 : 1
    ctx.stroke()

    // Edge label
    if (showLabels.value && edge.label) {
      const midX = (source.x + target.x) / 2
      const midY = (source.y + target.y) / 2
      ctx.fillStyle = 'rgba(166, 173, 200, 0.6)'
      ctx.font = '9px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(edge.label, midX, midY - 4)
    }
  }

  // Draw nodes
  for (const node of animNodes.value) {
    const isHovered = graph.hoveredNode === node.id
    const isSelected = graph.selectedNode === node.id
    const nodeSize = node.size + (isHovered ? 4 : 0) + (isSelected ? 2 : 0)

    // Glow
    if (isHovered || isSelected) {
      ctx.shadowColor = node.color
      ctx.shadowBlur = 20
    }

    // Circle
    ctx.beginPath()
    ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2)
    ctx.fillStyle = node.color
    ctx.fill()

    // Selection ring
    if (isSelected) {
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    ctx.shadowBlur = 0

    // Label
    if (showLabels.value) {
      ctx.fillStyle = '#cdd6f4'
      ctx.font = `${node.type === 'folder' ? 'bold ' : ''}11px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(node.label, node.x, node.y + nodeSize + 14)
    }
  }

  ctx.restore()

  animFrame = requestAnimationFrame(animate)
}

function handleMouseDown(e: MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const x = (e.clientX - rect.left - panX) / scale
  const y = (e.clientY - rect.top - panY) / scale

  for (const node of animNodes.value) {
    const dx = node.x - x
    const dy = node.y - y
    if (dx * dx + dy * dy < (node.size + 5) * (node.size + 5)) {
      isDragging = true
      dragNode = node
      offsetX = dx
      offsetY = dy
      graph.selectNode(node.id)
      return
    }
  }
  graph.selectNode(null)
}

function handleMouseMove(e: MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  mouseX = (e.clientX - rect.left - panX) / scale
  mouseY = (e.clientY - rect.top - panY) / scale

  if (isDragging && dragNode) {
    dragNode.x = mouseX + offsetX
    dragNode.y = mouseY + offsetY
    dragNode.vx = 0
    dragNode.vy = 0
    return
  }

  // Hover detection
  let found = false
  for (const node of animNodes.value) {
    const dx = node.x - mouseX
    const dy = node.y - mouseY
    if (dx * dx + dy * dy < (node.size + 5) * (node.size + 5)) {
      graph.hoverNode(node.id)
      canvas.style.cursor = 'pointer'
      found = true
      break
    }
  }
  if (!found) {
    graph.hoverNode(null)
    canvas.style.cursor = 'default'
  }
}

function handleMouseUp() {
  isDragging = false
  dragNode = null
}

function handleWheel(e: WheelEvent) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  scale = Math.max(0.3, Math.min(3, scale * delta))
}

onMounted(() => {
  initGraph()
  animate()
})

// Watch filter changes
watch(() => graph.filter, () => {
  initGraph()
}, { deep: true })
</script>

<template>
  <div class="graph-view">
    <div class="graph-header">
      <h3>Knowledge Graph</h3>
      <div class="graph-stats">
        <span class="stat">{{ graph.nodeCount }} nodes</span>
        <span class="stat">{{ graph.edgeCount }} edges</span>
      </div>
      <div class="graph-controls">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter graph..."
          class="filter-input"
          @input="graph.setFilter({ searchQuery })"
        />
        <button class="control-btn" :class="{ active: showLabels }" @click="showLabels = !showLabels">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          Labels
        </button>
        <button class="control-btn" @click="initGraph()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Reset
        </button>
      </div>
    </div>

    <div ref="containerRef" class="graph-canvas">
      <canvas
        ref="canvasRef"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
        @wheel="handleWheel"
      ></canvas>
    </div>

    <div class="graph-legend">
      <div class="legend-item"><span class="legend-dot" style="background: #89b4fa"></span><span>Files</span></div>
      <div class="legend-item"><span class="legend-dot" style="background: #f9e2af"></span><span>Folders</span></div>
      <div class="legend-item"><span class="legend-dot" style="background: #a6e3a1"></span><span>Tags</span></div>
      <div class="legend-item"><span class="legend-dot" style="background: #cba6f7"></span><span>Links</span></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.graph-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--editor-bg);
  overflow: hidden;
}

.graph-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;

  h3 {
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--text-primary);
    flex-shrink: 0;
  }
}

.graph-stats {
  display: flex;
  gap: var(--space-3);
  flex-shrink: 0;

  .stat {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    padding: 2px 8px;
    background: var(--bg-surface);
    border-radius: var(--radius-sm);
  }
}

.graph-controls {
  display: flex;
  gap: var(--space-2);
  margin-left: auto;
}

.filter-input {
  padding: 4px 10px;
  background: var(--bg-surface);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--text-primary);
  width: 150px;

  &::placeholder { color: var(--text-muted); }
}

.control-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: 4px 10px;
  background: var(--bg-surface);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  cursor: pointer;

  &:hover { border-color: var(--border-secondary); color: var(--text-primary); }
  &.active { background: var(--bg-active); color: var(--accent-blue); }
}

.graph-canvas {
  flex: 1;
  overflow: hidden;
  position: relative;

  canvas {
    width: 100%;
    height: 100%;
  }
}

.graph-legend {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--border-primary);
  flex-shrink: 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
</style>