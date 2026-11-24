import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'surface-kit'
import 'katex/dist/katex.min.css'
import '../src/styles/theme.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
)
