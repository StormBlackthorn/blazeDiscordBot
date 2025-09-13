const {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    EmbedBuilder,
} = require('discord.js')

module.exports = {
    name: "avatar",
    description: "get the avatar of a user!",
    cooldown: 4000,
    category: 'utility',
    type: ApplicationCommandType.ChatInput,
    userPerms: [],
    botPerms: [],
    options: [{
        name: "target",
        description: "Select a user whom you would wish to get their avatar!",
        type: ApplicationCommandOptionType.User,
        required: false,
    }, {
        name: "type",
        description: "Get the user's default avatar or server avatar(If any)",
        type: ApplicationCommandOptionType.String,
        required: false,
        choices: [{
            name: "default avatar",
            value: "user",
        },
        {
            name: "server avatar",
            value: "member",
        }
        ]
    }],

    async run({
        client,
        interaction
    }) {
        const {
            options
        } = interaction

        const type = options.getString('type')
        let target;
        let tag;

        if (type === "member") {

            target = options.getMember('target') || interaction.member
            tag = target.user.tag

        } else {

            target = options.getUser('target') || interaction.user
            tag = target.tag
        }

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${tag}'s avatar!`)
                    .setAuthor({
                        name: " || " + interaction.guild.name,
                        iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                    })
                    .setDescription(`<@${target.id}> || [Avatar Link](${target.displayAvatarURL()})`)
                    .setColor('#860af2')
                    .setImage(
                        target.displayAvatarURL({
                            dynamic: true,
                            size: 4096,
                        })
                    )
                    .setFooter({
                        text: `requested by ${interaction.user.tag}`,
                        iconURL: interaction.member.displayAvatarURL()
                    })
                    .setTimestamp()
            ]
        })

    }
}
