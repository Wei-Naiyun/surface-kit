import { useEffect, useId, useRef, useState } from 'react'
import './mermaid-flow.css'

export type MermaidDiagramProps = {
  /** Mermaid 源码（```mermaid 代码块的内容） */
  code: string
  className?: string
  /** 是否播放「顺着流程长出来」的动画，默认开启 */
  animate?: boolean
  /** 深色主题（影响 Mermaid 内置配色；节点样式另有 CSS 覆盖） */
  dark?: boolean
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Mermaid 流程图。
 *
 * 和直接 `mermaid.render` 的区别：
 *   1. 内置一套柔和样式（圆角、细描边、轻阴影、曲线连线），避免默认主题那种生硬感；
 *   2. 渲染完成后给每条边设 `stroke-dasharray`，按顺序把连线一段段「画」出来，
 *      节点随后依次淡入放大 —— 视觉上就是流程顺着箭头一点点长出来。
 * 动画只用 Web Animations API，不额外引入动画库；`prefers-reduced-motion` 下自动关闭。
 */
export const MermaidDiagram = ({ code, className = '', animate = true, dark = false }: MermaidDiagramProps) => {
  const rawId = useId()
  const hostRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const render = async () => {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: dark ? 'dark' : 'neutral',
          fontFamily: 'inherit',
          flowchart: {
            curve: 'basis',
            htmlLabels: true,
            padding: 14,
            nodeSpacing: 44,
            rankSpacing: 48,
          },
        })
        const id = `sk-mermaid-${rawId.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`
        const { svg: rendered } = await mermaid.render(id, code)
        if (!cancelled) {
          setSvg(rendered)
          setError(null)
        }
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : String(cause))
        }
      }
    }

    void render()
    return () => {
      cancelled = true
    }
  }, [code, dark, rawId])

  useEffect(() => {
    const host = hostRef.current
    if (!svg || !host || !animate || prefersReducedMotion()) {
      return
    }

    const edges = [
      ...host.querySelectorAll<SVGPathElement>(
        'path.flowchart-link, .edgePath path, path.edge-thickness-normal'
      ),
    ]
    const nodes = [...host.querySelectorAll<SVGGElement>('g.node, g.cluster')]

    const timers: number[] = []

    // 先量长度再隐藏，避免动画开始时闪一下
    const lengths = edges.map((edge) => edge.getTotalLength())
    edges.forEach((edge, index) => {
      edge.style.strokeDasharray = `${lengths[index]}`
      edge.style.strokeDashoffset = `${lengths[index]}`
    })
    nodes.forEach((node) => {
      node.style.opacity = '0'
    })

    edges.forEach((edge, index) => {
      timers.push(
        window.setTimeout(() => {
          edge.animate(
            [{ strokeDashoffset: `${lengths[index]}` }, { strokeDashoffset: '0' }],
            { duration: 460, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }
          )
        }, index * 130)
      )
    })

    nodes.forEach((node, index) => {
      timers.push(
        window.setTimeout(() => {
          node.animate(
            [
              { opacity: 0, transform: 'translateY(6px) scale(0.96)' },
              { opacity: 1, transform: 'none' },
            ],
            { duration: 320, easing: 'cubic-bezier(0.34, 1.3, 0.64, 1)', fill: 'forwards' }
          )
          node.style.opacity = '1'
        }, 150 + index * 110)
      )
    })

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [svg, animate])

  if (error) {
    return (
      <pre className="sk-mermaid sk-mermaid-error" data-sk-mermaid-error="">
        {`Mermaid 渲染失败：${error}\n\n${code}`}
      </pre>
    )
  }

  return (
    <div
      ref={hostRef}
      className={`sk-mermaid ${className}`}
      data-sk-mermaid=""
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
