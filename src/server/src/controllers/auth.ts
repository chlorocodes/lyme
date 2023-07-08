import { LoginSchema } from '../schemas/auth'
import { AuthToken } from '../types/discord'
import { RouteHandler } from '../types/routes'

export const auth: RouteHandler = (req, res) => {
  const clientId = process.env.DISCORD_CLIENT_ID
  const redirectUri = encodeURIComponent(
    process.env.DISCORD_REDIRECT_URI as string
  )
  const redirectUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`
  return res.redirect(redirectUrl)
}

export const login: RouteHandler<LoginSchema> = async (req) => {
  const { code } = req.query
  const tokenUrl = 'https://discord.com/api/oauth2/token'
  const redirectUri = process.env.DISCORD_REDIRECT_URI as string

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID as string,
      client_secret: process.env.DISCORD_CLIENT_SECRET as string,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      scope: 'identify'
    })
  })

  const token: AuthToken = await response.json()
  req.session.token = token

  const meResponse = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`
    }
  })

  console.log({ token })

  const me = await meResponse.json()

  return me
}
