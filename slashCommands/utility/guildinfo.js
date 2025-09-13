const {
    EmbedBuilder,
    ApplicationCommandType,
} = require('discord.js')

const { emoji } = require('../../config/config.json');
const r = emoji.reply

module.exports = {
    name: "serverinfo",
    description: 'Gets information about your server!',
    type: ApplicationCommandType.ChatInput,
    botPerms: [],
    userPerms: [],
    cooldown: 5000,
    category: "utility",

    async run({
        client,
        interaction,
    }) {

        const guild = interaction.guild;


        function channel(cnn) {
            return `\`${guild.channels.cache.filter(channel => channel.type === cnn).map(arr => arr).length}\``
        }

        let nsfwLevel;

        switch (guild.nsfwLevel) {
            case 0:
                nsfwLevel = 'Default'
                break;
            case 1:
                nsfwLevel = 'Explicit'
                break;
            case 2:
                nsfwLevel = 'Safe'
                break;
            case 3:
                nsfwLevel = 'AgeRestricted'
                break;
        }

        let boost;

        switch (guild.premiumTier) {
            case 0:
                boost = 'None';
                break;
            case 1:
                boost = 'Level 1'
                break;
            case 2:
                boost = 'Level 2'
                break;
            case 3:
                boost = 'Level 3'
                break;
        }

        let rules = guild.rulesChannelId ? `<#${guild.rulesChannelId}>` : 'None'

        let verLev;

        switch(guild.verificationLevel){
            case 0: 
                verLev = 'None';
                break;
            case 1: 
                verLev = 'Low'
                break;
            case 2: 
                verLev = 'Medium'
                break;
            case 3:
                verLev = 'High'
                break;
        }

        let icon;

        if(guild.icon){
            icon = `[__***Link***__](${guild.iconURL()})`
        } else {
            icon = '\`None\`'
        }

        let banner;

        if(guild.banner){
            banner = `[__***Link***__](${guild.bannerURL()})`
        } else {
            banner = '\`None\`'
        }

        let embed = new EmbedBuilder()
            .setTitle(`\`${interaction.guild.name}\`'s Info:`)
            .setAuthor({
                name: " || " + interaction.guild.name,
                iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
            })
            .setDescription(`**Name:** ${guild.name}\n**Server Description:** ${guild.description || 'None'}\n**Server ID:** ${guild.id}`)
            .setColor('#35FB98')
            .addFields({
                name: '***General Server info:***',
                value: `>>> **Server Icon:** ${icon}\n**Server Banner:** ${banner}\n**Server Owner:** <@${guild.ownerId}>\n**Server Verification Level:** \`${verLev}\`\n**Created At:** <t:${parseInt(guild.createdAt / 1000)}:f>(<t:${parseInt(guild.createdAt / 1000)}:R>)\n**Members:** [\`${guild.memberCount}\`]\n**NSFW level:** \`${nsfwLevel}\`\n**Boosts Level:** \`${boost}\`\n${r}**Boost:** [\`${guild.premiumSubscriptionCount || '0'}\`]\n**Verified:** \`${guild.verified}\`\n**Roles:** [\`${guild.roles.cache.size}\`]`
            }, {
                name: `***Server Channels:***`,
                value: `>>> **Total Channels:** [\`${guild.channels.channelCountWithoutThreads}\`]\n**Rules Channel:** ${rules} \n**Announcement Channels:** [${channel(5)}]\n**Text Channels: **[${channel(0)}]\n**Forum Channels**: [${channel(15)}]\n**Voice Channels:** [${channel(2)}] \n**Stage Channels:** [${channel(13)}]\n**Threads:** [${channel(12)}]`
            }, {
                name: '***Emojis And Stickers***',
                value: `>>> **Emojis:** [\`${guild.emojis.cache.map(arr => arr).filter(e => !e.animated).length}\`]\n${r} **Animated Emojis:** [\`${guild.emojis.cache.map(arr => arr).filter(e => e.animated).length}\`]\n**Stickers:** [\`${guild.stickers.cache.size}\`]`
            })
            .setFooter({
                text: `requested by ${interaction.user.tag}`,
                iconURL: interaction.member.displayAvatarURL()
            })
            .setTimestamp()

            if(guild.bannerURL()) {
                embed.setImage = guild.bannerURL({
                    dynamic: true,
                })
            }

            if(guild.iconURL()){
                embed.setThumbnail(
                    guild.iconURL({
                        dynamic: true,
                    })
                )
            } else {
                embed.setThumbnail('https://uploads.commoninja.com/searchengine/wordpress/server-info.jpg')
            }

        interaction.reply({
            embeds: [
                embed
            ]
        })
    }
}













