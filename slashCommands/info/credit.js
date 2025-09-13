const {
    EmbedBuilder,
    ApplicationCommandType
} = require('discord.js')

module.exports = {
    name: 'credit',
    description: 'Credits for making this bot!',
    type: ApplicationCommandType.ChatInput,
    userPerms: [],
    botPerms: [],
    cooldown: 4000,
    category: 'info',

    async run({
        client,
        interaction
    }) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Credits')
                    .setAuthor({
                        name: " || " + interaction.guild.name,
                        iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                      })
                      .setThumbnail(client.user.displayAvatarURL())
                      .setColor('Gold')
                      .setDescription('Thank you too all the amazing contributors and helpers along the way to make this bot possible! <3')
                      .addFields({
                        name: 'Owner:',
                        value: '[Storm7093#6591](https://discord.gg/JYT3jV4Xms)'
                      }, {
                        name: 'Other Contributors:',
                        value: '>>> [Kep#7418](https://discord.com/api/oauth2/authorize?client_id=1028128311924240414&permissions=8&scope=bot)'
                      }, {
                        name: 'Beta Testers:',
                        value: '>>> [EpicToonz#2936](https://www.animusic.com/)'
                      }, {
                        name: 'Special Thanks:',
                        value: '>>> [Shinpi#6183](https://discord.gg/j3YamACwPu)\n[Duro#5232](https://spark-handler.js.org/)\n[ShadowOP#6222](https://nightfang.cf/)\n[Joe7101#4642](https://github.com/joeyk710/sample-discordjs-bot) -- My man is a legend.'
                      })
                      .setFooter({
                        text: `Big thank you to you too! Thanks for supporting my hard work and inviting my bot!!!`,
                        iconURL: interaction.member.displayAvatarURL()
                      })
                      .setTimestamp()
            ]
        })
    }
}