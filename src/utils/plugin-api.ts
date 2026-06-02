// ============================================================
// Markdown Studio X - Plugin API & Runtime
// Provides sandboxed plugin execution environment
// ============================================================

import type { Plugin, PluginType, PluginPermission } from '@/types'

export interface PluginContext {
  workspace: {
    getFiles: () => string[]
    readFile: (path: string) => Promise<string>
    writeFile: (path: string, content: string) => Promise<void>
  }
  editor: {
    getContent: () => string
    setContent: (content: string) => void
    getSelection: () => { from: number; to: number; text: string }
    insertText: (text: string) => void
  }
  ui: {
    showMessage: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void
    showNotification: (title: string, body: string) => void
    registerCommand: (id: string, label: string, action: () => void) => void
    registerSidebarPanel: (id: string, label: string, component: any) => void
  }
  ai: {
    prompt: (message: string, context?: string) => Promise<string>
    complete: (text: string) => Promise<string>
  }
  graph: {
    getNodes: () => any[]
    getEdges: () => any[]
    getBacklinks: (path: string) => string[]
  }
}

// Plugin registry
const registeredPlugins = new Map<string, LoadedPlugin>()

interface LoadedPlugin {
  plugin: Plugin
  instance: any
  context: PluginContext
  active: boolean
}

// Plugin event system
type PluginEventHandler = (...args: any[]) => void
const eventHandlers = new Map<string, Map<string, PluginEventHandler[]>>()

/**
 * Create a sandboxed plugin context
 */
function createPluginContext(plugin: Plugin): PluginContext {
  const permissions = new Set(plugin.permissions)

  return {
    workspace: {
      getFiles: () => {
        if (!permissions.has('read-files')) {
          throw new Error('Plugin does not have read-files permission')
        }
        // Return mock files for demo
        return []
      },
      readFile: async (path: string) => {
        if (!permissions.has('read-files')) {
          throw new Error('Plugin does not have read-files permission')
        }
        return '' // Would read from actual workspace
      },
      writeFile: async (path: string, content: string) => {
        if (!permissions.has('write-files')) {
          throw new Error('Plugin does not have write-files permission')
        }
        // Would write to actual workspace
      },
    },
    editor: {
      getContent: () => '',
      setContent: (content: string) => {},
      getSelection: () => ({ from: 0, to: 0, text: '' }),
      insertText: (text: string) => {},
    },
    ui: {
      showMessage: (message: string, type: string) => {
        console.log(`[Plugin ${plugin.name}] ${type}: ${message}`)
      },
      showNotification: (title: string, body: string) => {
        console.log(`[Plugin ${plugin.name}] Notification: ${title} - ${body}`)
      },
      registerCommand: (id: string, label: string, action: () => void) => {
        emit('command:register', { pluginId: plugin.id, commandId: id, label, action })
      },
      registerSidebarPanel: (id: string, label: string, component: any) => {
        emit('sidebar:register', { pluginId: plugin.id, panelId: id, label, component })
      },
    },
    ai: {
      prompt: async (message: string, context?: string) => {
        if (!permissions.has('ai')) {
          throw new Error('Plugin does not have ai permission')
        }
        return 'AI response placeholder'
      },
      complete: async (text: string) => {
        if (!permissions.has('ai')) {
          throw new Error('Plugin does not have ai permission')
        }
        return text + ' (completion)'
      },
    },
    graph: {
      getNodes: () => [],
      getEdges: () => [],
      getBacklinks: (path: string) => [],
    },
  }
}

/**
 * Load a plugin from its definition
 */
export async function loadPlugin(plugin: Plugin): Promise<boolean> {
  try {
    if (registeredPlugins.has(plugin.id)) {
      console.warn(`Plugin ${plugin.id} is already loaded`)
      return false
    }

    const context = createPluginContext(plugin)

    // In production, this would load from a sandboxed iframe or web worker
    // For MVP, we create a mock instance
    const instance = {
      id: plugin.id,
      name: plugin.name,
      activate: () => {},
      deactivate: () => {},
    }

    const loaded: LoadedPlugin = {
      plugin,
      instance,
      context,
      active: false,
    }

    registeredPlugins.set(plugin.id, loaded)

    if (plugin.enabled) {
      await activatePlugin(plugin.id)
    }

    console.log(`Plugin "${plugin.name}" loaded successfully`)
    return true
  } catch (error) {
    console.error(`Failed to load plugin "${plugin.name}":`, error)
    return false
  }
}

