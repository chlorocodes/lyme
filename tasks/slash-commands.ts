import { REST, Routes } from 'discord.js'
import { clientId, guildId } from '../config.json'
import { slashCommands } from '../src/commands/index'

const commands = slashCommands.map((command) => command.data.toJSON())
const rest = new REST().setToken(process.env.DISCORD_TOKEN as string)

;(async () => {
  try {
    const data = (await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    )) as any
    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    )
  } catch (error) {
    console.error(error)
  }
})()
