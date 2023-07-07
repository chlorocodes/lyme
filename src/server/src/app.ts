import { join } from 'node:path'
import server from 'fastify'
import serveStatic from '@fastify/static'
import { authRoutes } from './routes/auth'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'

export const app = server({
  logger: true
})

app.register(fastifyCookie)
app.register(fastifySession, {
  secret: process.env.SESSION_SECRET as string,
  cookie: { secure: false }
})

app.register(serveStatic, { root: join(__dirname, '..') })
app.register(authRoutes, { prefix: '/api/auth' })
