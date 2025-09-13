const { client } = require('../index.js')
const leaver = require('../config/models/goodbyeData.js')
const logSchema = require('../config/models/logData.js')
const { EmbedBuilder, AuditLogEvent } = require('discord.js')



module.exports = {
    event: 'guildBanAdd',
    async run(ban) {

        const user = ban.user

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
            guildId: ban.guild.id
        })

        logData = await logSchema.findOne({
            guildId: ban.guild.id
        })


        if (info || info?.active === true) {
            const embed = parseObjectTemplate(info.embed, {
                memberAvatar: user.displayAvatarURL(),
                memberName: user.username,
                memberTag: user.tag,
                memberID: user.id,
                memberCreationDay: `<t:${parseInt(user.createdAt / 1000)}:f>(<t:${parseInt(user.createdAt / 1000)}:R>)`,
                serverName: ban.guild.name,
                serverIcon: ban.guild.iconURL() ? ban.guild.iconURL() : client.user.displayAvatarURL(),
                serverID: ban.guild.id,
                serverCreationDay: `<t:${parseInt(ban.guild.createdAt / 1000)}:f>(<t:${parseInt(ban.guild.createdAt / 1000)}:R>)`,
                serverMemberCount: ban.guild.memberCount,
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

        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanAdd
        }).catch((err) => { });
        const banLog = fetchedLogs?.entries?.first();


        logData.logs.forEach((logs, index) => logs.forEach(async (log) => {

            if (log === 'Member Banned' && banLog?.target?.id === user.id) {
                try {
                    await client.channels.cache.get(logData.logs[index][0]).send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Member Banned')
                                .setColor('LightGrey')
                                .setFooter({
                                    text: `${ban.guild.memberCount} members left`,
                                    iconURL: banLog.executor.displayAvatarURL()
                                })
                                .setThumbnail(user.displayAvatarURL())
                                .setDescription(`\`${user.tag}\` was banned by \`${banLog.executor.tag}\`.\n\nReason: \`${banLog.reason ?? 'No reason provided.'}\``)
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