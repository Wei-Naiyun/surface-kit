import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 Tailwind 类名：clsx 处理条件类，twMerge 处理冲突（后者覆盖前者）。
 *
 * 上游 claudecodeui 的 `shared/utils.ts` 里还有一堆应用侧工具（通知音、页面标题、
 * 平台判定等），那些依赖它自己的 types 与 env，抽库时全部去掉了，只留这一个纯函数。
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
