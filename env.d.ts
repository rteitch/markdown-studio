/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'mermaid' {
  const mermaid: any
  export default mermaid
}

declare module 'graphology' {
  const Graph: any
  export default Graph
}

declare module 'sigma' {
  const Sigma: any
  export default Sigma
}