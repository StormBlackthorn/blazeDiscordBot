const {
    EmbedBuilder,
    ApplicationCommandOptionType,
    ApplicationCommandType,
} = require('discord.js')

module.exports = {
    name: "unban",
    description: "Unban's a member",
    category: "moderation",
    cooldown: 2000,
    type: ApplicationCommandType.ChatInput,
    userPerms: ['BanMembers'],
    botPerms: ['BanMembers'],
    options: [
        {
            name: "target",
            description: "The member that you want to unban. Provide their ID here.",
            required: true,
            type: ApplicationCommandOptionType.String,
        }, {
            name: "reason",
            description: "Reason for the unban.",
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],

    async run({
        client,
        interaction,
    }) {

        const { options } = interaction;
        let target = options.getString('target')
        const reason = options.getString('reason') || "No reason provided."
        if (target.length > 20 || target.length < 17 || !Number(target)) return interaction.reply({
            content: "Please Provide a valid user ID!",
            ephemeral: true,
        });

        try {
            await interaction.guild.bans.fetch(target)
        } catch (err) {
            return interaction.reply({
                content: "This user is not banned!",
                ephemeral: true,
            })
        }

        try {
            await interaction.guild.members.unban(target, reason)
            await interaction.reply(`***${await client.users.fetch(target)}*** unbanned for \`${reason}\`.`)
        } catch (err) {
            console.warn(err)
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error!')
                        .setAuthor({
                            name: " || " + interaction.guild.name,
                            iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                        })
                        .setDescription('I can not unban the member you were trying to unban. Make sure I have the premission to unban members. \nIf you belive that this is a mistake, *[please Join my server here](https://discord.gg/WaxXEEXbUC.)*')
                        .setColor('#51D5FF')
                        .setFooter({
                            text: `requested by ${interaction.user.tag}`,
                            iconURL: interaction.member.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            })
        }
    }
}