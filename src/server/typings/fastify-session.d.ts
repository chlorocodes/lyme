import '@fastify/session'

declare module '@fastify/session' {
  interface FastifySessionObject {
    id: string
    userId: string
    accessToken: string
    expires: number
  }
}
