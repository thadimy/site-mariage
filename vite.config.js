import { defineConfig }       from 'vite'
import { resolve, join, extname } from 'path'
import { existsSync, statSync, readFileSync } from 'fs'
import { viteStaticCopy }    from 'vite-plugin-static-copy'

const MIME = {
  '.html':  'text/html; charset=utf-8',
  '.css':   'text/css',
  '.js':    'text/javascript',
  '.json':  'application/json',
  '.svg':   'image/svg+xml',
  '.png':   'image/png',
  '.jpg':   'image/jpeg',
  '.jpeg':  'image/jpeg',
  '.webp':  'image/webp',
  '.avif':  'image/avif',
  '.gif':   'image/gif',
  '.ico':   'image/x-icon',
  '.woff':  'font/woff',
  '.woff2': 'font/woff2',
  '.ttf':   'font/ttf',
  '.otf':   'font/otf',
  '.mp4':   'video/mp4',
  '.webm':  'video/webm',
}

export default defineConfig(({ command }) => ({
  root: '.',
  // Par défaut le site est servi à la RACINE ('/') : c'est ce qu'attendent
  // Netlify, `npm run preview`, et le dev — donc prod === dev.
  // GitHub Pages en page projet (servie sous /<repo>/) ? Builder avec
  // VITE_BASE=/site-mariage/ (le workflow .github/workflows/deploy.yml le fait).
  base: command === 'build' ? (process.env.VITE_BASE || '/') : '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  publicDir: 'public',
  plugins: [
    /* ── Serve programme/ as raw static files in dev (no Vite transform) ── */
    {
      name: 'static-programme',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url?.startsWith('/programme')) return next()

          let urlPath = req.url.replace(/[?#].*$/, '')
          if (urlPath === '/programme' || urlPath === '/programme/')
            urlPath = '/programme/index.html'

          const disk = join(__dirname, urlPath.slice(1))
          if (existsSync(disk) && statSync(disk).isFile()) {
            const type = MIME[extname(disk).toLowerCase()] ?? 'application/octet-stream'
            res.setHeader('Content-Type', type)
            res.end(readFileSync(disk))
            return
          }
          next()
        })
      },
    },
    viteStaticCopy({
      targets: [{ src: 'programme', dest: '.' }]
    }),
  ]
}))
