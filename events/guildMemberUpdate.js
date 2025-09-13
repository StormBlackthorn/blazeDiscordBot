const { client } = require('../index.js')
const logSchema = require('../config/models/logData.js')
const { EmbedBuilder, AuditLogEvent } = require('discord.js')



module.exports = {
    event: 'guildMemberUpdate',
    async run(oldMember, newMember) {

        logData = await logSchema.findOne({
            guildId: newMember.guild.id
        })

        if (!logData) return

        const fetchedLogs = await oldMember.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberUpdate
        }).catch((err) => { });

        const auditLog = fetchedLogs?.entries?.first();

        logData.logs.forEach((logs, index) => logs.forEach(async (log) => {

            if (log === 'Timeout Given' && !oldMember.isCommunicationDisabled() && newMember.isCommunicationDisabled()) {
                try {
                    let embed;
                    if (auditLog) {
                        embed = new EmbedBuilder()
                            .setTitle(`${oldMember.user.tag} has been timeout`)
                            .setColor('#d63354')
                            .setFooter({
                                text: auditLog.executor.id,
                                iconURL: auditLog.executor.displayAvatarURL()
                            })
                            .setThumbnail(oldMember.user.displayAvatarURL())
                            .setDescription(`<@${oldMember.user.id}> was timeout by <@${auditLog.executor.id}>.\n\nReason: \`${auditLog.reason ?? 'No reason provided.'}\``)
                            .setTimestamp()
                            .setAuthor({
                                name: oldMember.guild.name,
                                iconURL: oldMember.guild.iconURL() || client.user.displayAvatarURL()
                            })
                    } else {
                        embed = new EmbedBuilder()
                            .setTitle(`${oldMember.user.tag} has been timeout`)
                            .setColor('#d63354')
                            .setThumbnail(oldMember.user.displayAvatarURL())
                            .setDescription(`<@${oldMember.user.id}> was timeout, but the executor and reason is Unknown due to missing permissions to view audit logs. If you wish to have a better and more complete experience with out logging system, please give me the \`view audit log\` permission.`)
                            .setTimestamp()
                            .setAuthor({
                                name: oldMember.guild.name,
                                iconURL: oldMember.guild.iconURL() || client.user.displayAvatarURL()
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
            else if (log === 'Timeout Removed' && oldMember.isCommunicationDisabled() && !newMember.isCommunicationDisabled()) {
                try {
                    await client.channels.cache.get(logData.logs[index][0]).send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`\`${oldMember.user.tag}\`\'s timeout has ended`)
                                .setColor('Yellow')
                                .setThumbnail(oldMember.user.displayAvatarURL())
                                .setDescription(`<@${oldMember.user.id}>\'s timeout has been ended/removed.`)
                                .setTimestamp()
                                .setAuthor({
                                    name: oldMember.guild.name,
                                    iconURL: oldMember.guild.iconURL() || client.user.displayAvatarURL()
                                })
                                .setTimestamp()
                        ]
                    })
                } catch (err) {

                }
            } else if (log === 'Member Nickname Changed' && oldMember.nickname !== newMember.nickname) {
                try {
                    await client.channels.cache.get(logData.logs[index][0]).send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`\`${oldMember.user.tag}\` changed their nickname`)
                                .setDescription(`User: <@${oldMember.user.id}>`)
                                .setColor('Blue')
                                .setThumbnail(oldMember.user.displayAvatarURL())
                                .addFields({
                                    name: '***Old nickname:***',
                                    value: `\`${oldMember.nickname ?? oldMember.user.username}\``
                                }, {
                                    name: '***New nickname:***',
                                    value: `\`${newMember.nickname ?? newMember.user.username}\``
                                })
                                .setAuthor({
                                    name: oldMember.guild.name,
                                    iconURL: oldMember.guild.iconURL() || client.user.displayAvatarURL()
                                })
                                .setTimestamp()
                        ]
                    })
                } catch (err) {

                }
            } else if (log === 'Username Changed' && oldMember.user.username !== newMember.user.username) {
                try {
                    await client.channels.cache.get(logData.logs[index][0]).send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`\`${oldMember.user.tag}\` changed their username`)
                                .setColor('LuminousVividPink')
                                .setThumbnail(oldMember.user.displayAvatarURL())
                                .addFields({
                                    name: '***Old username:***',
                                    value: `\`${oldMember.username}\``
                                }, {
                                    name: '***New username:***',
                                    value: `\`${newMember.username}\``
                                })
                                .setAuthor({
                                    name: oldMember.guild.name,
                                    iconURL: oldMember.guild.iconURL() || client.user.displayAvatarURL()
                                })
                                .setTimestamp()
                        ]
                    })
                } catch (err) {

                }
            } else if (log === 'Member Boosted' && !oldMember.premiumSince && newMember.premiumSince) {
                try {
                    await client.channels.cache.get(logData.logs[index][0]).send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`\`${oldMember.user.tag}\` just boosted!`)
                                .setDescription(`<@${oldMember.user.id}> just boosted the server!!!`)
                                .setColor('#fca7d3')
                                .setThumbnail(oldMember.user.displayAvatarURL())
                                .setAuthor({
                                    name: oldMember.guild.name,
                                    iconURL: oldMember.guild.iconURL() || client.user.displayAvatarURL()
                                })
                        ]
                    })
                } catch (err) {

                }
            } else if (log === 'Member Boost Ended' && oldMember.premiumSince && !newMember.premiumSince) {
                try {
                    await client.channels.cache.get(logData.logs[index][0]).send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`\`${oldMember.user.tag}\`\'s boost ended`)
                                .setDescription(`<@${oldMember.user.id}>\'s boost ended. `)
                                .setColor('#ff0095')
                                .setThumbnail(oldMember.user.displayAvatarURL())
                                .setAuthor({
                                    name: oldMember.guild.name,
                                    iconURL: oldMember.guild.iconURL() || client.user.displayAvatarURL()
                                })
                        ]
                    })
                } catch (err) {

                }
            } else if (log === 'Role Given') {
                const rolesAdded = newMember.roles.cache.filter(x => !oldMember.roles.cache.get(x.id));
                if (rolesAdded.size !== 0) {
                    const roleAddedString = [];
                    for (const role of [...rolesAdded.values()]) {
                        roleAddedString.push(role.toString());
                    }
                    try {
                        await client.channels.cache.get(logData.logs[index][0]).send({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(`\`${oldMember.user.tag}\` got new roles`)
                                    .setDescription(`<@${oldMember.user.id}> just got some new roles!`)
                                    .addFields({
                                        name: `***Roles added[${roleAddedString.length}]:***`,
                                        value: roleAddedString.join(' || ')
                                    })
                                    .setThumbnail(oldMember.user.displayAvatarURL())
                                    .setAuthor({
                                        name: oldMember.guild.name,
                                        iconURL: oldMember.guild.iconURL() || client.user.displayAvatarURL()
                                    })
                                    .setTimestamp()
                            ]
                        })
                    } catch (err) {

                    }
                }
            } else if (log === 'Role Remove') {
                const rolesRemoved = oldMember.roles.cache.filter(x => !newMember.roles.cache.get(x.id));
                if (rolesRemoved.size !== 0) {
                    const roleRemovedString = [];
                    for (const role of [...rolesRemoved.values()]) {
                        roleRemovedString.push(role.toString());
                    }
                    try {
                        await client.channels.cache.get(logData.logs[index][0]).send({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(`\`${oldMember.user.tag}\` removed roles`)
                                    .setDescription(`<@${oldMember.user.id}> now has less roles!`)
                                    .addFields({
                                        name: `***Roles removed[${roleRemovedString.length}]:***`,
                                        value: roleRemovedString.join(' || ')
                                    })
                                    .setThumbnail(oldMember.user.displayAvatarURL())
                                    .setAuthor({
                                        name: oldMember.guild.name,
                                        iconURL: oldMember.guild.iconURL() || client.user.displayAvatarURL()
                                    })
                                    .setTimestamp()
                            ]
                        })
                    } catch (err) {

                    }
                }
            }


        }))

    }
}