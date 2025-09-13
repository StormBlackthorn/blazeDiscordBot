const { client } = require('../index.js')
const logSchema = require('../config/models/logData.js')
const { EmbedBuilder, AuditLogEvent } = require('discord.js')



module.exports = {
    event: 'messageDelete',
    async run(message) {

        logData = await logSchema.findOne({
            guildId: message.guild.id
        })

        if (!logData) return

        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MessageDelete
        }).catch((err) => { });

        const auditLog = fetchedLogs?.entries?.first();
        const { executor, target } = auditLog;

        if (!message?.author || message.embeds.length >= 1 || message.author.bot) return;

        logData.logs.forEach((logs, index) => logs.forEach(async (log) => {
            if (log === 'Message Deleted') {
                if (target?.id !== message.author.id) {
                    try {
                        let embed = new EmbedBuilder()
                            .setTitle('A message was deleted')
                            .setAuthor({
                                name: message.guild.name,
                                iconURL: message.guild.iconURL() || client.user.displayAvatarURL()
                            })
                            .setThumbnail(message.author.displayAvatarURL())
                            .setFooter({
                                iconURL: message.author.displayAvatarURL(),
                                text: message.author.id
                            })
                            .setTimestamp()

                        if (message.content) {
                            embed.setDescription(`A message was deleted in <#${message.channel.id}>.\nMessage Author: <@${message.author.id}>\n\n***Message Content:***\n${message.content.length >= 3500 ? '\`' + message.content.slice(0, 3501) + '\`....(Sliced off due to too long of a message)' : `\`${message.content}\``}`)
                        }

                        if (message.attachments.size >= 1) {
                            let attachmentValues = message.attachments.map(file => file.url)
                            attachmentValues.forEach((value, index) => {
                                attachmentValues[index] = `[Attachment[${index + 1}]](${value})`
                            })

                            embed.addFields({
                                name: 'Attachments:',
                                value: attachmentValues.join(' || ')
                            })
                        }

                        await client.channels.cache.get(logData.logs[index][0]).send({
                            embeds: [
                                embed
                            ]
                        })
                    } catch (err) {

                    }
                } else {
                    try {
                        let embed = new EmbedBuilder()
                            .setTitle('A message was deleted')
                            .setURL(message.url)
                            .setAuthor({
                                name: message.guild.name,
                                iconURL: message.guild.iconURL() || client.user.displayAvatarURL()
                            })
                            .setDescription(`A message was deleted in <#${message.channel.id}> by <@${executor.user.id}>.\nMessage Author: <@${message.author.id}>\n\n***Message Content:***\n${message.content.length >= 3500 ? '\`' + message.content.slice(0, 3501) + '\`....(Sliced off due to too long of a message)' : (message.content ? `\`${message.content}\`` : 'There are no content in this message.')}`)
                            .setThumbnail(message.author.displayAvatarURL())
                            .setFooter({
                                iconURL: message.author.displayAvatarURL(),
                                text: message.author.id
                            })
                            .setTimestamp()

                        if (message.attachments.size >= 1) {
                            let attachmentValues = message.attachments.map(file => file.url)
                            attachmentValues.forEach((value, index) => {
                                attachmentValues[index] = `[Attachment[${index + 1}]](${value})`
                            })

                            embed.addFields({
                                name: 'Attachments:',
                                value: attachmentValues.join(' || ')
                            })
                        }

                        await client.channels.cache.get(logData.logs[index][0]).send({
                            embeds: [
                                embed
                            ]
                        })
                    } catch (err) {

                    }
                }
            }
        }))

    }
}



