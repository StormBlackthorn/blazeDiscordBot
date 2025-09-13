const { client } = require('../index.js')
const logSchema = require('../config/models/logData.js')
const { EmbedBuilder, AuditLogEvent, ChannelType } = require('discord.js')


module.exports = {
    event: 'channelCreate',
    async run(channel) {

        logData = await logSchema.findOne({
            guildId: channel.guild.id
        })

        if (!logData) return

        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelCreate
        }).catch((err) => { });
        const auditLog = fetchedLogs?.entries?.first();

        logData.logs.forEach((logs, index) => logs.forEach(async (log) => {
            if (log === 'Channel Created') {
                try {
                    await client.channels.cache.get(logData.logs[index][0]).send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('A new channel has been created!')
                                .setDescription(`**${ChannelType[channel.type].replace('Guild', '')} channel created: ${channel.toString()}**\n**Under category:** \`${channel.parent.name ?? 'The channel is not under any category.'}\`\n\n**Channel created by:** ${auditLog ? `<@${auditLog.executor.id}>` : '\`Unknown due to missing permissions to view Audit Log\`'}`)
                                .setColor('#ffa6cb')
                                .setAuthor({
                                    name: channel.guild.name,
                                    iconURL: channel.guild.iconURL() || client.user.displayAvatarURL()
                                })
                                .setFooter({
                                    text: `| ${channel.id}`
                                })
                                .setTimestamp()
                        ]
                    })
                } catch(err) {

                }
            }
        }))
    }
}