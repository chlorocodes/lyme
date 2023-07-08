import { FastifySessionObject, SessionStore } from '@fastify/session'
import { client } from '../src/app'
import { Session } from 'fastify'

type Callback = (err?: Error) => void
type CallbackSession = (
  err: Error | null,
  result?: Session | null
) => void

export class PrismaStore implements SessionStore {
  set(sessionId: string, session: FastifySessionObject, callback: Callback) {
    const { accessToken, userId, expires } = session

    const createSessionPromise = client.session.create({
      data: {
        id: sessionId,
        accessToken,
        userId,
        expires: new Date(expires)
      }
    })

    createSessionPromise.then(() => callback()).catch((err) => callback(err))
  }

  get(sessionId: string, callback: CallbackSession) {
    const sessionPromise = client.session.findFirst({
      where: { id: sessionId }
    })

    sessionPromise
      .then((session) => callback(null, session)
      .catch((err) => {
        callback(err, null)
      })
  }

  destroy(sessionId: string, callback: Callback) {
    client.session
      .delete({
        where: { id: sessionId }
      })
      .then(callback)
      .catch((err) => {
        console.error(err)
      })
  }
}
