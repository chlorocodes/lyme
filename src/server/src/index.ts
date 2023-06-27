import { app } from './app'

const isProd = process.env.NODE_ENV === 'production'
const host = '::'
const port = process.env.PORT ?? isProd ? 80 : 3000

app.listen({ port, host }, (err) => {
  if (err) {
    console.error(err)
  }
})
