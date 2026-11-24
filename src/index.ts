/**
 * surface-kit —— 从 claudecodeui（AGPL-3.0-or-later）的前端原语层抽出的可复用 UI 包。
 *
 * 包含：
 *   - 基础原语（Button / Card / Badge / Input / Dialog / Tooltip / Command /
 *     Collapsible / ScrollArea / Shimmer / PillBar / ActionMenu / 厂商 logo / DarkModeToggle）
 *   - 主题上下文（自包含，localStorage + matchMedia，不依赖应用 store）
 *   - Markdown 渲染 + Mermaid 流程图（带「顺着流程长出来」的动画）
 *
 * 样式：`import 'surface-kit/theme.css'`（设计令牌 + Tailwind 基座）。
 */
import './styles/theme.css'

export * from './ui/index.js'
export * from './theme.js'
export * from './types.js'
export * from './utils.js'
export * from './markdown/Markdown.js'
export * from './markdown/MermaidDiagram.js'
