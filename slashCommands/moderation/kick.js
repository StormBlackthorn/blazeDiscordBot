const {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType,
} = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kicks a member.',
    category: 'moderation',
    cooldown: 2000,
    type: ApplicationCommandType.ChatInput,
    userPerms: ['KickMembers'],
    botPerms: ['KickMembers'],
    options: [
        {
            name: "target",
            description: "Input the target in which I am going to kick.",
            type: ApplicationCommandOptionType.User,
            required: true,
        }, {
            name: "reason",
            description: "Reason for the kick",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],

    async run({
        client,
        interaction,
    }) {
        const { options } = interaction;
        const target = options.getMember('target');
        const reason = options.getString('reason') || "No reason provided."
        if (target.id === interaction.user.id) return interaction.reply("You can not kick yourself!!!")
        if (target.id === client.user.id) return interaction.reply("I can not kick myself!")



        try {
            try {
                await target.send({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: " || " + interaction.guild.name,
                                iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                            })
                            .setThumbnail('https://th.bing.com/th/id/R.f2d7268a7d805379a4fd1c8b4e1ad52f?rik=wACaklFgLyAHZw&pid=ImgRaw&r=0')
                            .setTitle(`You have been kicked from: ${interaction.guild.name}.`)
                            .setDescription(`Reason: \`${reason}\``)
                            .setColor('Red')
                            .setFooter({
                                text: `kicked for ${reason} from ${interaction.guid.name}.`,
                                iconURL: target.displayAvatarURL()
                            })
                            .setTimestamp()
                    ]
                })
            } catch (error) {
                interaction.channel.send(`${target.user.tag} has been kicked, but failed to send DM inform the kick. They may have DMs disabled.`)
            }
            await target.kick({
                reason: reason
            })
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: " || " + interaction.guild.name,
                            iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                        })
                        .setThumbnail('https://th.bing.com/th/id/R.f2d7268a7d805379a4fd1c8b4e1ad52f?rik=wACaklFgLyAHZw&pid=ImgRaw&r=0')
                        .setTitle(`${target.user.tag} has been kicked from: ${interaction.guild.name}.`)
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
                        .setDescription('I cannot kick the member you were trying to kick. They may be higherUps, and make sure I have the permission to kick members, and permission to kick the person you were trying to kick. \n If you belive that this is a mistake, *[please Join our server here](https://discord.gg/WaxXEEXbUC.)*')
                        .setColor('#51D5FF')
                        .setFooter({
                            text: `requested by ${interaction.user.tag}`,
                            iconURL: interaction.member.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            })
        }
    }
};