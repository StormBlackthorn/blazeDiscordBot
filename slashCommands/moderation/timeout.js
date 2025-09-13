const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    EmbedBuilder,
} = require('discord.js')


module.exports = {
    name: "timeout",
    description: "Timeout/mutes a member from talking in a text channel!",
    category: "moderation",
    cooldown: 5000,
    userPerms: ['ModerateMembers'],
    botPerms: ['ModerateMembers'],
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "member",
        description: "The member that you wish to mute.",
        required: true,
        type: ApplicationCommandOptionType.User,
    }, {
        name: 'time',
        description: 'Duration in which you want to user to be muted. use \`timeout info\` for info on the option.',
        required: false,
        type: ApplicationCommandOptionType.String,
        autocomplete: true,
    }, {
        name: 'reason',
        description: 'The reason for muting this member.',
        required: false,
        type: ApplicationCommandOptionType.String

    }],

    async run({
        client,
        interaction
    }) {

        const { options } = interaction;
        const member = options.getMember('member')
        let time = options.getString('time') ? options.getString('time') : (member.isCommunicationDisabled() === true ? 'null' : '21d')
        time = time === 'remove' ? 'null' : time
        const reason = options.getString('reason') || 'None.'

        if (time === "null") {
            try {
                member.timeout(null, reason)
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Timeout removed for: \`${member.user.tag}\``)
                            .setAuthor({
                                name: " || " + interaction.guild.name,
                                iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                            })
                            .setDescription(`<@${member.user.id}>\nReason: \`${reason}\``)
                            .setColor('#fcba03')
                            .setThumbnail(`https://thumbs.dreamstime.com/b/no-talking-sign-no-speaking-symbol-isolated-white-background-84644262.jpg`)
                            .setFooter({
                                text: `${member.user.tag} | ${member.user.id}`,
                                iconURL: member.displayAvatarURL()
                            })
                            .setTimestamp()
                    ]
                })
            } catch {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Error!')
                            .setColor('Red')
                            .setDescription(`I could not un-mute \`${member.user.tag}\`. This may be because they are higher ups.`)
                    ],
                    ephemeral: true
                })
            }
        } else {
            if (/\d+/g.test(time) === false) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error!')
                        .setColor('Red')
                        .setDescription('Please enter how much time you would want the user to be muted for.  \n\n***Format:***\n>>> To remove a timeout, simplify not fill out the <time> option. \n\nFor timeout <time> option: ?<remove: input \'remove\' to remove the user\'s timeout> <amount of time: unit in (s, sec, second, seconds) | (m, min, minute, minutes) | (h, hr, hour, hours) | (d, day, days)>. \n\nMinimum 1 second and maximum 24 days for mute duration.')
                ],
                ephemeral: true
            })

            const timeUnit = time.replace(/\d/g, "")

            if (timeUnit.length === 0) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error!')
                        .setColor('Red')
                        .setDescription('You did not enter the unit of time in which you want to mute the user for. \n\n***Format:***\n>>> To remove a timeout, simplify not fill out the <time> option. \n\nFor timeout <time> option: ?<remove: input \'remove\' to remove the user\'s timeout> <amount of time: unit in (s, sec, second, seconds) | (m, min, minute, minutes) | (h, hr, hour, hours) | (d, day, days)>. \n\nMinimum 1 second and maximum 24 days for mute duration.')
                ],
                ephemeral: true
            })

            const timeUnitRegex = [
                /(s|sec|second|seconds)/,
                /(m|min|minute|minutes)/,
                /(h|hr|hour|hours)/,
                /(d|day|days)/
            ]
            const timeMath = [
                time.replace(/[^\d]/g, "") * 1000,
                time.replace(/[^\d]/g, "") * 60 * 1000,
                time.replace(/[^\d]/g, "") * 60 * 60 * 1000,
                time.replace(/[^\d]/g, "") * 24 * 60 * 60 * 1000
            ]


            for (let i = 0; i < 4; i++) {

                if (timeUnit.match(timeUnitRegex[i]) !== null) {
                    time = timeMath[i]
                    break;
                }
            }

            if (time < 1000) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Error!')
                            .setColor('Red')
                            .setDescription('You can not input a time that is less then \`one second\` for the amount of time that you want to mute a member for.')

                    ],
                    ephemeral: true
                })
            
                console.log

            if(time > 21 * 24 * 60 * 60 * 1000)  return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error!')
                        .setColor('Red')
                        .setDescription('You can not input a time that is more then \`21 days\` for the amount of time that you want to mute a member for.')

                ],
                ephemeral: true
            })

            if (typeof time !== 'number') return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error!')
                        .setColor('Red')
                        .setDescription('Your time unit is not in the correct format, or you are entering a non-existing time unit. \n\n***Format:***\n>>> To remove a timeout, simplify not fill out the <time> option. \n\nFor timeout <time> option: ?<remove: input \'remove\' to remove the user\'s timeout> <amount of time: unit in (s, sec, second, seconds) | (m, min, minute, minutes) | (h, hr, hour, hours) | (d, day, days)>. \n\nMinimum 1 second and maximum 24 days for mute duration.')
                ],
                ephemeral: true
            })

            try {
                await member.timeout(time, reason)
                time = Math.round(time * 10) / 10
                time = time < 60 * 1000 ? `${time / 1000} Seconds` : (time < 60 * 60 * 1000 ? `${time / 1000 / 60} Minutes` : (time < 24 * 60 * 60 * 1000 ? `${time/ 1000 / 60 / 60} Hours` : `${time / 1000 / 60 / 60 / 24} Days`))
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Timeout added to: \`${member.user.tag}\``)
                            .setAuthor({
                                name: " || " + interaction.guild.name,
                                iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                            })
                            .setDescription(`<@${member.user.id}>\nDuration: \`${time}\`\nReason: \`${reason}\``)
                            .setColor('#fcba03')
                            .setThumbnail(`https://thumbs.dreamstime.com/b/no-talking-sign-no-speaking-symbol-isolated-white-background-84644262.jpg`)
                            .setFooter({
                                text: `${member.user.tag} | ${member.user.id}`,
                                iconURL: member.displayAvatarURL()
                            })
                            .setTimestamp()
                    ]
                })
            } catch {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Error!')
                            .setColor('Red')
                            .setDescription(`I could not timeout \`${member.user.tag}\`. This may be because they are higher ups.`)
                    ],
                    ephemeral: true
                })
            }
        }


    }
}
