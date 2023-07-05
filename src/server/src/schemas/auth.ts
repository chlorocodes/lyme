import { Type } from '@sinclair/typebox'

export type LoginSchema = typeof loginSchema
export const loginSchema = {
  response: {
    200: Type.Object({
      user: Type.String()
    })
  }
}
