import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv'

// Populate process.env with website .env file
dotenv.config()

// Read the proxy "port" from the server .env file
const serverEnvPath = join(__dirname, '..', 'server', '.env')
const serverEnvFile = readFileSync(serverEnvPath)
const serverEnv = dotenv.parse(serverEnvFile)
const serverPort = serverEnv.port ?? 3000

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT ?? 4000),
    proxy: {
      '/api': `http://localhost:${serverPort}`
    }
  }
})
