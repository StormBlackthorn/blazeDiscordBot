const { client } = require('../index.js')
const welcomer = require('../config/models/welcomerData.js')
const logSchema = require('../config/models/logData.js')


module.exports = {
    event: 'guildMemberAdd',
    async run(member) {

        logData = await logSchema.findOne({
            guildId: member.guild.id
        })

        const user = member.user

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

        const info = await welcomer.findOne({
            guildId: member.guild.id
        })

        if (info || info?.active === true) {

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

            if (embed.color) {
                embed.color = resolveColor(embed.color)
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
                return;
            }
        }

        if (!logData) return

        logData.logs.forEach((logs, index) => logs.forEach(async (log) => {

            if (log === 'Member Joined') {
                try {
                    await client.channels.cache.get(logData.logs[index][0]).send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Member Joined')
                                .setColor('#74edad')
                                .setFooter({
                                    text: `There are now ${member.guild.memberCount} members!`,
                                    iconURL: member.displayAvatarURL()
                                })
                                .setThumbnail(member.displayAvatarURL())
                                .setDescription(`<@${user.id}> Just joined!\n\nID: \`${user.id}\`\nBot: ${user.bot ? `true(verified: ${user.flags.toArray().includes('VerifiedBot') ? 'true' : 'false'})` : 'false'}\`\nJoined At: <t:${parseInt(member.joinedAt / 1000)}:f>(<t:${parseInt(member.joinedAt / 1000)}:R>)\n Account Created At: <t:${parseInt(user.createdAt / 1000)}:f>(<t:${parseInt(user.createdAt / 1000)}:R>)`)
                                .setTimestamp()
                                .setAuthor({
                                    name: member.guild.name,
                                    iconURL: member.guild.iconURL() || client.user.displayAvatarURL()
                                })
                        ]
                    })
                } catch (err) {

                }
            }
        }))
    }

}
