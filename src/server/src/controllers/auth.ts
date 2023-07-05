import { LoginSchema } from '../schemas/auth'
import { RouteHandler } from '../types/routes'

export const login: RouteHandler<LoginSchema> = () => {
  const redirectUrl =
    'https://discord.com/api/oauth2/authorize?client_id=1110372412534571059&redirect_uri=http%3A%2F%2Flocalhost%3A5173&response_type=code&scope=identify'
  return { user: 'chloro' }
}
