import { join } from 'node:path'
import server from 'fastify'
import serveStatic from '@fastify/static'
import { authRoutes } from './routes/auth'

export const app = server({
  logger: true
})

app.register(serveStatic, { root: join(__dirname, '..') })
app.register(authRoutes, { prefix: '/api/auth' })
