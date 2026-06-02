import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'editor',
      component: () => import('@/views/EditorView.vue'),
    },
    {
      path: '/graph',
      name: 'graph',
      component: () => import('@/views/GraphView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
    },
    {
      path: '/publish',
      name: 'publish',
      component: () => import('@/components/publishing/PublishPanel.vue'),
    },
    {
      path: '/plugins',
      name: 'plugins',
      component: () => import('@/components/plugins/PluginManager.vue'),
    },
  ],
})

export default router