import { join } from 'path'
import {
  ChatInputCommandInteraction,
  Client,
  Collection,
  GatewayIntentBits,
  GuildMember,
  Interaction,
  Message
} from 'discord.js'
import { v2 } from '@google-cloud/translate'
import { commands } from './commands'
import type { Command } from './commands/core/Command'

export class Lyme {
  private client: Client
  private token: string
  private id: string
  private channelId: string
  private commands: Collection<string, Command>
  private admin: { id: string; username: string }
  private translator: v2.Translate

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
    this.translator = new v2.Translate({
      projectId: 'lyme-390002',
      keyFilename: join(__dirname, 'google-keys.json')
    })
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
    console.log('onMessageCreate')

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

    if (message.content.trim().startsWith('!confidantes')) {
      return this.onConfidantes(message)
    }

    if (message.content.trim().startsWith('!cringidantes')) {
      return this.onCringidantes(message)
    }

    if (message.content.trim().startsWith('!abuse')) {
      return this.onAbuse(message)
    }

    if (message.content.trim().startsWith('!translate')) {
      return this.onTranslate(message)
    }

    if (message.content.trim().startsWith('!list')) {
      if (message.author.id === this.admin.id && message.mentions.repliedUser) {
        message.reply(
          `${message.mentions.repliedUser.username} has been added to Chloro's vengeance list. :saluting_face:`
        )
      }
    }
  }

  private onInteractionCreate = (interaction: Interaction) => {
    console.log('onInteractionCreate')
    if (interaction.isChatInputCommand()) {
      this.onSlashCommand(interaction)
    }
  }

  private onBotChannelMessage = (message: Message) => {
    console.log('onBotChannelMessage')
    console.log(message)
  }

  private onSlashCommand = async (interaction: ChatInputCommandInteraction) => {
    console.log('onSlashCommand')
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
    console.log('onConfidantes')
    message.reply(
      'tHe coNfIdaNteS kNow wHaT’s iN yOur mOm’s pAnTs, cAUse wE wATer hEr pLanTs – 🤓'
    )
  }

  private onCringidantes(message: Message) {
    console.log('onCringidantes')
    message.reply('Cringidantes are not welcome here')
  }

  private onBotMention(message: Message) {
    console.log('onBotMention')
    let content = message.content.toLowerCase().trim()

    if (content.startsWith(`<@${this.id}>`)) {
      content = content.slice(`<@${this.id}>`.length).trim()
    }

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
    }
  }

  private onReplyToBot(message: Message) {
    console.log('onReplyToBot')
    if (message.content.toLowerCase().startsWith('good bot')) {
      message.reply('thanks man :face_holding_back_tears:')
    } else if (message.content.toLowerCase().startsWith('bad bot')) {
      message.reply('sorry :cry:')
    } else if (
      message.content === '!list' &&
      message.author.id === this.admin.id &&
      message.mentions.repliedUser
    ) {
      message.reply(
        `${message.mentions.repliedUser.username} has been added to Chloro's vengeance list. :saluting_face:`
      )
    }
  }

  private async onAbuse(message: Message) {
    if (message.author.id !== this.admin.id) {
      message.reply('Only chloro is allowed to abuse people :laughing:')
      return
    }

    try {
      const victim = message.mentions.members?.at(0) as GuildMember
      const oldNickname = victim.nickname ?? victim.user.username
      const [, , newNickname] = message.content.split(' ')
      await victim?.setNickname(newNickname)
      message.reply(`I have renamed ${oldNickname} to ${newNickname}`)
    } catch (error) {
      message.reply("I don't have permission to rename them :(")
    }
  }

  private async onTranslate(message: Message) {
    const reference = await message.fetchReference()
    const untranslated = reference.content
    try {
      const [translation] = await this.translator.translate(untranslated, {
        to: 'en'
      })
      reference.reply(`Translation: ${translation}`)
    } catch (error) {
      message.reply(`Unable to translate ${untranslated}`)
    }
  }
}
