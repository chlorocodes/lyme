import { Command } from '../core/Command'

export const ping = new Command({
  name: 'ping',
  description: 'Replies with pong',
  handler: async (interaction) => {
    console.log(interaction)
    if (interaction.isRepliable()) {
      interaction.reply('Pong!')
    }
  }
})
