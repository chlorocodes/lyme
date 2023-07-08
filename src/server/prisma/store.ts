import { FastifySessionObject, SessionStore } from '@fastify/session'
import { Session } from 'fastify'
import { client } from '../src/app'

type Callback = (err?: any) => void
type CallbackSession = (err: any, result?: Session | null) => void

export class PrismaStore implements SessionStore {
  set(sessionId: string, session: FastifySessionObject, callback: Callback) {}

  get(sessionId: string, callback: CallbackSession) {}

  destroy(sessionId: string, callback: Callback) {}
}
