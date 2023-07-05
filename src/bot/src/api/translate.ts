import { join } from 'node:path'
import { v2 } from '@google-cloud/translate'

const translator: v2.Translate = new v2.Translate({
  projectId: 'lyme-390002',
  keyFilename: join(__dirname, '..', 'google-keys.json')
})
