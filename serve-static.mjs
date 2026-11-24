/**
 * 极简静态服务：只发 dist-demo 目录，不转换、不监听文件。
 * 用 Vite 的 Node API 起 dev server 会在无控制台环境里因为 stdin/watcher 自毁，
 * 演示页是静态的，构建一次 + 静态服务最稳（详见 README 的「已知问题」）。
 */
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'

const root = process.env.SK_ROOT ?? new URL('./dist-demo', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const port = Number(process.env.SK_PORT ?? 5399)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json; charset=utf-8',
}

createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0])
  let filePath = normalize(join(root, urlPath))

  if (!filePath.startsWith(root)) {
    res.writeHead(403).end('forbidden')
    return
  }
  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html')
  }
  if (!existsSync(filePath)) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end(`404 ${urlPath}`)
    return
  }

  res.writeHead(200, {
    'content-type': MIME[extname(filePath)] ?? 'application/octet-stream',
    'cache-control': 'no-store',
  })
  createReadStream(filePath).pipe(res)
}).listen(port, '0.0.0.0', () => {
  console.log(`static server on http://127.0.0.1:${port}/  root=${root}`)
})

setInterval(() => {}, 1 << 30)
