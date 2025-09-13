const {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    EmbedBuilder
} = require('discord.js')

module.exports = {
    name: 'dictionary',
    description: 'Search up a word in the dictionary, right in discord!',
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: 'queue',
        description: 'The word that you want to search in the dictionary!',
        type: ApplicationCommandOptionType.String,
        required: 'true',
    }],
    userPerms: [],
    botPerms: [],
    category: 'utility',
    cooldown: 3000,

    async run({
        client,
        interaction
    }) {

        let word = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${interaction.options.getString('queue')}`)

        word = await word.json()
        word = word[0]
        if (word?.title === 'No Definitions Found' || !word) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `| ${interaction.guild.name}`,

                            iconURL: interaction.guild.iconURL()
                        })
                        .setTitle('Word not found.')
                        .setColor('Red')
                        .setDescription('The word you were searching for was not found in the dictionary. Made sure you spelt the word correctly.')
                        .setFooter({
                            text: `Requested by: ${interaction.user.tag}`,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            })
        }

        let phonetic = (word?.phonetic?.audio || word?.phonetics?.find((a) => a.audio)) ? ((word?.phonetic?.text || word?.phonetics?.find((p) => p.text)) ? `Phonetic: [${word?.phonetic?.text || word?.phonetics?.find((p) => p.text).text}](${word?.phonetic?.audio || word?.phonetics?.find((a) => a.audio).audio})` : `Audio: ${word?.phonetic?.audio || word?.phonetics?.find((a) => a.audio).audio}`) : ((word?.phonetic?.text || word?.phonetics?.find((p) => p.text)) ? `Phonetic: ${word?.phonetic?.text || word?.phonetics?.find((p) => p.text).text}` : '\`No phonetic found.\`')
       
        let meanings = []
        let definitions;
        word.meanings.forEach((m) => {
            for (let d = 0; d < m.definitions.length; d++) {
                if (d !== 0) {
                    if (definitions.length + `***[${d}]:*** ${m.definitions[d].definition}\n`.length > 1024) break;
                }
                d === 0 ? definitions = `>>> ***[${d}]:*** ${m.definitions[d].definition}\n` : definitions = definitions + `***[${d}]:*** ${m.definitions[d].definition}\n`
            }
            meanings.push({
                name: `Part of Speech: \`${m.partOfSpeech}\``,
                value: definitions
            })
        })

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Dictionary: \`${interaction.options.getString('queue')}\``)
                    .setAuthor({
                        name: `| ${interaction.guild.name}`,
                        iconURL: interaction.guild.iconURL() || client.displayAvatarURL()
                    })
                    .setColor('DarkGold')
                    .setDescription(`${phonetic} | Powered by: [Dictionary API](https://dictionaryapi.dev/)`)
                    .addFields(meanings)
                    .setFooter({
                        text: `Requested by: ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .setTimestamp()
            ]
        })

    }

}