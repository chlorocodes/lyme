import { join } from 'path'
import {
  Client,
  Collection,
  GatewayIntentBits,
  GuildMember,
  Message
} from 'discord.js'
import { v2 } from '@google-cloud/translate'
import { commands } from './commands'
import type { Command } from './commands/core/Command'

const assetsFolder = join(__dirname, 'assets')

type ImagePath = 'man' | 'wut' | 'powerscaling' | 'mirror' | 'stupid' | 'woot'

export class Lyme {
  private client: Client
  private token: string
  private id: string
  private channelId: string
  private commands: Collection<string, Command>
  private admin: { id: string; username: string }
  private translator: v2.Translate
  private imagePaths: Record<ImagePath, string>

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
    this.imagePaths = {
      man: join(assetsFolder, 'man.png'),
      powerscaling: join(assetsFolder, 'powerscaling.png'),
      wut: join(assetsFolder, 'wut.png'),
      mirror: join(assetsFolder, 'mirror.png'),
      stupid: join(assetsFolder, 'stupid.jpeg'),
      woot: join(assetsFolder, 'woot.jpeg')
    }
  }

  run() {
    this.client.once('ready', this.onReady)
    this.client.on('messageCreate', this.onMessageCreate)
    this.client.login(this.token)
  }

  private onReady = (c: Client<true>) => {
    console.log(`Ready! Logged in as ${c.user.tag}`)
  }

  private onMessageCreate = async (message: Message) => {
    if (message.author.bot) {
      return
    }

    if (message.mentions.repliedUser?.id === this.id) {
      return this.onReplyToBot(message)
    }

    if (message.mentions.users.get(this.id)) {
      return this.onBotMention(message)
    }

    const msg = message.content.trim().toLowerCase()

    if (msg.startsWith('!confidantes')) {
      return this.onConfidantes(message)
    }

    if (msg.startsWith('!cringidantes')) {
      return this.onCringidantes(message)
    }

    if (msg.startsWith('!abuse')) {
      return this.onAbuse(message)
    }

    if (msg.startsWith('!translate')) {
      return this.onTranslate(message)
    }

    if (msg.startsWith('!wut') || msg.startsWith('!huh')) {
      return this.onWut(message)
    }

    if (msg.startsWith('!man')) {
      return this.onMan(message)
    }

    if (msg.startsWith('!powerscaling')) {
      return this.onPowerScaling(message)
    }

    if (msg.startsWith('!stupid')) {
      return this.onStupid(message)
    }

    if (msg.startsWith('!mirror')) {
      return this.onMirror(message)
    }

    if (msg.startsWith('!woot')) {
      return this.onWoot(message)
    }

    if (message.content.trim().startsWith('!debug')) {
      console.log(message)
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

    const gayInsults = [
      'gay',
      'ur gay',
      'u gay',
      'your gay',
      'youre gay',
      "you're gay"
    ]

    if (fuInsults.includes(content)) {
      message.reply(':angry:')
    } else if (bitchInsults.includes(content)) {
      message.reply("nah you're the lil bitch")
    } else if (gayInsults.includes(content)) {
      message.reply('y u projecting though')
    }

    if (content === 'good bot') {
      message.reply('thanks man :face_holding_back_tears:')
    }

    if (content.startsWith('hi')) {
      message.reply('hi :blush:')
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
    if (untranslated.length > 600) {
      message.reply("Sorry, I'm not going to translate a message this long")
      return
    }
    try {
      const [translation] = await this.translator.translate(untranslated, {
        to: 'en'
      })
      reference.reply(`Translation: ${translation}`)
    } catch (error) {
      message.reply(`Unable to translate ${untranslated}`)
    }
  }

  private async onMan(message: Message) {
    message.channel.send({
      files: [
        {
          attachment: this.imagePaths.man
        }
      ]
    })
  }

  private async onWut(message: Message) {
    message.channel.send({
      files: [
        {
          attachment: this.imagePaths.wut
        }
      ]
    })
  }

  private async onPowerScaling(message: Message) {
    message.channel.send({
      files: [
        {
          attachment: this.imagePaths.powerscaling
        }
      ]
    })
  }

  private async onMirror(message: Message) {
    message.channel.send({
      files: [
        {
          attachment: this.imagePaths.mirror
        }
      ]
    })
  }

  private async onWoot(message: Message) {
    message.channel.send({
      files: [
        {
          attachment: this.imagePaths.woot
        }
      ]
    })
  }

  private async onStupid(message: Message) {
    message.channel.send({
      files: [
        {
          attachment: this.imagePaths.stupid
        }
      ]
    })
  }
}
