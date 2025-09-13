const { client } = require('../index.js')
const logSchema = require('../config/models/logData.js')
const { EmbedBuilder, AuditLogEvent, OverwriteType } = require('discord.js')


module.exports = {
    event: 'channelUpdate',
    async run(oldChannel, newChannel) {

        logData = await logSchema.findOne({
            guildId: newChannel.guild.id
        })

        if (!logData) return

        const fetchedLogs = await newChannel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelCreate
        }).catch((err) => { });
        const auditLog = fetchedLogs?.entries?.first();

        logData.logs.forEach((logs, index) => logs.forEach(async (log) => {
            if (log === 'Channel Updated') {
                try {
                    if (oldChannel.topic !== newChannel.topic) {
                        await client.channels.cache.get(logData.logs[index][0]).send({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('A channel\'s description changed')
                                    .setDescription(`Channel: <#${newChannel.id}>\nUser: ${auditLog ? `<@${auditLog.executor.id}>` : '\`Unknown due to missing permissions to view Audit Log\`'}\n\n**Old Description:**\n\`${oldChannel.topic ?? 'No description'}\`\n\n**New Description:**\n\`${newChannel.topic ?? 'No description'}\``)
                                    .setColor('#f3fd7b')
                                    .setAuthor({
                                        name: newChannel.guild.name,
                                        iconURL: newChannel.guild.iconURL() || client.user.displayAvatarURL()
                                    })
                                    .setTimestamp()
                            ]
                        })
                    } else if (oldChannel.name !== newChannel.name) {
                        await client.channels.cache.get(logData.logs[index][0]).send({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('A channel\'s name changed')
                                    .setDescription(`Channel: <#${newChannel.id}>\nUser: ${auditLog ? `<@${auditLog.executor.id}>` : '\`Unknown due to missing permissions to view Audit Log\`'}\n\n**Old Name:**\n\`${oldChannel.name}\`\n\n**New Name:**\n\`${newChannel.name}\``)
                                    .setAuthor({
                                        name: newChannel.guild.name,
                                        iconURL: newChannel.guild.iconURL() || client.user.displayAvatarURL()
                                    })
                                    .setTimestamp()
                                    .setColor('#7bfde6')
                            ]
                        })
                    } else if (oldChannel.nsfw && !newChannel.nsfw || !oldChannel.nsfw && newChannel.nsfw) {

                    } else {
                        const permDiff = oldChannel.permissionOverwrites.cache.filter(x => {
                            if (newChannel.permissionOverwrites.cache.find(y => y.allow.bitfield == x.allow.bitfield) && newChannel.permissionOverwrites.cache.find(y => y.deny.bitfield == x.deny.bitfield)) {
                                return false;
                            }
                            return true;
                        }).concat(newChannel.permissionOverwrites.cache.filter(x => {
                            if (oldChannel.permissionOverwrites.cache.find(y => y.allow.bitfield == x.allow.bitfield) && oldChannel.permissionOverwrites.cache.find(y => y.deny.bitfield == x.deny.bitfield)) {
                                return false;
                            }
                            return true;
                        }));

                        if (permDiff.size) {
                            const embed = new EmbedBuilder()
                                .setTitle('A channel\'s permission changed')
                                .setDescription(`Channel: <#${newChannel.id}>\nUser: ${auditLog ? `<@${auditLog.executor.id}>` : '\`Unknown due to missing permissions to view Audit Log\`'}`)
                                .setAuthor({
                                    name: newChannel.guild.name,
                                    iconURL: newChannel.guild.iconURL() || client.user.displayAvatarURL()
                                })
                                .setTimestamp()
                                .setColor('#9c7bfd')

                            for (const permID of permDiff.keys()) {
                                // load both overwrites into variables
                                const oldPerm = oldChannel.permissionOverwrites.cache.get(permID) || {};
                                const newPerm = newChannel.permissionOverwrites.cache.get(permID) || {};
                                const oldBitfields = {
                                    allowed: oldPerm.allow ?? 0,
                                    denied: oldPerm.deny ?? 0,
                                };
                                const newBitfields = {
                                    allowed: newPerm.allow ?? 0,
                                    denied: newPerm.deny ?? 0,
                                };
                                let role;
                                let member;

                                if (OverwriteType[oldPerm.type] == 'Role' || OverwriteType[newPerm.type] == 'Role') {
                                    role = newChannel.guild.roles.cache.get(newPerm.id || oldPerm.id);
                                }
                                if (OverwriteType[oldPerm.type] == 'Member' || OverwriteType[newPerm.type] == 'Member') {
                                    member = await newChannel.guild.members.fetch(newPerm.id || oldPerm.id);
                                }
                                let value = '';

                                if (oldBitfields.allowed && newBitfields.allowed && oldBitfields.denied && newBitfields.denied) {
                                    let allowedPerms = newBitfields.allowed.toArray().filter(x => !oldBitfields.allowed.toArray().includes(x));
                                    let deniedPerms = newBitfields.denied.toArray().filter(x => !oldBitfields.denied.toArray().includes(x));
                                    if (oldBitfields.allowed !== newBitfields.allowed) {
                                        value += `**Allowed Permissions Change:** \n\`${allowedPerms.length !== 0 ? allowedPerms.join(' | ').replace('ManageRoles', 'ManagePermissions') : 'There are no allowed permissions change'}\`\n`;
                                    }
                                    if (oldBitfields.denied !== newBitfields.denied) {
                                        value += `**Denied Permissions Change:** \n\`${deniedPerms.length !== 0 ? deniedPerms.join(' | ').replace('ManageRoles', 'ManagePermissions') : 'There are no denied permissions change'}\``;
                                    }
                                } else {
                                    value = 'Overwrite got deleted';
                                }

                                // add field to embed
                                embed.addFields({
                                    'name': '\ub200',
                                    'value': `${role ? `<@${role.id}> (ID: ${role.id}):` : `<@${member.id}>  (ID: ${member.id}):`}\n\n${value}`,
                                });
                            }
                            await client.channels.cache.get(logData.logs[index][0]).send({
                                embeds: [
                                    embed
                                ]
                            })
                        }
                    }
                } catch (err) {

                }
            }
        }))
    }
}