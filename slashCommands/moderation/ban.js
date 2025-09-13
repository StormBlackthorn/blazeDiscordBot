const {
    EmbedBuilder,
    ApplicationCommandType,
} = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bans a member.',
    category: 'moderation',
    cooldown: 5000,
    type: ApplicationCommandType.ChatInput,
    userPerms: ['BanMembers'],
    botPerms: ['BanMembers'],
    options: [
        {
            name: "target",
            description: "Input the target in which I am going to ban.",
            required: true,
            type: 6,
        }, {
            name: "reason",
            description: "reason for the ban",
            required: false,
            type: 3,
        }, {
            name: "time",
            description: "The amount of message you want to delete in a certain time that is send by the banned user.",
            required: false,
            type: 4,
            choices: [
                {
                    name: "Don't delete any",
                    value: 0,
                }, {
                    name: "10 minutes",
                    value: 10 * 60,
                }, {
                    name: "1 hour",
                    value: 60 * 60,
                }, {
                    name: "12 hours",
                    value: 12 * 60 * 60,
                }, {
                    name: "1 day",
                    value: 24 * 60 * 60,
                }, {
                    name: "3 days",
                    value: 3 * 24 * 60 * 60
                }, {
                    name: "7 days",
                    value: 7 * 24 * 60 * 60
                }
            ]
        }
    ],

    async run({
        client,
        interaction
    }) {

        const { options } = interaction;
        const target = options.getMember('target')
        const reason = options.getString('reason') || "No reason provided.";
        const time = options.getInteger('time') || 0

        if (target.id === interaction.member.id) return interaction.reply("You can not ban yourself!!!")
        if (target.id === client.id) return interaction.reply("I can not ban myself!")

        try {
            try {
                await target.send({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: " || " + interaction.guild.name,
                                iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                            })
                            .setThumbnail('https://banner2.kisspng.com/20180730/stl/kisspng-banhammer-android-tool-discord-emoji-5b5e9fe002f965.9803036015329279680122.jpg')
                            .setTitle(`${target.user.tag} has been banned from: ${interaction.guild.name}.`)
                            .setDescription(`User: <@${target.id}> \nReason: \`${reason}\``)
                            .setColor('Red')
                            .setFooter({
                                text: `${target.user.tag} | ${target.id}`,
                                iconURL: target.displayAvatarURL()
                            })
                            .setTimestamp()
                    ]
                })
            } catch (error) {
                interaction.channel.send(`${target.user.tag} has been banned, but failed to send DM inform the ban. They may have DMs disabled.`)
            }
            await target.ban({
                reason: reason,
                deleteMessageSeconds: time,
            })
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: " || " + interaction.guild.name,
                            iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                        })
                        .setThumbnail('https://banner2.kisspng.com/20180730/stl/kisspng-banhammer-android-tool-discord-emoji-5b5e9fe002f965.9803036015329279680122.jpg')
                        .setTitle(`${target.user.tag} has been banned from: ${interaction.guild.name}.`)
                        .setDescription(`User: <@${target.id}> \nReason: \`${reason}\``)
                        .setColor('Red')
                        .setFooter({
                            text: `${target.user.tag} | ${target.id}`,
                            iconURL: target.displayAvatarURL()
                        })
                        .setTimestamp()
                ]
            })
        } catch (err) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error!')
                        .setAuthor({
                            name: " || " + interaction.guild.name,
                            iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                        })
                        .setDescription('I can not ban the member you were trying to ban. Make sure I have the permission to ban members. \n If you believe that this is a mistake, *[please Join our server here](https://discord.gg/WaxXEEXbUC.)*')
                        .setColor('#51D5FF')
                        .setFooter({
                            text: `requested by ${interaction.user.tag}`,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            })
        }
    }
};