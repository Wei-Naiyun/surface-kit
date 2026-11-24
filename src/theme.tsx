import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'system'

type ThemeContextValue = {
  theme: Theme
  isDarkMode: boolean
  setTheme: (theme: Theme) => void
  toggleDarkMode: () => void
}

const STORAGE_KEY = 'ui-kit-theme'

const ThemeContext = createContext<ThemeContextValue | null>(null)

const systemPrefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

const readStored = (): Theme | null => {
  if (typeof localStorage === 'undefined') {
    return null
  }
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : null
}

const apply = (theme: Theme) => {
  if (typeof document === 'undefined') {
    return
  }
  const dark = theme === 'dark' || (theme === 'system' && systemPrefersDark())
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}

/**
 * 主题上下文：上游用的是应用自己的 ThemeContext，这里换成一个自包含的实现，
 * 只依赖 localStorage + matchMedia，不依赖任何后端或应用 store。
 */
export const ThemeProvider = ({
  children,
  defaultTheme = 'system',
}: {
  children: ReactNode
  defaultTheme?: Theme
}) => {
  const [theme, setThemeState] = useState<Theme>(() => readStored() ?? defaultTheme)

  useEffect(() => {
    apply(theme)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined') {
      return
    }
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => apply('system')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, next)
    }
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isDarkMode: theme === 'dark' || (theme === 'system' && systemPrefersDark()),
      setTheme,
      toggleDarkMode: () => setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark'),
    }),
    [theme, setTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within <ThemeProvider>')
  }
  return context
}
