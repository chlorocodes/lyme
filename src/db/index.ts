import { join } from 'path'
import { writeFile } from 'fs/promises'
import db from './db.json'

interface User {
  id: string
  username: string
}

export interface Data {
  suggestions: string[]
  blacklist: User[]
}

export class Database {
  private data: Data

  constructor() {
    this.data = db
  }

  async save() {
    try {
      const data = JSON.stringify(this.data, null, 2)
      const filePath = join(__dirname, 'db.json')
      await writeFile(filePath, data)
    } catch (error) {
      console.error('Unable to save database', error)
    }
  }

  getBlacklist() {
    return this.data.blacklist
  }

  addToBlacklist(user: User) {
    this.data.blacklist.push(user)
    this.save()
  }

  getSuggestions() {
    return this.data.suggestions
  }

  addSuggestion(suggestion: string) {
    this.data.suggestions.push(suggestion)
    this.save()
  }
}
