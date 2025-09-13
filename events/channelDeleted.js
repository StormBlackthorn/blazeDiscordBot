const { client } = require('../index.js')
const logSchema = require('../config/models/logData.js')
const { EmbedBuilder, AuditLogEvent, ChannelType } = require('discord.js')


module.exports = {
    event: 'channelDelete',
    async run(channel) {

        logData = await logSchema.findOne({
            guildId: channel.guild.id
        })

        if (!logData) return

        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelCreate
        }).catch(() => { });
        const auditLog = fetchedLogs?.entries?.first();

        logData.logs.forEach((logs, index) => logs.forEach(async (log) => {
            if (log === 'Channel Deleted') {
                try {
                    await client.channels.cache.get(logData.logs[index][0]).send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('A channel has been deleted')
                                .setDescription(`**${ChannelType[channel.type].replace('Guild', '')} channel deleted: \`${channel.name}\`**\n**Channel ID:** \`${channel.id}\`\n\n**Channel deleted by:** ${auditLog ? `<@${auditLog.executor.id}>` : '\`Unknown due to missing permissions to view Audit Log\`'}`)
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
                } catch {

                }
            }
        }))
    }
}