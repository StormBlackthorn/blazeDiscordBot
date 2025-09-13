const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    EmbedBuilder,
} = require('discord.js')

module.exports = {
    name: "report-bug",
    description: "Report a bug that you found while using the bot!",
    category: "info",
    cooldown: 5000,
    userPerms: [],
    botPerms: [],
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "description",
        description: "please provide a description of your bug!",
        required: true,
        type: ApplicationCommandOptionType.String,
    }, {
        name: 'image',
        description: 'provide a image on your bug!',
        require: false,
        type: ApplicationCommandOptionType.Attachment
    }],

    async run({
        client,
        interaction
    }) {

        const { options } = interaction;
        const bug = options.getString('description')
        const image = options.getAttachment('image')

        const bugReport = new EmbedBuilder()
            .setTitle('New Bug Report!')
            .setColor('Red')
            .setAuthor({
                name: `${interaction.guild.name} | ${interaction.guild.id}`,
                iconURL: interaction.guild.iconURL() || client.displayAvatarURL()
            })
            .setThumbnail(interaction.user.displayAvatarURL())
            .setDescription(bug)
            .setFooter({
                text: `${interaction.user.tag} | ${interaction.user.id}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()

            if(image) bugReport.setImage(image.url)

        try {
            client.channels.cache.get("1056333545854992514").send({
                embeds: [
                    bugReport
                ]
            })
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Your report has been sent.')
                        .setDescription('Thank you for your feedback! We will look at it. This will greatly help us develop, and make our bot better!')
                        .setColor('Random')
                        .setFooter({
                            text: 'Thanks for your support!',
                            iconURL: interaction.member.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            })
        } catch (e) { 
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error!')
                        .setDescription(`**Your report could not be sent.**\n\n \`\`\`${e}\`\`\``)
                        .setColor('Red')
                        .setFooter({
                            text: 'If you still want to report this, please join our server [here](https://discord.gg/JYT3jV4Xms)',
                            icon: interaction.member.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            })
        }
    }
}