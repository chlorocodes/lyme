import { join } from 'path'
import { Client, GatewayIntentBits, GuildMember, Message } from 'discord.js'
import { v2 } from '@google-cloud/translate'
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'

const assetsFolder = join(__dirname, 'assets')

type ImagePath =
  | 'man'
  | 'wut'
  | 'powerscaling'
  | 'mirror'
  | 'stupid'
  | 'woot'
  | 'bitchPls'

export class Lyme {
  private client: Client
  private token: string
  private id: string
  private channelId: string
  private roleId: string
  private admin: { id: string; username: string }
  private translator: v2.Translate
  private imagePaths: Record<ImagePath, string>
  private openai: OpenAIApi
  private conversation: ChatCompletionRequestMessage[]

  constructor() {
    this.token = process.env.DISCORD_TOKEN as string
    this.id = '1110372412534571059'
    this.channelId = '1110394309724876920'
    this.roleId = '1110387937952153643'
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
      ]
    })
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
      woot: join(assetsFolder, 'woot.jpeg'),
      bitchPls: join(assetsFolder, 'bitchPls.jpg')
    }
    this.openai = new OpenAIApi(
      new Configuration({
        apiKey: process.env.CHATGPT_TOKEN
      })
    )
    this.conversation = []
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

    if (message.mentions.roles.get(this.roleId)) {
      return this.onRoleMention(message)
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

    if (msg.startsWith('!bitchplease') || msg.startsWith('!bitchpls')) {
      return this.onBitchPls(message)
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
    this.handleDiscussionWithBot(message)
  }

  private onRoleMention(message: Message) {
    this.handleDiscussionWithBot(message)
  }

  private onReplyToBot(message: Message) {
    this.handleDiscussionWithBot(message)
  }

  private async handleDiscussionWithBot(message: Message) {
    const content = message.content.trim()
    this.conversation.push({ role: 'user', content })

    try {
      const chatCompletion = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: this.conversation
      })
      const response = chatCompletion.data.choices[0]
        .message as ChatCompletionRequestMessage

      this.conversation.push(response)
      if (this.conversation.length > 10) {
        this.conversation = this.conversation.slice(-10)
      }

      if (response.content?.startsWith('As an AI language model,')) {
        response.content = response.content.slice(25)
      } else if (response.content?.startsWith('As an AI assistant,')) {
        response.content = response.content.slice(20)
      }
      message.reply(response.content ?? 'Unable to generate a response')
    } catch (error) {
      console.error(error)
      message.reply('Unable to generate a response')
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

  private async onBitchPls(message: Message) {
    message.channel.send({
      files: [
        {
          attachment: this.imagePaths.bitchPls
        }
      ]
    })
  }
}
