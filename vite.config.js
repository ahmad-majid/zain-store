import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev plugin to emulate Netlify serverless function locally during development
function netlifyDevServerPlugin() {
  return {
    name: 'netlify-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/.netlify/functions/send-email')) {
          if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
            res.statusCode = 200
            res.end()
            return
          }

          if (req.method === 'POST') {
            try {
              let rawBody = ''
              for await (const chunk of req) {
                rawBody += chunk
              }

              const { handler } = await import('./netlify/functions/send-email.js')
              const response = await handler({
                httpMethod: 'POST',
                body: rawBody,
              })

              res.statusCode = response.statusCode || 200
              if (response.headers) {
                for (const [k, v] of Object.entries(response.headers)) {
                  res.setHeader(k, v)
                }
              }
              res.end(response.body)
              return
            } catch (err) {
              console.error('Dev email handler error:', err)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
              return
            }
          }
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), netlifyDevServerPlugin()],
})
