import {
  ChatInputCommandInteraction,
  Client,
  Collection,
  GatewayIntentBits,
  Interaction,
  Message
} from 'discord.js'
import { commands } from './commands'
import type { Command } from './commands/core/Command'

export class Lyme {
  private client: Client
  private token: string
  private id: string
  private channelId: string
  private commands: Collection<string, Command>
  private admin: { id: string; username: string }

  constructor() {
    this.token = process.env.DISCORD_TOKEN as string
    this.id = '1110372412534571059'
    this.channelId = '1110394309724876920'
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
      ]
    })
    this.commands = commands as Collection<string, Command>
    this.admin = {
      id: '320054778371637250',
      username: 'chloro 𝕀𝕍'
    }
  }

  run() {
    this.client.once('ready', this.onReady)
    this.client.on('messageCreate', this.onMessageCreate)
    this.client.on('interactionCreate', this.onInteractionCreate)
    this.client.login(this.token)
  }

  private onReady = (c: Client<true>) => {
    console.log(`Ready! Logged in as ${c.user.tag}`)
  }

  private onMessageCreate = (message: Message) => {
    if (message.author.bot) {
      return
    }

    if (message.channel.id === this.channelId) {
      this.onBotChannelMessage(message)
    }

    if (message.content.startsWith('!confidantes')) {
      this.onConfidantes(message)
    }

    if (message.content.startsWith('!cringidantes')) {
      this.onCringidantes(message)
    }
  }

  private onInteractionCreate = (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      this.onSlashCommand(interaction)
    }
  }

  private onBotChannelMessage = (message: Message) => {
    console.log(message)
  }

  private onSlashCommand = async (interaction: ChatInputCommandInteraction) => {
    const command = this.commands.get(interaction.commandName)

    if (!command) {
      return
    }

    try {
      await command.execute(interaction)
    } catch (err) {
      console.error(err)
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true
        })
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true
        })
      }
    }
  }

  private onConfidantes(message: Message) {
    message.reply(
      'tHe coNfIdaNteS kNow wHaT’s iN yOur mOm’s pAnTs, cAUse wE wATer hEr pLanTs – 🤓'
    )
  }

  private onCringidantes(message: Message) {
    message.reply('Cringidantes are not welcome here')
  }
}
