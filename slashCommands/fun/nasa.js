const {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    EmbedBuilder
} = require('discord.js')

module.exports = {
    name: 'nasa',
    description: 'Get some amazing photos and facts about the mysterious space....Powered by NASA API!',
    type: ApplicationCommandType.ChatInput,
    category: 'fun',
    userPerms: [],
    botPerms: [],
    cooldown: 5000,
    options: [{
        name: 'apod',
        description: 'Astronomy Picture of the Day!',
        type: ApplicationCommandOptionType.Subcommand
    }],

    async run({
        client,
        interaction
    }) {
        return interaction.reply({
            content: 'Coming soon!',
            ephemeral: true
        })
    }

}