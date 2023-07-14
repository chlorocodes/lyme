import { join } from 'node:path'
import serveStatic from '@fastify/static'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import server from 'fastify'
import { authRoutes } from './routes/auth'
import { PrismaStore } from '../prisma/store'

export const app = server({
  logger: true
})

app.register(fastifyCookie)
app.register(fastifySession, {
  secret: process.env.SESSION_SECRET as string,
  cookie: { secure: 'auto' },
  store: new PrismaStore()
})

app.register(serveStatic, { root: join(__dirname, '..') })
app.register(authRoutes, { prefix: '/api/auth' })

app.get('/account', (req) => {
  console.log(req.session.userId)
  console.log(req.session.username)
  return { status: 'success' }
})
