import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

interface Options {
  name: string
  description: string
  options?: Array<{
    name: string
    description: string
    required?: boolean
  }>
  handler: (interaction: ChatInputCommandInteraction) => void | Promise<any>
}

export class Command {
  data: SlashCommandBuilder
  execute: Options['handler']
  options?: Array<{
    name: string
    description: string
    required?: boolean
  }>

  constructor({ name, description, handler, options }: Options) {
    this.data = new SlashCommandBuilder()
      .setName(name)
      .setDescription(description)

    if (options) {
      options.forEach((option) => {
        this.data.addStringOption((stringOption) =>
          stringOption.setName(option.name).setDescription(option.description)
        )
      })
    }

    this.execute = handler
  }
}
