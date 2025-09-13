/*
* In the good memory of AI chat by ChatGPT
* I am officially broke and have no money to pay :(
* I worked so hard for this too :((((

const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    EmbedBuilder,
} = require('discord.js')
const AIChat = require('../config/models/AIChatData.js')

module.exports = {
    name: "ai-chat",
    description: "start a chat with the AI!",
    category: "fun",
    cooldown: 5000,
    userPerms: [],
    botPerms: [],
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "start",
        description: "start a new AI chat session in your channel!",
        type: ApplicationCommandOptionType.Subcommand,
    }, {
        name: 'end',
        description: 'Stop an AI chat session in your channel!',
        type: ApplicationCommandOptionType.Subcommand
    }, {
        name: 'info',
        description: 'Confused on how to use the AI chat function? Read this!',
        type: ApplicationCommandOptionType.Subcommand
    }],

    async run({
        client,
        interaction
    }) {

        const { options } = interaction
        const subCmd = options.getSubcommand()
        let chat = await AIChat.findOne({
            channelId: interaction.channel.id
        })

        if (subCmd === 'start') {
            if (chat) return interaction.reply({
                content: 'There is already a AI chat session in this channel!',
                ephemeral: true
            })

            const timeoutId = setTimeout(async () => {
                try {
                    chat = await AIChat.findOne({
                        channelId: interaction.channel.id
                    })
                    client.channels.cache.get(chat.channelId).send('The AI Chat session has been ended due to inactivity for ten minutes(excluding bot messages).')
                    await AIChat.findOneAndDelete({
                        channelId: interaction.channel.id
                    })
                } catch (err) {

                }
            }, 600000)

            await new AIChat({
                channelId: interaction.channel.id,
                timeoutId: timeoutId
            }).save()

            interaction.reply('A new AI chat session has been started! Please note: If the channel is inactive for 10 minutes, the AI chat session will automatically end.')
        }

        if (subCmd === 'end') {
            if (!chat) return interaction.reply({
                content: 'There is currently no AI chat session in this channel!',
                ephemeral: true
            })
            chat = await AIChat.findOne({
                channelId: interaction.channel.id
            })
            clearTimeout(chat.timeoutId)
            await AIChat.findOneAndDelete({
                channelId: interaction.channel.id
            })
            return interaction.reply('The AI chat session in this channel has been ended!')
        }

        if (subCmd === 'info') {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('AI Chat Info!')
                        .setColor('Gold')
                        .setAuthor({
                            name: chat ? 'AI chat in session' : 'No AI chat in session',
                            iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                        })
                        .addFields({
                            name: '***Starting Session:***',
                            value: '>>> Use \`ai-chat start\` to start an AI chat session in the channel that you used the command in!'
                        }, {
                            name: '***Ending Session***',
                            value: '>>> Use \`ai-chat end\` to stop the AI chat session in the chanel that you used the command in!'
                        }, {
                            name: '***Additional Info:***',
                            value: ' >>> -- The AI chat session will automatically end after ten minutes of inactivity(excluding).\n -- There is a limit to how much an AI can respond in a month, globally. So if it reaches the limit, it will not be able to do AI chat for the rest of the month(OTHER COMMANDS WORK!!!). Sorry for any inconvenience this might cause.\n-- This is a rather unstable feature, so please understand if the AI does not give a satisfying answer. We are sorry for that.\n-- ***powered by openAI***'
                        })
                        .setThumbnail('https://i.pinimg.com/564x/9a/11/33/9a1133d4af3b637e1c6c8ff251785f27.jpg')
                        .setFooter({
                            text: `requested by: ${interaction.user.tag}`,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
            })
        }

    }
}
*/