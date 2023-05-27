import { Collection } from 'discord.js'
import { ping } from './ping'
import { image } from './image'
import type { Command } from './core/Command'

export const commands = new Collection<string, Command>()
export const slashCommands = [ping, image]

slashCommands.forEach((command) => {
  commands.set(command.data.name, command)
})
