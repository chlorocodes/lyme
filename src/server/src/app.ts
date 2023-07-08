import { join } from 'node:path'
import serveStatic from '@fastify/static'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import { PrismaClient } from '@prisma/client'
import server from 'fastify'
import { authRoutes } from './routes/auth'

export const client = new PrismaClient()

export const app = server({
  logger: true
})

app.get('/', (request, reply) => {
  console.log(request.session.token)
  console.log(request.session.token)
  console.log(request.session.token)
  console.log(request.session.token)
  console.log(request.session.token)
  reply.send(request.cookies.sessionId)
})

app.register(fastifyCookie, {})
app.register(fastifySession, {
  secret: process.env.SESSION_SECRET as string,
  cookie: { secure: false }
})

app.register(serveStatic, { root: join(__dirname, '..') })
app.register(authRoutes, { prefix: '/api/auth' })
