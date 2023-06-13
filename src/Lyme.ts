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
    console.log(message)

    if (message.author.bot) {
      return
    }

    if (message.mentions.repliedUser?.id === this.id) {
      return this.onReplyToBot(message)
    }

    if (message.mentions.users.get(this.id)) {
      return this.onBotMention(message)
    }

    if (message.channel.id === this.channelId) {
      return this.onBotChannelMessage(message)
    }

    if (message.content.startsWith('!confidantes')) {
      return this.onConfidantes(message)
    }

    if (message.content.startsWith('!cringidantes')) {
      return this.onCringidantes(message)
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

  private onBotMention(message: Message) {
    let content = message.content.toLowerCase().trim()

    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@')

    if (content.startsWith(`<@${this.id}>`)) {
      content = content.slice(`<@${this.id}>`.length)
    }

    console.log(content)
    console.log('##############################')

    const fuInsults = [
      'fu',
      'f u',
      'fuc u',
      'fuck u',
      'fk u',
      'fuck you',
      'fuck yu',
      'fuck yourself',
      'go fuck yourself'
    ]

    const bitchInsults = [
      'bitch',
      "you're a bitch",
      'your a bitch',
      'u bitch',
      'ur a bitch',
      'youre a bitch'
    ]

    if (fuInsults.includes(content)) {
      message.reply(':angry:')
    } else if (bitchInsults.includes(content)) {
      message.reply("nah you're the lil bitch")
    }

    if (content === 'good bot') {
      message.reply('thanks man :face_holding_back_tears:')
    }

    if (content.startsWith('hi')) {
      message.reply('hi friend :blush:')
    } else {
      console.log(content)
      console.log(content)
      console.log(content)
      console.log(content)
      console.log(content)
    }
  }

  private onReplyToBot(message: Message) {
    if (message.content.toLowerCase().startsWith('good bot')) {
      message.reply('thanks man :face_holding_back_tears:')
    } else if (message.content.toLowerCase().startsWith('bad bot')) {
      message.reply('sorry :cry:')
    }
  }
}
