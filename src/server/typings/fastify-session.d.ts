import '@fastify/session'
import { AuthToken } from '../src/types/discord'

declare module '@fastify/session' {
  interface FastifySessionObject {
    id: string
    userId: string
    accessToken: string
    scope: string
    expires: number
    token: AuthToken
  }
}
