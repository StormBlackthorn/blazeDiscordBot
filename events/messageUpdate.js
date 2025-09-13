const { client } = require('../index.js')
const logSchema = require('../config/models/logData.js')
const { EmbedBuilder } = require('discord.js')


module.exports = {
    event: 'messageUpdate',
    async run(oldMessage, newMessage) {

        logData = await logSchema.findOne({
            guildId: newMessage.guild.id
        })

        if (!logData) return
        if (!oldMessage?.author || oldMessage?.embed?.length >= 1 || newMessage?.author?.bot || oldMessage?.content === newMessage?.content) return;

        logData.logs.forEach((logs, index) => logs.forEach(async (log) => {
            if (log === 'Message Edited') {
                try {
                    let embed = new EmbedBuilder()
                        .setTitle('Message Edited')
                        .setURL(newMessage.url)
                        .setColor('#34b4eb')
                        .setAuthor({
                            name: newMessage.guild.name,
                            iconURL: newMessage.guild.iconURL() || client.user.displayAvatarURL()
                        })
                        .setTimestamp()

                    if (newMessage.content) {
                        embed.setDescription(`A message was edited in <#${newMessage.channel.id}>.\nMessage Author: <@${newMessage.author.id}>\n\n***Old Message:***\n${oldMessage.content.length >= 1700 ? '\`' + oldMessage.content.slice(0, 1701) + '\`....(Sliced off due to too long of a message)' : (oldMessage.content ? `\`${oldMessage.content}\`` : `\`There were no content in this message.\``)}\n\n***New Message:***\n${newMessage.content.length >= 1700 ? '\`' + newMessage.content.slice(0, 1701) + '\`....(Sliced off due to too long of a message)' : `\`${newMessage.content}\``}`)
                    }

                    await client.channels.cache.get(logData.logs[index][0]).send({
                        embeds: [
                            embed
                        ]
                    })

                } catch (err) {

                }
            }
        }))




    }
}