/**
 * Activate a loaded plugin
 */
export async function activatePlugin(pluginId: string): Promise<boolean> {
  const loaded = registeredPlugins.get(pluginId)
  if (!loaded) return false

  try {
    loaded.instance.activate()
    loaded.active = true
    emit('plugin:activated', { pluginId })
    return true
  } catch (error) {
    console.error(`Failed to activate plugin "${loaded.plugin.name}":`, error)
    return false
  }
}

/**
 * Deactivate a plugin
 */
export async function deactivatePlugin(pluginId: string): Promise<boolean> {
  const loaded = registeredPlugins.get(pluginId)
  if (!loaded) return false

  try {
    loaded.instance.deactivate()
    loaded.active = false
    emit('plugin:deactivated', { pluginId })
    return true
  } catch (error) {
    console.error(`Failed to deactivate plugin "${loaded.plugin.name}":`, error)
    return false
  }
}

/**
 * Unload a plugin completely
 */
export async function unloadPlugin(pluginId: string): Promise<boolean> {
  const loaded = registeredPlugins.get(pluginId)
  if (!loaded) return false

  if (loaded.active) {
    await deactivatePlugin(pluginId)
  }

  registeredPlugins.delete(pluginId)
  eventHandlers.delete(pluginId)
  emit('plugin:unloaded', { pluginId })
  return true
}

/**
 * Get all loaded plugins
 */
export function getLoadedPlugins(): LoadedPlugin[] {
  return Array.from(registeredPlugins.values())
}

/**
 * Get plugin by ID
 */
export function getPlugin(pluginId: string): LoadedPlugin | undefined {
  return registeredPlugins.get(pluginId)
}

// --- Event System ---

export function on(event: string, handler: PluginEventHandler, pluginId?: string) {
  const key = pluginId || '__global__'
  if (!eventHandlers.has(event)) {
    eventHandlers.set(event, new Map())
  }
  const handlers = eventHandlers.get(event)!
  if (!handlers.has(key)) {
    handlers.set(key, [])
  }
  handlers.get(key)!.push(handler)
}

export function off(event: string, handler: PluginEventHandler, pluginId?: string) {
  const key = pluginId || '__global__'
  const handlers = eventHandlers.get(event)
  if (!handlers) return
  const pluginHandlers = handlers.get(key)
  if (!pluginHandlers) return
  const index = pluginHandlers.indexOf(handler)
  if (index !== -1) {
    pluginHandlers.splice(index, 1)
  }
}

function emit(event: string, data: any) {
  const handlers = eventHandlers.get(event)
  if (!handlers) return
  for (const [, pluginHandlers] of handlers) {
    for (const handler of pluginHandlers) {
      try {
        handler(data)
      } catch (error) {
        console.error(`Event handler error for "${event}":`, error)
      }
    }
  }
}

// --- Plugin Validation ---

export function validatePlugin(plugin: Plugin): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!plugin.id) errors.push('Plugin must have an id')
  if (!plugin.name) errors.push('Plugin must have a name')
  if (!plugin.version) errors.push('Plugin must have a version')
  if (!plugin.entry) errors.push('Plugin must have an entry point')

  const validTypes: PluginType[] = ['sidebar', 'command', 'editor', 'renderer', 'parser', 'theme', 'search', 'ai']
  if (!validTypes.includes(plugin.type)) {
    errors.push(`Invalid plugin type: ${plugin.type}`)
  }

  const validPermissions: PluginPermission[] = ['read-files', 'write-files', 'network', 'ai', 'git', 'ui', 'renderer', 'editor', 'parser']
  for (const perm of plugin.permissions) {
    if (!validPermissions.includes(perm)) {
      errors.push(`Invalid permission: ${perm}`)
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Check if a plugin has a specific permission
 */
export function hasPermission(pluginId: string, permission: PluginPermission): boolean {
  const loaded = registeredPlugins.get(pluginId)
  if (!loaded) return false
  return loaded.plugin.permissions.includes(permission)
}