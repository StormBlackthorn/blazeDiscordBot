const {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    EmbedBuilder
} = require('discord.js')

module.exports = {
    name: 'http-cat',
    description: 'Get a http message....But a cute cat!',
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: 'code',
        description: 'Enter a code to get that http cat!',
        type: ApplicationCommandOptionType.Integer,
        required: false,
    }],
    userPerms: [],
    botPerms: [],
    category: 'fun',
    cooldown: 2000,

    async run({
        client,
        interaction
    }) {
        const { options } = interaction;
        const code = options.getInteger('code')
        const httpCodes = [100, 101, 102, 103, 200, 201, 202, 203, 204, 206, 207, 300, 301, 302, 303, 304, 305, 307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 420, 421, 422, 423, 424, 425, 426, 429, 431, 444, 450, 451, 497, 498, 499, 500, 501, 502, 503, 504, 506, 507, 508, 509, 510, 511, 521, 522, 523, 525, 599]

        if (!code) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Http cats!')
                        .setAuthor({
                            name: `| ${interaction.guild.name}`,
                            iconURL: interaction.guild.iconURL() || client.displayAvatarURL()
                        })
                        .setDescription(`Just some normal http meowssages....`)
                        .setImage(`https://http.cat/${httpCodes[Math.floor(Math.random() * httpCodes.length)]}`)
                        .setColor('LightGrey')
                        .setFooter({
                            text: 'Cat!!!',
                            iconURL: 'https://cdn.discordapp.com/avatars/901252674413023261/09c730a284f621016aff5e57a8fb127d.png'
                    }) 
                    .setTimestamp()
                ]
            })
        } else {
            if(!httpCodes.find(codes => codes === code)) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Opps....Invalid http meowssage....')
                        .setColor('Red')
                        .setDescription('The code you entered is not a valid http code! Make sure you got the code right!')
                        .setTimestamp()
                ],
                ephemeral: true
            })

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Http cats!')
                        .setAuthor({
                            name: `| ${interaction.guild.name}`,
                            iconURL: interaction.guild.iconURL() || client.displayAvatarURL()
                        })
                        .setDescription(`Just some normal http meowssages....`)
                        .setImage(`https://http.cat/${code}`)
                        .setColor('LightGrey')
                        .setFooter({
                            text: 'Cat!!!',
                            iconURL: 'https://cdn.discordapp.com/avatars/901252674413023261/09c730a284f621016aff5e57a8fb127d.png'
                    })
                    .setTimestamp()
                ]
            })
            
        }
    }

}