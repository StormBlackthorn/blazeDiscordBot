/*
* Useless, causes bugs

const {
    EmbedBuilder,
    ApplicationCommandType,
} = require('discord.js');

module.exports = {
    name: 'random',
    description: 'Pick a random whole number between two digits of your choice!',
    category: 'fun',
    cooldown: 4000,
    type: ApplicationCommandType.ChatInput,
    userPerms: [],
    botPerms: [],
    options: [{
        name: "number1",
        description: "Input the first number.",
        required: true,
        type: 4,
    }, {
        name: "number2",
        description: "Input the second number.",
        required: true,
        type: 4,
    }],
    async run({
        client,
        interaction,
    }) {
        const {
            options
        } = interaction;

        let min = options.getInteger('number1')
        let max = options.getInteger('number2')
        let max1;
        let min1;

        if (min === max) return interaction.reply({
            content: "Please enter two different numbers, so I can give a random number between them!",
            ephemeral: true
        })
        if (max < min) {
            min1 = min
            max1 = max
            min = max1;
            max = min1;
        }
        const reply = Math.round(Math.random() * (max - min + 1) + min)
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle('Random Number!')
                .setAuthor({
                    name: " || " + interaction.guild.name,
                    iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                })
                .setThumbnail(`https://earnthis.net/wp-content/uploads/2015/02/numbers.jpg`)
                .setDescription(`Your random digit between __*${min}*__ and __*${max}*__ is ***${reply}***`)
                .setColor('#51D5FF')
                .setFooter({
                    text: `requested by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp()
            ]
        })
    }
};
*/