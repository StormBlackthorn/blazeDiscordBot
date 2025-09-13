const { client } = require('../index.js')
const logSchema = require('../config/models/logData.js')
const { EmbedBuilder, AuditLogEvent, Events } = require('discord.js')

Events.GuildBanRemove

module.exports = {
    event: 'guildBanRemove',
    async run(ban) {

        const user = ban.user

        logData = await logSchema.findOne({
            guildId: ban.guild.id
        })

        if (!logData) return

        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanRemove,
        }).catch((err) => { });

        const banLog = fetchedLogs?.entries?.first();

        logData.logs.forEach((logs, index) => logs.forEach(async (log) => {

            if (log === 'Member Unbanned' && banLog) {
                try {
                    await client.channels.cache.get(logData.logs[index][0]).send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Member Unbanned')
                                .setColor('Blurple')
                                .setFooter({
                                    text: banLog.executor.id,
                                    iconURL: banLog.executor.displayAvatarURL()
                                })
                                .setThumbnail(ban.user.displayAvatarURL())
                                .setDescription(`\`${user.tag}\` was unbanned by \`${banLog.executor.tag}\`.\n\nReason: \`${banLog.reason ?? 'No reason provided.'}\``)
                                .setTimestamp()
                                .setAuthor({
                                    name: ban.guild.name,
                                    iconURL: ban.guild.iconURL() || client.user.displayAvatarURL()
                                })
                        ]
                    })
                } catch (err) {

                }
            }
        }))


    }
}