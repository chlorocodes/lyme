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

const blacklistedWords = ['nigger']

export class Lyme {
  private client: Client
  private token: string
  private id: string
  private localChannelId: string
  private remoteChannelId: string
  private roleId: string
  private admin: { id: string; username: string }
  private translator: v2.Translate
  private imagePaths: Record<ImagePath, string>
  private openai: OpenAIApi
  private conversation: ChatCompletionRequestMessage[]
  private okMessageCount: number

  constructor() {
    this.token = process.env.DISCORD_TOKEN as string
    this.id = '1110372412534571059'
    this.localChannelId = '1113260064552259634'
    this.remoteChannelId = '1110394309724876920'
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
    this.okMessageCount = 0

    const oneDay = 1000 * 60 * 60 * 24

    setInterval(() => {
      this.okMessageCount = 0
    }, oneDay)
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
    if (message.mentions.repliedUser?.id === this.id) {
      return this.onReplyToBot(message)
    }

    if (message.mentions.users.get(this.id)) {
      return this.onBotMention(message)
    }

    if (message.mentions.roles.get(this.roleId)) {
      return this.onRoleMention(message)
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
    if (message.content.includes('!debug')) {
      console.log(message)
    }

    this.handleDiscussionWithBot(message)
  }

  private onRoleMention(message: Message) {
    this.handleDiscussionWithBot(message)
  }

  private onReplyToBot(message: Message) {
    this.handleDiscussionWithBot(message)
  }

  private async handleDiscussionWithBot(message: Message) {
    /** Temporarily disable this */
    // if (message.author.username === 'o_kayy') {
    //   return this.handleMessagesFromOkay(message)
    // }

    if (
      message.channel.id !== this.localChannelId &&
      message.channel.id !== this.remoteChannelId
    ) {
      message.reply(
        `If you would like to talk to me, please head over to the <#${this.remoteChannelId}> channel`
      )
      return
    }

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

      if (blacklistedWords.includes(response.content ?? '')) {
        response.content =
          'I will not be providing a response because it is using a disallowed word. Please ask better questions.'
      }

      message.reply(response.content ?? 'Unable to generate a response')
    } catch (error) {
      console.error(error)
      message.reply('Unable to generate a response')
    }
  }

  private async handleMessagesFromOkay(message: Message) {
    if (this.okMessageCount > 0) {
      message.reply(
        'O-kay, you are only to message me once per day due to your behavior. See you tomorrow!'
      )
      return
    }

    if (
      message.channel.id !== this.localChannelId &&
      message.channel.id !== this.remoteChannelId
    ) {
      message.reply(
        'O-kay, you are only allowed to interact with me in the #lyme channel. Additionally, every message you send to me must begin with "Please" and must end with "Thank you/thanks". An example: "@Lyme please tell me how to be a better person, thank you." Lastly, you are only allowed to message me once per day until my creator sees that you have made personal improvement in your behavior'
      )
      return
    } else if (
      !message.content.toLowerCase().startsWith('please') &&
      !message.content.toLowerCase().startsWith(`<@${this.id}> please`) &&
      !message.content.toLowerCase().startsWith(`<@${this.roleId}> please`)
    ) {
      message.reply(
        'O-kay, you must begin every message with "Please". An example: "Please tell me how to be a better person, thanks.'
      )
      return
    } else if (
      !message.content.toLowerCase().endsWith('thanks') &&
      !message.content.toLowerCase().endsWith('thank you')
    ) {
      message.reply(
        'O-kay, you must end every message with "Thanks" or "Thank you. An example: "Please tell me how to be a better person, thanks.'
      )
      return
    }

    try {
      const content = message.content.trim()
      this.conversation.push({ role: 'user', content })
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

      if (blacklistedWords.includes(response.content ?? '')) {
        response.content =
          'I will not be providing a response because it is using a disallowed word. Please ask better questions.'
      }

      message.reply(response.content ?? 'Unable to generate a response')
      this.okMessageCount += 1
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
