const { client } = require('../index.js')
const leaver = require('../config/models/goodbyeData.js')
const logSchema = require('../config/models/logData.js')
const { EmbedBuilder, AuditLogEvent } = require('discord.js')



module.exports = {
    event: 'guildMemberRemove',
    async run(member) {
        const user = member.user

        try {
            await member.guild.bans.fetch(user.id)
            return;
        } catch (err) {

        }


        //functions
        function parseStringTemplate(str, values) {
            const raw = str.split(/\$\{(?!\d)[\wæøåÆØÅ]*\}/);
            const args = str.match(/[^{\}]+(?=})/g) ?? [];
            const params = args.map(
                (a) => values[a] || (values[a] === undefined ? `\${${a}}` : values[a])
            );

            return String.raw({ raw }, ...params);
        }

        function parseObjectTemplate(obj, values) {
            const parsed = {};
            Object.keys(obj).forEach((key) => {
                const val = obj[key];

                if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                    return Object.assign(parsed, {
                        [key]: parseObjectTemplate(val, values)
                    });
                }

                return parsed[key] = parseStringTemplate(val, values);
            });

            return parsed;
        }

        const info = await leaver.findOne({
            guildId: member.guild.id
        })

        logData = await logSchema.findOne({
            guildId: member.guild.id
        })


        if (info || info?.active) {
            const embed = parseObjectTemplate(info.embed, {
                memberAvatar: user.displayAvatarURL(),
                memberName: user.username,
                memberTag: user.tag,
                memberID: user.id,
                memberCreationDay: `<t:${parseInt(user.createdAt / 1000)}:f>(<t:${parseInt(user.createdAt / 1000)}:R>)`,
                serverName: member.guild.name,
                serverIcon: member.guild.iconURL() ? member.guild.iconURL() : client.user.displayAvatarURL(),
                serverID: member.guild.id,
                serverCreationDay: `<t:${parseInt(member.guild.createdAt / 1000)}:f>(<t:${parseInt(member.guild.createdAt / 1000)}:R>)`,
                serverMemberCount: member.guild.memberCount,
            })

            if (embed.timestamp === 'true') {
                embed.timestamp = new Date().toISOString()
            } else {
                delete embed.timestamp
            }

            if (embed.author.icon_url.toString() === 'null') {
                embed.author.icon_url = client.user.displayAvatarURL()
            }

            try {
                await client.channels.cache.get(info.channelId).send({
                    embeds: [
                        embed
                    ]
                })
            } catch (err) {

            }
        }

        if (!logData) return

        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberKick,
        }).catch((err) => { });
        const kickLog = fetchedLogs?.entries?.first();

        logData.logs.forEach((logs, index) => logs.forEach(async (log) => {

            if (log === 'Member Kicked' && kickLog?.target?.id === member.id) {
                try {
                    await client.channels.cache.get(logData.logs[index][0]).send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Member Kicked')
                                .setColor('#42daf5')
                                .setFooter({
                                    text: `${member.guild.memberCount} members left`,
                                    iconURL: kickLog.executor.displayAvatarURL()
                                })
                                .setThumbnail(member.user.displayAvatarURL())
                                .setDescription(`\`${member.user.tag}\` was kicked by \`${kickLog.executor.tag}\`.\n\nReason: \`${kickLog.reason ?? 'No reason provided.'}\``)
                                .setTimestamp()
                                .setAuthor({
                                    name: member.guild.name,
                                    iconURL: member.guild.iconURL() || client.user.displayAvatarURL()
                                })
                        ]
                    })
                } catch (err) {

                }
            } else if (log === 'Member Left' && (kickLog?.target?.id !== member.id || !kickLog)) {
                try {
                    await client.channels.cache.get(logData.logs[index][0]).send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Member Left')
                                .setColor('Blue')
                                .setAuthor({
                                    name: member.guild.name,
                                    iconURL: member.guild.iconURL() || client.user.displayAvatarURL()
                                })
                                .setFooter({
                                    text: `${member.guild.memberCount} members left`,
                                })
                                .setThumbnail(member.user.displayAvatarURL())
                                .setDescription(`\`${member.user.tag}\` left.`)
                                .setTimestamp()
                        ]
                    })
                } catch (err) {

                }
            }
        }))



    }
}