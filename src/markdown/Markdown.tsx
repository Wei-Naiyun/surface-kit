import ReactMarkdown, { type Components } from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { MermaidDiagram } from './MermaidDiagram'
import './markdown.css'

export type MarkdownProps = {
  content: string
  className?: string
  /** 流程图是否播放「长出来」动画 */
  animateDiagrams?: boolean
  dark?: boolean
}

type CodeProps = { className?: string; children?: unknown }

/**
 * Markdown 渲染：GFM + 数学公式 + ```mermaid 代码块交给 MermaidDiagram。
 *
 * 注意 mermaid 要在 `pre` 这一层拦，否则会渲染成 <pre><div>…</div></pre>，
 * 既不合 HTML 规范，也会被 pre 的等宽样式污染。
 */
export const Markdown = ({
  content,
  className = '',
  animateDiagrams = true,
  dark = false,
}: MarkdownProps) => {
  const components: Components = {
    pre({ children }) {
      const child = Array.isArray(children) ? children[0] : children
      const props = (child as { props?: CodeProps } | undefined)?.props
      const language = /language-([\w-]+)/.exec(props?.className ?? '')?.[1]

      if (language === 'mermaid') {
        const code = String(props?.children ?? '').replace(/\n$/, '')
        return <MermaidDiagram code={code} animate={animateDiagrams} dark={dark} />
      }
      return <pre className="sk-pre">{children}</pre>
    },
    a({ children, ...props }) {
      return (
        <a {...props} target="_blank" rel="noreferrer noopener">
          {children}
        </a>
      )
    },
  }

  return (
    <div className={`sk-markdown ${className}`} data-sk-markdown="">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
