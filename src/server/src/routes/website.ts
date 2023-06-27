import * as controller from '../controllers/website'
import * as schemas from '../schemas/website'
import { TypedRouter } from '../types/routes'

export async function websiteRoutes(router: TypedRouter) {
  router.route({
    method: 'GET',
    url: '/',
    handler: controller.getWebsite,
    schema: schemas.getWebsiteSchema
  })
}
