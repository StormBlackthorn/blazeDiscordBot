const {
    EmbedBuilder,
    ApplicationCommandType
} = require('discord.js')

module.exports = {
    name: '8ball',
    description: 'Gives you a magical answer to your questions!',
    category: 'fun',
    cooldown: 2000,
    type: ApplicationCommandType.ChatInput,
    userPerms: [],
    botPerms: [],
    options: [{
        name: "question",
        description: "Input the question that you want to ask the magical 8ball!",
        required: true,
        type: 3,
    }],


    async run({
        client,
        interaction
    }) {
        const ball_reply = [
            "Sure!", "Yes!!!", "Nah~", "Nope.", "NEVER!!!!", "WELL DUHHHH!!!!", "Hmmmm.... Maybe.", "I don't know."
        ]
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Magic 8 ball!')
                    .setAuthor({
                        name: " || " + interaction.guild.name,
                        iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                    })
                    .setThumbnail(`https://images.squarespace-cdn.com/content/v1/55eb5878e4b0d9334622405b/1598489369604-7D8BN87MQ8HYM4T5WRQP/YIKES+MAGIC+8+BALL+STICKER.jpeg?format=750w`)
                    .setDescription(`>>> Your question: ${interaction.options.get('question').value}\n\:8ball:: ${ball_reply[Math.floor(Math.random() * ball_reply.length)]}`)
                    .setColor('#860af2')
                    .setFooter({
                        text: `requested by ${interaction.user.tag}`,
                        iconURL: interaction.member.displayAvatarURL()
                    })
                    .setTimestamp()
            ]
        })

    }
}