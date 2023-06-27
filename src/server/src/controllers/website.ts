import { GetWebsiteSchema } from '../schemas/website'
import { RouteHandler } from '../types/routes'

export const getWebsite: RouteHandler<GetWebsiteSchema> = () => {
  return { website: true }
}
