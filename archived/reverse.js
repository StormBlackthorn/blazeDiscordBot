/*
* useless

const {
    ApplicationCommandType
} = require('discord.js')

module.exports = {
    name: "reverse",
    description: "Reverse any text that you typed!",
    category: 'fun',
    type: ApplicationCommandType.ChatInput,
    userPerms: [],
    botPerms: [],
    options: [{
        name: "input",
        description: "Input the text that you want to reverse!",
        required: true,
        type: 3,
    }],
    async run({
        interaction,
    }) {
        interaction.reply(interaction.options.get('input').value.split("").reverse().join(""))
    }
}
*/