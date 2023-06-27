import { Type } from '@sinclair/typebox'

export type GetWebsiteSchema = typeof getWebsiteSchema
export const getWebsiteSchema = {
  response: {
    200: Type.Object({
      website: Type.Boolean()
    })
  }
}
