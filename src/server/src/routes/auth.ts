import * as controller from '../controllers/auth'
import * as schemas from '../schemas/auth'
import { TypedRouter } from '../types/routes'

export async function authRoutes(router: TypedRouter) {
  router.route({
    method: 'GET',
    url: '/login',
    handler: controller.login,
    schema: schemas.loginSchema
  })
}
