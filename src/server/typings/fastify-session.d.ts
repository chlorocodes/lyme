import '@fastify/session'
import { AuthToken } from '../src/types/discord'

declare module '@fastify/session' {
  interface FastifySessionObject {
    token: AuthToken
  }
}
