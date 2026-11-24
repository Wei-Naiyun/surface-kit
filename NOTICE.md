# NOTICE

本包的原语层来自 [claudecodeui](https://github.com/siteboon/claudecodeui)（CloudCLI），
按 **GNU Affero General Public License v3.0 or later** 使用。完整许可证见同目录 `LICENSE`。

- 上游仓库：https://github.com/siteboon/claudecodeui
- 上游版本：`@cloudcli-ai/cloudcli` 1.37.9（main 分支，2026-11-19 最后提交）
- 上游许可：AGPL-3.0-or-later

## 取自上游的文件（基本逐字复制，仅改 import 路径）

```
src/ui/                  ← src/shared/ui/             Button, Card, Badge, Input, Dialog, Tooltip,
                                                       Command, Collapsible, ScrollArea, Shimmer,
                                                       PillBar, ActionMenu, DarkModeToggle,
                                                       LLMProviderLogo, ClaudeLogo, CodexLogo,
                                                       CursorLogo, OpenCodeLogo, index.ts
src/styles/theme.css     ← src/index.css               设计令牌 + Tailwind 基座（28,352 B）
tailwind.config.js       ← tailwind.config.js          主题扩展（颜色/圆角/动画/typography 插件）
```

## 本包新写或改动的部分

- `src/theme.tsx`：上游用应用自己的 `ThemeContext`（读后端设置）；这里重写为自包含实现
  （localStorage + matchMedia），字段名保持 `isDarkMode` / `toggleDarkMode` 以便原语直接复用。
- `src/utils.ts`：上游 9 KB 的工具集只保留 `cn`，其余依赖应用 types / env 的已删除。
- `src/types.ts`：只保留 `LLMProvider` 联合类型。
- `src/markdown/*`：新增。Markdown 渲染（react-markdown + GFM + KaTeX）与 Mermaid 流程图组件，
  含柔和样式与「顺着箭头长出来」的动画。
- `src/index.ts`、`package.json`、`vite.config.ts`、`tsconfig*.json`、`demo/`、`serve-static.mjs`：新增。

## 未包含

上游的 `chat/`、`code-editor/`、`git-panel/`、`file-tree/`、`terminal` 等业务模块没有搬过来：
它们与 WebSocket、CLI 进程、`shared/api.ts`（34 KB）和 `shared/types.ts`（84 KB）强耦合，属于应用层。

## 许可影响

AGPL-3.0-or-later 是强 copyleft：分发本包、或把它作为网络服务提供给他人时，
衍生作品同样需要以 AGPL 授权并提供源码。闭源分发请勿使用本包。
