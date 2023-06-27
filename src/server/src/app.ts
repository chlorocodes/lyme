import { join } from 'node:path'
import server from 'fastify'
import serveStatic from '@fastify/static'
import { websiteRoutes } from './routes/website'

export const app = server({
  logger: true
})

app.register(serveStatic, { root: join(__dirname, '..') })
app.register(websiteRoutes)
