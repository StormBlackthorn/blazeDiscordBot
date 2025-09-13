const { client } = require('../index.js')
const logSchema = require('../config/models/logData.js')
const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js')


module.exports = {
    event: 'roleUpdate',
    async run(oldRole, newRole) {

        logData = await logSchema.findOne({
            guildId: newRole.guild.id
        })

        if (!logData) return

        const fetchedLogs = await newRole.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleUpdate
        }).catch((err) => { });
        const auditLog = fetchedLogs?.entries?.first();

        logData.logs.forEach((logs, index) => logs.forEach(async (log) => {
            if (log === 'Role Updated') {
                try {
                    if (oldRole.name !== newRole.name) {
                        await client.channels.cache.get(logData.logs[index][0]).send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('#f89249')
                                    .setTitle('A role\'s name changed')
                                    .setDescription(`**Role:** ${newRole.toString()}\n**Old name:** \`${oldRole.name}\`\n**New name:** \`${newRole.name}\`\n\n**User:** ${auditLog ? `<@${auditLog.executor.id}>` : `\`Unknown due to missing permissions to view Audit Log\``}`)
                                    .setTimestamp()
                                    .setAuthor({
                                        name: newRole.guild.name,
                                        iconURL: newRole.guild.iconURL() || client.user.displayAvatarURL()
                                    })
                            ]
                        })
                    } else if (oldRole.color !== newRole.color) {
                        await client.channels.cache.get(logData.logs[index][0]).send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(newRole.color)
                                    .setDescription(`**Role:** ${newRole.toString()}\n**Old color:** \`#${(oldRole.color).toString(16)}(hex)\`\n**New color:** \`#${(newRole.color).toString(16)}(hex)\`\n\n**User:** ${auditLog ? `<@${auditLog.executor.id}>` : `\`Unknown due to missing permissions to view Audit Log\``}`)
                                    .setTitle('A role\'s color changed!')
                                    .setTimestamp()
                                    .setAuthor({
                                        name: newRole.guild.name,
                                        iconURL: newRole.guild.iconURL() || client.user.displayAvatarURL()
                                    })
                            ]
                        })
                    } else if (oldRole.permissions.bitfield != newRole.permissions.bitfield) {

                        const deniedPerms = new PermissionsBitField(oldRole.permissions.bitfield).toArray().filter((element) => !new PermissionsBitField(newRole.permissions.bitfield).toArray().includes(element))
                        const allowedPerms = new PermissionsBitField(newRole.permissions.bitfield).toArray().filter((element) => !new PermissionsBitField(oldRole.permissions.bitfield).toArray().includes(element))

                        await client.channels.cache.get(logData.logs[index][0]).send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('#7b37e4')
                                    .setTitle('A role\'s permission changed')
                                    .setDescription(`**Role:** ${newRole.toString()}\n**User:** ${auditLog ? `<@${auditLog.executor.id}>` : `\`Unknown due to missing permissions to view Audit Log\``}\n\n`)
                                    .addFields({
                                        name: '**Allowed permission change:**',
                                        value: allowedPerms.length <= 0 ? `No allowed permission changed.` : `\`${allowedPerms.join(' | ')}\``
                                    }, {
                                        name: '**Denied permission change:**',
                                        value: deniedPerms.length <= 0 ? `No denied permission changed.` : `\`${deniedPerms.join(' | ')}\``
                                    })
                                    .setTimestamp()
                                    .setAuthor({
                                        name: newRole.guild.name,
                                        iconURL: newRole.guild.iconURL() || client.user.displayAvatarURL()
                                    })
                            ]
                        })
                    }
                } catch (err) {

                }
            }
        }))
    }
}

