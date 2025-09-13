const { client } = require('../index.js')
const logSchema = require('../config/models/logData.js')
const { EmbedBuilder, AuditLogEvent } = require('discord.js')


module.exports = {
    event: 'roleDelete',
    async run(role) {

        logData = await logSchema.findOne({
            guildId: role.guild.id
        })

        if (!logData) return

        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleCreate
        }).catch((err) => { });
        const auditLog = fetchedLogs?.entries?.first();

        logData.logs.forEach((logs, index) => logs.forEach(async (log) => {
            if (log === 'Role Deleted') {
                try {
                    await client.channels.cache.get(logData.logs[index][0]).send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('A new role has been deleted!')
                                .setDescription(`**Role:** ${role.name}\n**User:** ${auditLog ? `<@${auditLog.executor.id}>` : '\`Unknown due to missing permissions to view Audit Log\`'}`)
                                .setColor('#d83142')
                                .setAuthor({
                                    name: role.guild.name,
                                    iconURL: role.guild.iconURL() || client.user.displayAvatarURL()
                                })
                                .setFooter({
                                    text: `| ${role.id}`
                                })
                                .setTimestamp()
                        ]
                    })
                } catch (err) {

                }
            }
        }))
    }
}