import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Strict CSP injected only into the production build's HTML.
// Skipped in dev because Vite's HMR uses inline <script type="module"> blocks
// that 'script-src self' would block.
const PROD_CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https://cdn.jsdelivr.net https://cdn.simpleicons.org https://api.iconify.design https://i.ytimg.com",
  "connect-src 'self' https://api.web3forms.com https://www.youtube.com",
  'upgrade-insecure-requests',
].join('; ')

function cspPlugin() {
  return {
    name: 'inject-prod-csp',
    apply: 'build',
    transformIndexHtml(html) {
      const tag = `<meta http-equiv="Content-Security-Policy" content="${PROD_CSP}" />`
      return html.replace('</head>', `  ${tag}\n  </head>`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cspPlugin()],
})
