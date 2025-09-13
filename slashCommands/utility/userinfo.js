const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    EmbedBuilder,
} = require('discord.js')

const { emoji } = require('../../config/config.json');
const rc = emoji.rc
const r = emoji.r

module.exports = {
    name: "userinfo",
    description: "get a user's info!",
    category: "utility",
    cooldown: 5000,
    userPerms: [],
    botPerms: [],
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "target",
        description: "the target that you want to get more info about",
        required: false,
        type: ApplicationCommandOptionType.User,
    }],

    async run({
        client,
        interaction
    }) {

        const { options } = interaction
        const target = options.getUser('target') || interaction.user
        const member = options.getMember('target') || interaction.member
        let banner;

        if (!target.bannerURL()) {
            banner = `None`
        } else {
            banner = `[__***Link***__](${target.bannerURL()})`;
        }

        let mute;

        if (member.isCommunicationDisabled()) {
            mute = `True(<t:${parseInt(member.communicationDisabledUntil / 1000)}:R>)`
        } else {
            mute = "False"
        }

        let avatarURL;

        if (member.displayAvatarURL() === target.displayAvatarURL()) {
            avatarURL = `[__***Same as user***__](${member.displayAvatarURL()})`
        } else {
            avatarURL = `[__***Link***__(${member.displayAvatarURL()})]`
        }

        let boost;

        if (!member.premiumSince) {
            boost = "Never boosted this server."
        } else {
            boost = `Last boosted at: <t${parseInt(member.premiumSince / 1000)}:f>(<t:${parseInt(member.premiumSince / 1000)}:R>)`
        }

        let permissions;
        var perms_count = 0;

        if (member.permissions.toArray().length === 40) {
            permissions = "Have all permissions except \`Administrator\`."
            perms_count = 41;
        } else if (member.permissions.has('Administrator')) {
            permissions = "Have \`Administrator\` permission(Overrides every other permission)."
            perms_count = 41;

        } else {
            let arr;
            let perms = [];
            if (!member.permissions.toArray()) {
                permissions = "None."
            } else {
                for (arr of member.permissions.toArray()) {
                    arr = arr.split()
                    arr.splice(0, 0, '*\`')
                    arr.push('\`*')
                    perms.push(arr.join(''))
                    perms_count++
                }
            }
            permissions = perms.join(' ***|*** ')
        }

        let bot;

        if (target.bot) {
            bot = `True\n${rc} **System:** ${target.system}\n${r}**Verified:** ${target.flags.toArray().includes('VerifiedBot') ? true : false}\n`
        } else {
            bot = "false"
        }

        let roles = [];
        let roles_count = 0;

        if (member.roles) {
            for (const arr of member.roles.cache.map((arr) => arr)) {
                roles.push(arr)
                roles_count++;
            }
            roles.join(' ***|*** ')
        } else {
            roles = "None."
        }

        let activity;
        let status;

        if (!member.presence) {
            activity = 'None'
            status = "Offline"

        } else {
            activity = member.presence.activities.map(act => act).filter(act => act.name !== 'Custom Status');
            status = member.presence.activities.map(act => act).filter(act => act.name === 'Custom Status');

            if (status.length > 0) {
                status = `${member.presence.status}\n${r} ${status.map(stat => stat.emoji) || ''} ${status.map(stat => stat.state) || ''}`
            } else {
                status = member.presence.status
            }

            if (activity.length > 0) {

                const actName = activity.map(act => act.name)
                let actType = activity.map(act => act.type)
                let actTime = `<t:${Math.round(activity[0].createdTimestamp / 1000)}:R>`;

                switch (actType[0]) {
                    case 0:
                        actType = "Playing"
                        break;
                    case 1:
                        actType = 'Streaming'
                        break;
                    case 2:
                        actType = "Listening"
                        break;
                    case 3:
                        actType = "Watching"
                        break;
                    case 5:
                        actType = 'Competing'
                        break;
                    default:
                        actType = 'None'
                        break;
                }

                if (actType === "Listening") {
                    activity = `${actType} to \`${actName}\`\n${r} Created At: ${actTime}`
                } else {
                    activity = `${actType} \`${actName}\`\n${r} Created At: ${actTime}`
                }
            } else {
                activity = "None"
            }

        }
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`\`${target.tag}\`'s user info`)
                    .setAuthor({
                        name: " || " + interaction.guild.name,
                        iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                    })
                    .setDescription(`__*Target: <@${target.id}>*__`)
                    .setThumbnail(target.displayAvatarURL())
                    .setColor(member.displayHexColor)
                    .addFields({
                        name: "***General Info:***",
                        value: `>>> **Status:** ${status}\n**Activity:** ${activity}\n**User ID:** ${target.id}\n**Tag:** ${target.tag}\n**Created at:** <t:${parseInt(target.createdAt / 1000)}:f>(<t:${parseInt(target.createdAt / 1000)}:R>)\n**Avatar URL:** [__***Link***__](${target.displayAvatarURL()})\n**Banner URL:** ${banner}`
                    }, {
                        name: "***User Info(In Server):***",
                        value: `>>> **Nickname:** ${member.displayName}\n**Joined at:** <t:${parseInt(member.joinedAt / 1000)}:f>(<t:${parseInt(member.joinedAt / 1000)}:R>)\n**Muted:** ${mute}\n**Avatar:** ${avatarURL}\n**Boost:** ${boost}\n**Roles[${roles_count}]:** ${roles}\n**Premissions[${perms_count}]:** ${permissions}`
                    }, {
                        name: "***Bot:***",
                        value: `>>> **Bot:** ${bot}`
                    })
                    .setFooter({
                        text: `requested by ${interaction.user.tag}`,
                        iconURL: interaction.member.displayAvatarURL()
                    })
                    .setTimestamp()
            ]
        })
    }
}


