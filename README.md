# surface-kit

一组 React + Tailwind 的界面原语，外加一个带「流程图动画」的 Markdown 渲染器。
从 [claudecodeui](https://github.com/siteboon/claudecodeui) 的前端原语层抽出并解耦，**AGPL-3.0-or-later**。

- 许可：AGPL-3.0-or-later（见 `LICENSE`），出处与改动见 `NOTICE.md`
- 依赖：React 18/19（peer）、`clsx`、`tailwind-merge`、`class-variance-authority`、`cmdk`、`lucide-react`
- 可选：`mermaid`（流程图）、`katex`（公式）

## 安装

```bash
pnpm add surface-kit react react-dom
# 需要流程图 / 公式时
pnpm add mermaid katex
```

```tsx
import { ThemeProvider, Button, Card, Markdown } from 'surface-kit'
import 'surface-kit/theme.css'

<ThemeProvider>
  <Card>
    <Button>确定</Button>
    <Markdown content={text} />
  </Card>
</ThemeProvider>
```

`theme.css` 里是设计令牌 + Tailwind 基座。项目如果自己也用 Tailwind，直接把这份 CSS 引进来即可，
不要再用自己的 `@tailwind base` 覆盖一遍。

## 包含什么

| 分组 | 内容 |
| --- | --- |
| 原语 | `Button` `Card` `Badge` `Input` `Dialog` `Tooltip` `Command`（cmdk 包装） `Collapsible` `ScrollArea` `Shimmer` `PillBar` `ActionMenu` `DarkModeToggle` `LLMProviderLogo` 与四个厂商 logo |
| 主题 | `ThemeProvider` / `useTheme`：`light` / `dark` / `system`，localStorage + matchMedia，不依赖任何应用 store |
| Markdown | `Markdown`：react-markdown + remark-gfm + remark-math + rehype-katex，` ```mermaid ` 代码块自动换成真 SVG |
| 流程图 | `MermaidDiagram`：柔和样式（圆角、细描边、轻阴影、曲线连线）+「顺着箭头长出来」的动画 |

### 流程图动画怎么做的

渲染完成后，组件量出每条连线的 `getTotalLength()`，把 `stroke-dasharray` 与 `stroke-dashoffset`
设成同样的长度（连线先不可见），然后用 Web Animations API 按 DOM 顺序把 `dashoffset` 收到 0，
节点再依次淡入放大。整个过程只用浏览器原生 API，不引入动画库；
`prefers-reduced-motion: reduce` 下直接跳过动画。

```tsx
<MermaidDiagram code={flowSource} animate dark={isDarkMode} />
```

## 开发

```bash
pnpm install --allow-build=esbuild
pnpm typecheck      # tsc --noEmit
pnpm build          # dist/index.js + dist/style.css + d.ts
pnpm demo:build     # 演示页 → dist-demo/
pnpm serve          # 静态托管 dist-demo（默认 5399）
```

## 已知问题

- 演示页用**静态构建 + 极简静态服务**（`serve-static.mjs`），不用 Vite dev server：
  dev server 会接管 stdin（无控制台环境里 EOF 就退出）、文件监听撞到临时文件会抛 `EBUSY` 崩进程，
  首次加载几百个模块时还会卡住不挂载。
- `mermaid` 与 `katex` 都是动态 `import`：只有页面真的出现流程图/公式时才会去下载对应 chunk
  （mermaid 核心约 678 kB，各图表类型按需再拆）。
- 上游 `shared/utils.ts` 里的应用侧工具（通知音、页面标题、平台判定）没有搬过来，只保留 `cn`；
  `src/shared/types.ts` 那 84 KB 的后端类型也没有搬，只保留了 UI 需要的 `LLMProvider` 联合类型。

## 实测

- `tsc --noEmit`：0 error
- `pnpm build`：`dist/index.js` 45,632 B、`dist/style.css` 59,881 B、25 个 `.d.ts`
- 演示页 headless Edge + CDP：`rootHtmlLen=39,478`、`mermaid svg=1`、`nodes=9`、`edges=8`、
  参与动画的边 6 条、点「重播动画」后仍正常重渲染、`errors=0`
