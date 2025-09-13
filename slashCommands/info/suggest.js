const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    EmbedBuilder,
} = require('discord.js')

module.exports = {
    name: "suggest",
    description: "write a suggestion!",
    category: "info",
    cooldown: 5000,
    userPerms: [],
    botPerms: [],
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "description",
        description: "please provide a suggestion!",
        required: true,
        type: ApplicationCommandOptionType.String,
    }, {
        name: 'image',
        description: 'provide a image for your suggestion!',
        require: false,
        type: ApplicationCommandOptionType.Attachment
    }],

    async run({
        client,
        interaction
    }) {

        const { options } = interaction;
        const suggestion = options.getString('description')
        const image = options.getAttachment('image')

        const suggestionEmbed = new EmbedBuilder()
            .setTitle('New Suggestion!')
            .setColor('Aqua')
            .setAuthor({
                name: `${interaction.guild.name} | ${interaction.guild.id}`,
                iconURL: interaction.guild.iconURL() || client.displayAvatarURL()
            })
            .setThumbnail(interaction.user.displayAvatarURL())
            .setDescription(suggestion)
            .setFooter({
                text: `${interaction.user.tag} | ${interaction.user.id}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()

            if(image) suggestionEmbed.setImage(image.url)

        try {
            client.channels.cache.get("1056333577333244027").send({
                embeds: [
                    suggestionEmbed
                ]
            })
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Your suggestion has been sent.')
                        .setDescription('Thank you for your feedback! We will look at it. This will greatly help us develop, and make our bot better!')
                        .setColor('Random')
                        .setFooter({
                            text: 'Thanks for your support!',
                            iconURL: interaction.member.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true,
            })
        } catch (e) { 
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error!')
                        .setDescription(`**Your suggestion could not be sent.**\n\n \`\`\`${e}\`\`\``)
                        .setColor('Red')
                        .setFooter({
                            text: 'If you believe this is an error, use the /report-bug command or join our server [here](https://discord.gg/JYT3jV4Xms)',
                            icon: interaction.member.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            })
        }
    }
}