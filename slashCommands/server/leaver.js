
const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    EmbedBuilder,
    ChannelType,
} = require('discord.js')

const leaver = require('../../config/models/goodbyeData.js')

module.exports = {

    name: "leaver",
    description: "Set up a leave message that gets send into a channel of your choice when user leaves!",
    category: "server",
    cooldown: 3000,
    userPerms: ['ManageGuild'],
    botPerms: [],
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "channel",
        description: "setting up the channel for the embed to be sent",
        type: ApplicationCommandOptionType.SubcommandGroup,
        options: [{
            name: 'set',
            description: 'Picking which channel to sent the leaver in!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'channel',
                description: 'The channel for the leaver to be sent',
                required: true,
                type: ApplicationCommandOptionType.Channel,
                channel_types: [ChannelType.GuildText]
            }]
        }]
    }, {
        name: "embed",
        description: "setting up the channel for the embed to be sent",
        type: ApplicationCommandOptionType.SubcommandGroup,
        options: [{
            name: 'set',
            description: 'Set up the embed that you want to send for the leaver!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'author_text',
                description: 'the author text if the embed',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'author_icon',
                description: 'icon of the author text',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'author_url',
                description: 'url of the author text',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'title_url',
                description: 'set the url of the title',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'title',
                description: 'set the title for your embed',
                type: ApplicationCommandOptionType.String
            }, {
                name: `description`,
                description: 'set the description for your embed',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'color',
                description: 'the color of the embed',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'thumbnail',
                description: 'Thumbnail of the embed',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'image',
                description: 'image of the embed',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'footer_text',
                description: 'Text of the footer',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'footer_icon',
                description: 'Icon of the footer',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'timestamp',
                description: 'Wether or not to set a timestamp',
                type: ApplicationCommandOptionType.Boolean,
            }]
        }, {
            name: 'edit',
            description: 'edit your existing embed!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'author_text',
                description: 'the author text if the embed',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'author_icon',
                description: 'icon of the author text',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'author_url',
                description: 'url of the author text',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'title_url',
                description: 'set the url of the title',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'title',
                description: 'set the title for your embed',
                type: ApplicationCommandOptionType.String
            }, {
                name: `description`,
                description: 'set the description for your embed',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'color',
                description: 'the color of the embed',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'thumbnail',
                description: 'Thumbnail of the embed',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'image',
                description: 'image of the embed',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'footer_text',
                description: 'Text of the footer',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'footer_icon',
                description: 'Icon of the footer',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'timestamp',
                description: 'Wether or not to set a timestamp',
                type: ApplicationCommandOptionType.Boolean,
            }]
        }, {
            name: 'reset',
            description: 'Reset your leaver to the default leaver',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'confirm',
                description: 'This action can not be undone. Select true to confirm this action.',
                type: ApplicationCommandOptionType.Boolean,
                required: true,
            }]
        }]
    }, {
        name: 'active',
        description: 'Toggle wether or not the leaver to be active',
        type: ApplicationCommandType.ChatInput,
        options: [{
            name: 'active',
            description: 'to active the leaver or not',
            type: ApplicationCommandOptionType.Boolean,
            required: true,
        }]
    }, {
        name: 'test',
        description: 'Try to sent a message in the leaver\'s channel',
        type: ApplicationCommandType.ChatInput
    }, {
        name: 'preview',
        description: 'Get a preview of what your leaver looks like!',
        type: ApplicationCommandOptionType.Subcommand,
    }, {
        name: 'help',
        description: 'Get help on how to use the leaver!',
        type: ApplicationCommandOptionType.Subcommand,
    }],

    async run({
        client,
        interaction,
    }) {

        //functions
        function parseStringTemplate(str, values) {
            const raw = str.split(/\$\{(?!\d)[\wæøåÆØÅ]*\}/);
            const args = str.match(/[^{\}]+(?=})/g) ?? [];
            const params = args.map(
                (a) => values[a] || (values[a] === undefined ? `\${${a}}` : values[a])
            );

            return String.raw({ raw }, ...params);
        }

        function parseObjectTemplate(obj, values) {
            const parsed = {};
            Object.keys(obj).forEach((key) => {
                const val = obj[key];

                if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                    return Object.assign(parsed, {
                        [key]: parseObjectTemplate(val, values)
                    });
                }

                return parsed[key] = parseStringTemplate(val, values);
            });

            return parsed;
        }
        //console.log(parseObjectTemplate(obj, values));

        //Link check function
        function isLink(url) {
            const linkExp = /(https?:\/\/[^\s]+)/g;
            if (url.match(linkExp)) {
                return true;
            } else {
                return false;
            }
        }

        //Image check function
        function isImage(url) {
            const imgExp = /\.(jpg|jpeg|png|webp|avif|gif|svg|JPG|JPEG|PNG)$/;
            return imgExp.test(url);
        }

        //Color check function
        function isColor(color) {
            const colorExp = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
            if (color.match(colorExp)) {
                return true;
            } else {
                return false;
            }
        }

        function errorEmbed(error) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('Error!')
                        .setDescription(error)
                ],
                ephemeral: true,
            })
        }

        function lineBreak(embed) {
            embed.description ? embed.description = embed.description?.replace(/\\n/g, '\n') : null
            embed.title ? embed.title = embed.title?.replace(/\\n/g, '\n') : null
            embed.author?.name ? embed.author.name = embed.author.name.replace(/\\n/g, '\n') : null
            embed.footer?.text ? embed.footer.text = embed.footer.text.replace(/\\n/g, '\n') : null
            return;
        }

        async function checkImage(url) {
            try {
                const response = await fetch(url)

                return response.ok
            } catch (err) {
                return false
            }

        }

        //defs
        const { options } = interaction;

        //command defs
        const subCmdGroup = options.getSubcommandGroup();
        const subCmd = options.getSubcommand();

        //embed defs
        const authorText = options.getString('author_text');
        const authorIcon = options.getString('author_icon');
        const authorUrl = options.getString('author_url');
        const titleUrl = options.getString('title_url');
        const title = options.getString('title');
        const description = options.getString('description');
        const color = options.getString('color');
        const thumbnail = options.getString('thumbnail');
        const image = options.getString('image');
        const footerText = options.getString('footer_text');
        const footerIcon = options.getString('footer_icon');
        let timestamp = options.getBoolean('timestamp');


        //default embed
        const defaultEmbed = {
            title: '${memberTag} left the server',
            hexColor: `#079de8`,
            description: 'Member: <@${memberID}>\n\nWe\'re sorry to see you leave. We hoped that you had a fun time in our server!',
            thumbnail: {
                url: '${memberAvatar}'
            },
            image: {
                url: 'https://thumbs.dreamstime.com/t/hand-drawn-good-bye-lettering-sketch-white-handwritten-calligraphy-doodle-brush-painted-letter-star-signature-stroke-195761356.jpg'
            },
            author: {
                name: 'There is now ${serverMemberCount}\'th members left.',
                icon_url: '${serverIcon}',
            },
            footer: {
                text: '${memberID}',
                icon_url: '${memberAvatar}',
            },
            timestamp: `true`
        }

        //mongoose data
        let embed = await leaver.findOne({
            guildId: interaction.guild.id
        }).embed || defaultEmbed

        let exist = await leaver.findOne({
            guildId: interaction.guild.id
        })


        if (subCmdGroup === 'channel') {

            if (subCmd === 'set') {

                exist = await leaver.findOneAndUpdate({
                    guildId: interaction.guild.id
                }, {
                    guildId: interaction.guild.id,
                    channelId: options.getChannel('channel').id,
                    embed: embed,
                    active: true,
                }, {
                    upsert: true
                })

                try {
                    await client.channels.cache.get(options.getChannel('channel').id).send('Leaver has been set to be sent at this channel!')
                    await interaction.reply(`The leaver channel is now set to <#${options.getChannel('channel').id}>!\n\nYour leaver is now active! use \`/leaver active\` to un-active it!`)
                } catch (err) {
                    await interaction.reply('Your leaver has been set up, but I am unable to sent messages in the channel you in which you set up the leaver. Please make sure I have the permissions to send messages there! use \`/leaver test\` to test if I can sent message in the leaver channel or not!')
                }

            }

        }

        if (subCmdGroup === 'embed') {


            if (subCmd === 'reset') {
                const reset = options.getBoolean('confirm')

                if (!exist) return interaction.reply({
                    content: 'You currently don\'t have any leavers set up!',
                    ephemeral: true
                })

                if (reset) {
                    await leaver.findOneAndUpdate({
                        guildId: interaction.guild.id
                    }, {
                        embed: defaultEmbed
                    })
                    await interaction.reply({
                        content: 'Your leaver has now been reset to the default leaver.',
                        ephemeral: true
                    })
                } else {
                    return interaction.reply({
                        content: 'Please pick \`true\` in the options to confirm your reset!',
                        ephemeral: true
                    })
                }
            }

            if (subCmd === 'set') {
                timestamp === true ? 'true' : 'false'

                if ((authorUrl || authorIcon) && (!authorText || authorText.toLowerCase() === 'none')) {
                    return errorEmbed(`Please have an \`author name\` property value if you have \`author url\` or \`author icon url\` property value.`);
                }
                if (authorUrl && !isLink(authorUrl) && authorUrl.toLowerCase() !== 'none') {
                    return errorEmbed(`Please enter a valid url for \`author url\``);
                }
                if (authorIcon && !(isImage(authorIcon) || checkImage(authorIcon)) && authorIcon.toLowerCase() !== 'none') {
                    return errorEmbed(`Please enter a valid image link for \`author icon url\``);
                }
                if (color && !isColor(color) && color.toLowerCase() !== 'none') {
                    return errorEmbed(`Please enter a valid hex color!`);
                }
                if (titleUrl && (!title || title.toLowerCase() === 'none')) {
                    return errorEmbed(`Please enter \`embed title\` property if you have \`title url\` property `);
                }
                if (titleUrl && !isLink(titleUrl) && titleUrl.toLowerCase() !== 'none') {
                    return errorEmbed(`Please enter a valid url for \`title url\` property.`);
                }
                if (footerIcon && (!footerText || footerText.toLowerCase() !== 'none')) {
                    return errorEmbed(`Please have an \`embed footer text\` property value if you have \`embed footer icon\ property value.\``);
                }
                if (footerIcon && !(isImage(footerIcon) || checkImage(footerIcon)) && footerIcon.toLowerCase() !== 'none') {
                    return errorEmbed(`Please enter a valid image link for \`embed footer icon url\``);
                }
                if (image && !(isImage(image) || checkImage(image)) && image.toLowerCase() !== 'none') {
                    return errorEmbed(`Please enter a valid image link for \`embed image url\` property.`);
                }
                if (thumbnail && !(isImage(thumbnail) || checkImage(image)) && thumbnail.toLowerCase() !== 'none') {
                    return errorEmbed(`Please enter a valid image link for \`thumbnail url\` property.`);
                }
                if (
                    !(
                        authorText ||
                        title ||
                        description ||
                        footerText ||
                        image ||
                        thumbnail
                    )
                ) {
                    return errorEmbed(`You need at least one image or text field!`);
                }
                var embedObj = {
                    title: title,
                    hexColor: color,
                    description: description,
                    url: titleUrl,
                    thumbnail: {
                        url: thumbnail
                    },
                    image: {
                        url: image
                    },
                    author: {
                        name: authorText,
                        icon_url: authorIcon,
                        url: authorUrl
                    },
                    footer: {
                        text: footerText,
                        icon_url: footerIcon
                    },
                    timestamp: timestamp
                }

                for (const key in embedObj) {
                    const val = embedObj[key]

                    if (val === null) {
                        delete embedObj[key]
                    }

                    if (typeof val === 'object' && val !== null) {
                        for (const valKey in val) {
                            if (val[valKey] === null) {
                                delete val[valKey]
                            }
                        }
                        if (Object.keys(val).length === 0) {
                            delete embedObj[key]
                        }
                    }
                }

                const leaverChannelID = exist.channelId ? exist.channelId : null
                const activeleaver = exist.channelId ? true : false

                await leaver.findOneAndUpdate({
                    guildId: interaction.guild.id
                }, {
                    guideId: interaction.guild.id,
                    channelId: leaverChannelID,
                    embed: embedObj,
                    active: activeleaver
                }, {
                    upsert: true
                })

                const e = parseObjectTemplate(embedObj, {
                    memberAvatar: interaction.user.displayAvatarURL(),
                    memberName: interaction.user.username,
                    memberTag: interaction.user.tag,
                    memberID: interaction.user.id,
                    memberCreationDay: `<t:${parseInt(interaction.user.createdAt / 1000)}:f>(<t:${parseInt(interaction.user.createdAt / 1000)}:R>)`,
                    serverIcon: interaction.guild.iconURL() ? interaction.guild.iconURL() : client.user.displayAvatarURL(),
                    serverName: interaction.guild.name,
                    serverID: interaction.guild.id,
                    serverMemberCount: interaction.guild.memberCount,
                })

                if (e.timestamp === 'true') {
                    e.timestamp = new Date().toISOString()
                } else {
                    delete e.timestamp
                }

                if (e.color) {
                    e.color = resolveColor(e.color)
                }

                lineBreak(e)

                const leaverChannel = exist.channelId ? `<#${exist.channelId}>` : 'None. use \`/leaver channel set\` to set a leaver channel!'
                const leaverActive = exist.channelId ? '\`true\`' : '\`false\`. Use \`/leaver active\` to active it!'

                interaction.reply({
                    content: `**Leaver Info:**\n\n>>> Leaver Channel: ${leaverChannel}\nLeaver Activated: ${leaverActive}\n\n**Leaver Embed Preview:**\n>>> *Don't like what you see, or made a mistake? Use \`/leaver embed edit\` to edit a embed part, so you don't have to rebuild the whole embed!*`,
                    embeds: [
                        e
                    ],
                    ephemeral: true
                })

            }

            if (subCmd === 'edit') {
                if (timestamp !== null) {
                    timestamp = timestamp === true ? 'true' : 'false'
                }


                const target = await leaver.findOne({
                    guildId: interaction.guild.id
                })

                if (!target.embed) {
                    return interaction.reply({
                        content: 'You don\'t have any leaver set up!',
                        ephemeral: true
                    })
                }

                if ((authorUrl || authorIcon) && (!authorText || authorText.toLowerCase() === 'none')) {
                    return errorEmbed(`Please have an \`author name\` property value if you have \`author url\` or \`author icon url\` property value.`);
                }
                if (authorUrl && !isLink(authorUrl) && authorUrl.toLowerCase() !== 'none') {
                    return errorEmbed(`Please enter a valid url for \`author url\``);
                }
                if (authorIcon && !(isImage(authorIcon) || checkImage(authorIcon)) && authorIcon.toLowerCase() !== 'none') {
                    return errorEmbed(`Please enter a valid image link for \`author icon url\``);
                }
                if (color && !isColor(color) && color.toLowerCase() !== 'none') {
                    return errorEmbed(`Please enter a valid hex color!`);
                }
                if (titleUrl && (!title || title.toLowerCase() === 'none')) {
                    return errorEmbed(`Please enter \`embed title\` property if you have \`title url\` property `);
                }
                if (titleUrl && !isLink(titleUrl) && titleUrl.toLowerCase() !== 'none') {
                    return errorEmbed(`Please enter a valid url for \`title url\` property.`);
                }
                if (footerIcon && (!footerText || footerText.toLowerCase() !== 'none')) {
                    return errorEmbed(`Please have an \`embed footer text\` property value if you have \`embed footer icon\ property value.\``);
                }
                if (footerIcon && !(isImage(footerIcon) || checkImage(footerIcon)) && footerIcon.toLowerCase() !== 'none') {
                    return errorEmbed(`Please enter a valid image link for \`embed footer icon url\``);
                }
                if (image && !(isImage(image) || checkImage(image)) && image.toLowerCase() !== 'none') {
                    return errorEmbed(`Please enter a valid image link for \`embed image url\` property.`);
                }
                if (thumbnail && !(isImage(thumbnail) || checkImage(image)) && thumbnail.toLowerCase() !== 'none') {
                    return errorEmbed(`Please enter a valid image link for \`thumbnail url\` property.`);
                }

                const source = {
                    title: title,
                    hexColor: color,
                    description: description,
                    url: titleUrl,
                    thumbnail: {
                        url: thumbnail
                    },
                    image: {
                        url: image
                    },
                    author: {
                        name: authorText,
                        icon_url: authorIcon,
                        url: authorUrl
                    },
                    footer: {
                        text: footerText,
                        icon_url: footerIcon
                    },
                    timestamp: timestamp
                }

                for (const key in source) {
                    const val = source[key]

                    if (val === null) {
                        delete source[key]
                    }

                    if (typeof val === 'object' && val !== null) {
                        for (const valKey in val) {
                            if (val[valKey] === null) {
                                delete val[valKey]
                            }
                        }
                        if (Object.keys(val).length === 0) {
                            delete source[key]
                        }
                    }
                }


                const newEmbed = Object.assign(target.embed, source)

                for (const key in newEmbed) {
                    const val = newEmbed[key]

                    if (typeof val === 'object') {
                        for (const valKey in val) {
                            if (val[valKey].toLowerCase() === 'none') {
                                delete val[valKey]
                            }
                        }
                        if (Object.keys(val).length === 0) {
                            delete newEmbed[key]
                        }
                    } else {
                        if (val.toLowerCase() === 'none') {
                            delete newEmbed[key]
                        }
                    }
                }

                if (
                    !(
                        newEmbed.author?.text ||
                        newEmbed.title ||
                        newEmbed.description ||
                        newEmbed.footer?.text ||
                        newEmbed.image?.url ||
                        newEmbed.thumbnail?.url
                    )
                ) {
                    return errorEmbed(`You need at least one image or text field!`);
                }

                await leaver.findOneAndUpdate({
                    guildId: interaction.guild.id
                }, {
                    embed: newEmbed
                })

                const e = parseObjectTemplate(newEmbed, {
                    memberAvatar: interaction.user.displayAvatarURL(),
                    memberName: interaction.user.username,
                    memberTag: interaction.user.tag,
                    memberID: interaction.user.id,
                    memberCreationDay: `<t:${parseInt(interaction.user.createdAt / 1000)}:f>(<t:${parseInt(interaction.user.createdAt / 1000)}:R>)`,
                    serverIcon: interaction.guild.iconURL() ? interaction.guild.iconURL() : client.user.displayAvatarURL(),
                    serverName: interaction.guild.name,
                    serverID: interaction.guild.id,
                    serverMemberCount: interaction.guild.memberCount,
                })

                if (e.timestamp === 'true') {
                    e.timestamp = new Date().toISOString()
                } else {
                    delete e.timestamp
                }

                if (e.color) {
                    e.color = resolveColor(e.color)
                }

                lineBreak(e)

                const leaverChannel = exist.channelId ? `<#${exist.channelId}>` : 'None. use \`/leaver channel set\` to set a leaver channel!'
                const leaverActive = exist.channelId ? '\`true\`' : '\`false\`. Use \`/leaver active\` to active it!'

                interaction.reply({
                    content: `**Leaver Info:**\n\n>>> Leaver Channel: ${leaverChannel}\nLeaver Activated: ${leaverActive}\n\n**Leaver Embed Preview:**\n>>> *Don't like what you see, or made a mistake? Use \`/leaver embed edit\` to edit a embed part, so you don't have to rebuild the whole embed!*`,
                    embeds: [
                        e
                    ],
                    ephemeral: true
                })
            }
        }


        if (subCmd === 'active') {
            const active = options.getBoolean('active')


            if (!exist) return interaction.reply({
                content: 'You currently don\'t have any leavers set up!',
                ephemeral: true
            })

            if (!exist.channelId) return interaction.reply({
                content: 'You currently don\'t have any leaver channel set up! Use \`/leaver channel set\` to set up a channel!',
                ephemeral: true
            })

            if (active === true) {
                await leaver.findOneAndUpdate({
                    guildId: interaction.guild.id
                }, {
                    active: true
                })
                return interaction.reply({
                    content: 'Leaver is now active!!',
                    ephemeral: true
                })
            } else {
                await leaver.findOneAndUpdate({
                    guildId: interaction.guild.id
                }, {
                    active: false,
                })
                return interaction.reply({
                    content: 'Leaver is now de-activated!!',
                    ephemeral: true
                })
            }
        }

        if (subCmd === 'test') {
            if (!exist) return interaction.reply({
                content: 'You currently don\'t have any leaver set up!',
                ephemeral: true
            })

            try {
                await client.channels.cache.get(exist.channelId).send('leaver can be sent in this channel!')
                await interaction.reply(`Leaver can be sent in <#${exist.channelId}>!`)
            } catch (err) {
                interaction.reply(`Unable to sent messages in <#${exist.channelId}>. Make sure I have the permission to send messages there!`)
            }
        }
        if (subCmd === 'preview') {

            if (exist) {

                embed = await leaver.findOne({
                    guildId: interaction.guild.id
                })

                const e = parseObjectTemplate(embed.embed, {
                    memberAvatar: interaction.user.displayAvatarURL(),
                    memberName: interaction.user.username,
                    memberTag: interaction.user.tag,
                    memberID: interaction.user.id,
                    memberCreationDay: `<t:${parseInt(interaction.user.createdAt / 1000)}:f>(<t:${parseInt(interaction.user.createdAt / 1000)}:R>)`,
                    serverIcon: interaction.guild.iconURL() ? interaction.guild.icoRL() : client.user.displayAvatarURL(),
                    serverName: interaction.guild.name,
                    serverID: interaction.guild.id,
                    serverMemberCount: interaction.guild.memberCount,
                })

                if (e.author?.icon_url?.toString() === 'null') {
                    e.author.icon_url = client.user.displayAvatarURL()
                }

                if (e.timestamp === 'true') {
                    e.timestamp = new Date().toISOString()
                } else {
                    delete e.timestamp
                }

                if (e.color) {
                    e.color = resolveColor(e.color)
                }
                const leaverActive = exist.channelId ? '\`true\`' : '\`false\`. Use \`/leaver active\` to active it!'

                interaction.reply({
                    content: `Leaver Channel: <#${exist.channelId}>\nLeaver Activated: ${leaverActive}`,
                    embeds: [
                        e
                    ],
                    ephemeral: true
                })
            } else {
                interaction.reply('No leaver found!')
            }
        }
        if (subCmd === 'help') {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Leaver Help!`)
                        .setAuthor({
                            name: " || " + interaction.guild.name,
                            iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                        })
                        .setColor('DarkVividPink')
                        .addFields({
                            name: '**Leaver variables:**',
                            value: 'You can use \`none\` for a embed field value if you wish to remove it! For example, if your title field was \`hello!\`, but when you edit it you set it to \`none\`, the title will no longer appear! \n\nVariables for embed making: you can use these \"variables\" to make your leaver better! Put the variables inside ${}, for example ${variable}, to make them work!\n\n>>> \`memberAvatar\` -- The URL of the new user\'s avatar\n\`memberName\` -- get the name of the new user (Ex: Storm7093)\n\`memberTag\` -- gets the username **and** the discriminator (Ex: Storm7093#6591)\n\`memberId\` -- ID of the new user\n\`memberCreationDay\` -- The creation day of the new user\'s account\n\`serverIcon\` -- icon URL of the server\n\`serverName\` -- name of the server\n\`serverId\` -- ID of the server\n \`serverMemberCount\` -- The current member count of the server\n\nTo switch line(go down a line/line break), just type \`\\n\` Example: Hello\\nWorld. Result: \nHello\nWorld'
                        }, {
                            name: `**Leaver Embed Setup:**`,
                            value: `>>> The \`/leaver channel set\` quickly sets up your leaver, which sends the default embed at the channel of your choice.\n\nYou can use \`/leaver embed set\` to set up your embed. Made a typo? No worries! Use the \`/leaver embed edit\` to edit your embed without ever rebuilding it! Input \`none\` to delete that field!!\n\nUse \`/leaver embed reset\` to reset your leaver to the default embed!`
                        }, {
                            name: '**Others**',
                            value: '>>> \`/leaver active\` allows you to either enable or disable your leaver without losing your embed/message data.\n \`/leaver test\` allows you to test if the leaver can be sent at the channel you provided. If your leaver doesn\'t send, try using this command.\n\`/leaver preview\` allows you to preview your leaver, and basic information about your current leaver.'
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
}


















