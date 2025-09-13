const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    EmbedBuilder,
    ChannelType
} = require('discord.js')


module.exports = {
    name: "slowmode",
    description: "Sets a slowmode for a channel!",
    category: "moderation",
    cooldown: 5000,
    userPerms: ['ManageChannels'],
    botPerms: ['ManageChannels'],
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "channel",
        description: "The channel that you wish to set slowmode for",
        required: false,
        type: ApplicationCommandOptionType.Channel,
        channel_types: [ChannelType.GuildText]
    }, {
        name: 'time',
        description: 'Duration in which you want to set the slowmode for.',
        required: false,
        type: ApplicationCommandOptionType.String,
        choices: [{
            name: 'remove',
            value: 'null'
        }, {
            name: '5 seconds',
            value: '5s'
        }, {
            name: '15 seconds',
            value: '15s'
        }, {
            name: '30 seconds',
            value: '30s'
        }, {
            name: '1 minute',
            value: '1m'
        }, {
            name: '5 mins',
            value: '5h'
        }, {
            name: '10 minutes',
            value: '10m'
        }, {
            name: '30 minutes',
            value: '30m'
        }, {
            name: '1 hour',
            value: '1h'
        }, {
            name: '3 hours',
            value: '3h'
        }, {
            name: '6 hours',
            value: '6h'
        }]
    }, {
        name: 'reason',
        description: 'reason for adding a slowmode to this channel.',
        required: 'false',
        type: ApplicationCommandOptionType.String
    }],

    async run({
        client,
        interaction
    }) {

        const { options } = interaction;
        const channel = options.getChannel('channel') || interaction.channel
        let time = options.getString('time') ? options.getString('time') : 'null'
        const reason = options.getString('reason') || 'None.'

        if (time === "null") {
            await channel.setRateLimitPerUser(null, reason)
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Removed slowmode for: \`${channel.name}\``)
                        .setAuthor({
                            name: " || " + interaction.guild.name,
                            iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                        })
                        .setDescription(`<#${channel.id}>\nReason: \`${reason}\``)
                        .setColor('#fcba03')
                        .setThumbnail(`https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/steampunk-clock-andrea-mazzocchetti.jpg`)
                        .setFooter({
                            text: `${channel.id}`,
                            iconURL: interaction.member.displayAvatarURL()
                        })
                        .setTimestamp()
                ]
            })
        } else {
            if (/\d+/g.test(time) === false) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error!')
                        .setColor('Red')
                        .setDescription('Please enter how much time you want to set slowmode for.  \n\n***Format:***\n>>> To remove a slowmode, simplify not fill out the <time> option. \n\nFor slowmode <time> option: ?<remove: input \'remove\' to remove the channel\'s slowmode> <amount of time: unit in (s, sec, second, seconds) | (m, min, minute, minutes) | (h, hr, hour, hours) | (d, day, days)>. \n\nMinimum 1 second and maximum 6 hours for slowmode duration.')
                ],
                ephemeral: true
            })

            const timeUnit = time.replace(/\d/g, "")

            if (timeUnit.length === 0) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error!')
                        .setColor('Red')
                        .setDescription('You did not enter the unit of time in which you want to set the slowmode for. \n\n***Format:***\n>>> To remove a slowmode, simplify not fill out the <time> option. \n\nFor slowmode <time> option: ?<remove: input \'remove\' to remove the channel\'s slowmode> <amount of time: unit in (s, sec, second, seconds) | (m, min, minute, minutes) | (h, hr, hour, hours) | (d, day, days)>. \n\nMinimum 1 second and maximum 6 hours for slowmode duration.')
                ],
                ephemeral: true
            })

            const timeUnitRegex = [
                /(s|sec|second|seconds)/,
                /(m|min|minute|minutes)/,
                /(h|hr|hour|hours)/,
            ]
            const timeMath = [
                time.replace(/[^\d]/g, ""),
                time.replace(/[^\d]/g, "") * 60,
                time.replace(/[^\d]/g, "") * 60 * 60,
            ]


            for (let i = 0; i < 4; i++) {

                if (timeUnit.match(timeUnitRegex[i]) !== null) {
                    time = timeMath[i]
                    break;
                }
            }

            if (time < 1) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error!')
                        .setColor('Red')
                        .setDescription('You can not input a time that is less then \`one second\` for the amount of time that you want to set a slowmode for.')

                ],
                ephemeral: true
            })

            if (time > 21600) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error!')
                        .setColor('Red')
                        .setDescription('You can not input a time that is more then \`six hours\` for the amount of time that you want to set a slowmode for.')

                ],
                ephemeral: true
            })

            if (typeof time !== 'number') return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error!')
                        .setColor('Red')
                        .setDescription('Your time unit is not in the correct format, or you are entering a non-existing time unit. \n\n***Format:***\n>>> To remove a slowmode, simplify not fill out the <time> option. \n\nFor slowmode <time> option: ?<remove: input \'remove\' to remove the channel\'s slowmode> <amount of time: unit in (s, sec, second, seconds) | (m, min, minute, minutes) | (h, hr, hour, hours) | (d, day, days)>. \n\nMinimum 1 second and maximum 6 hours for slowmode duration.')
                ],
                ephemeral: true
            })

            await channel.setRateLimitPerUser(time, reason)
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Slowmode set for: \`${channel.name}\``)
                        .setAuthor({
                            name: " || " + interaction.guild.name,
                            iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                        })
                        .setDescription(`<#${channel.id}>\nReason: \`${reason}\``)
                        .setColor('#fcba03')
                        .setThumbnail(`https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/steampunk-clock-andrea-mazzocchetti.jpg`)
                        .setFooter({
                            text: `${channel.id}`,
                            iconURL: interaction.member.displayAvatarURL()
                        })
                        .setTimestamp()
                ]
            })
        }
    }
}
