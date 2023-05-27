import { ChatInputCommandInteraction } from 'discord.js'
import { createApi } from 'unsplash-js'
import { Command } from '../core/Command'

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY as string
})

export const image = new Command({
  name: 'image',
  description: 'Replies with an embed of an image specified by keyword',
  options: [
    {
      name: 'keyword',
      description: 'The keyword to use when searching for images'
    }
  ],
  async handler(interaction: ChatInputCommandInteraction) {
    const query = interaction.options.getString('keyword')
    const defaultImageUrl =
      'https://images.unsplash.com/photo-1584824486509-112e4181ff6b'
    let imgUrl = defaultImageUrl

    if (query) {
      const img = await unsplash.search.getPhotos({
        query
      })

      const randomIndex = Math.floor(
        Math.random() * (img.response?.results?.length ?? 0)
      )

      imgUrl =
        img.response?.results[randomIndex]?.urls.full ??
        'https://images.unsplash.com/photo-1584824486509-112e4181ff6b'
    } else {
      const img = await unsplash.photos.getRandom({ count: 1 })
      if (Array.isArray(img.response)) {
        const randomIndex = Math.floor(
          Math.random() * (img.response?.length ?? 0)
        )
        imgUrl = img.response[randomIndex].urls.full
      } else {
        console.log('@@@@@@@@@@@@else')
        console.log(img.response)
      }
    }

    if (interaction.isRepliable()) {
      interaction.reply({
        embeds: [
          {
            title: `"${query || 'random'}"`,
            description: query
              ? ''
              : "A keyword wasn't passed, so a random image has been retrieved",
            color: 0x91ff42,
            image: {
              url: imgUrl
            }
          }
        ]
      })
    }
  }
})
