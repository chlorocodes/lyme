import { Type } from '@sinclair/typebox'

export type LoginSchema = typeof loginSchema
export const loginSchema = {
  querystring: Type.Object({
    code: Type.String()
  }),
  response: {}
}
