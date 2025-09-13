const {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    EmbedBuilder,
    ActionRowBuilder,
    ChannelType,
    StringSelectMenuBuilder,
} = require('discord.js');

const logDataSchema = require('../../config/models/logData.js')

module.exports = {
    name: 'logs',
    description: 'Set up logs for your server!',
    type: ApplicationCommandType.ChatInput,
    category: 'server',
    userPerms: ["ManageGuild"],
    botPerms: [],
    options: [{
        name: 'add',
        description: 'Add new mod log(s) to a channel!',
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            required: true,
            name: 'channel',
            description: 'The channel that you want to add the logs to.',
            type: ApplicationCommandOptionType.Channel,
            channel_types: [ChannelType.GuildText],
        }]
    }, {
        name: 'remove',
        description: 'Remove mod log(s)!',
        type: ApplicationCommandOptionType.Subcommand
    }, {
        name: 'move',
        description: 'Move mod log(s) to a new channel!',
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            required: true,
            name: 'channel',
            description: 'The channel that you want to move the logs to.',
            type: ApplicationCommandOptionType.Channel,
            channel_types: [ChannelType.GuildText],
        }]
    }, {
        name: 'info',
        description: 'A general information about the logs that you have currently set up!',
        type: ApplicationCommandOptionType.Subcommand
    }],

    async run({
        client,
        interaction
    }) {

        const { options } = interaction;
        const subCmd = options.getSubcommand();
        const channel = options?.getChannel('channel')?.id;
        const logData = await logDataSchema.findOne({
            guildId: interaction.guild.id
        });

        const allLog = [
            'Member Kicked', //+
            'Member Banned', //+
            'Member Unbanned', //+
            'Timeout Given', //+
            'Timeout Removed', //+
            'Channel Deleted', //+
            'Channel Created', //+
            'Channel Updated', //+
            'Role Created', //+
            'Role Deleted', //-
            'Role Updated', //-
            'Role Given', //+
            'Role Remove', //+
            'Member Joined', //+
            'Member Left', //+
            'Message Edited', //+
            'Message Deleted', //+
            'Member Boosted', //+
            'Member Boost Ended', //+
            'Member Nickname Changed', //+
            'Username Changed' //+
            //avatar change
            //emoji created
            //emoji deleted
            //emoji updated
            //sticker created
            //sticker deleted
            //sticker updated
            //server updated
        ];

        function convertLogs(logData, add, allData) {
            let returned = [];
            let activeLogs = [];
            if (add === true) {
                if (logData) {
                    logData.forEach((data) => data.forEach((log) => {
                        if (!Number(log)) activeLogs.push(log);
                    }));
                }
                allLog.forEach((log) => {
                    if (!activeLogs.includes(log)) {
                        returned.push({
                            label: log,
                            value: log,
                            description: 'This log is not currently active.'
                        });
                    }
                });
            } else {
                if (logData[0]) {
                    if (allData !== false) {
                        returned.push({
                            label: 'All Data',
                            value: 'All Data',
                            description: 'Remove All of the current data.'
                        })
                    }
                    logData.forEach((data) => data.forEach((log) => {
                        if (!Number(log)) {
                            returned.push({
                                label: log,
                                value: log,
                                description: 'This log is currently active.'
                            });
                        }
                    }));
                } else {
                    returned.push({
                        label: 'You have no active logs.',
                        value: 'noLog',
                        description: 'To set up a log use /logs add'
                    })
                }
            }
            return returned;
        }

        if (subCmd === 'add') {
            const msg = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Log configuration: \`Adding logs\`')
                        .setAuthor({
                            name: " || " + interaction.guild.name,
                            iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                        })
                        .setThumbnail(`https://clashroyalekingdom.com/wp-content/uploads/2017/09/The-Log-In-Depth-Analysis-Clash-Royale-Kingdom.jpg`)
                        .setDescription(`>>> Setting up logs at: <#${channel}>`)
                        .setColor('Blurple')
                        .setFooter({
                            text: `requested by ${interaction.user.tag}`,
                            iconURL: interaction.member.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('addLogs')
                                .setPlaceholder('Pick which log(s) you want to add!')
                                .addOptions(convertLogs(logData?.logs, true))
                                .setMaxValues(convertLogs(logData?.logs, true).length)
                        )
                ],
                ephemeral: true
            });

            const collector = msg.createMessageComponentCollector({ idle: 35000 })

            collector.on('collect', async (value) => {

                await value.deferUpdate();
                let newLogs = logData?.logs ?? []

                if (logData?.logs) {
                    let logChannels = []
                    logData.logs.forEach((log) => {
                        logChannels.push(log[0])
                    })
                    const index = logChannels.indexOf(channel)
                    if (index >= 0) {
                        value.values.forEach((log) => {
                            newLogs[index].push(log)
                        })
                    } else {
                        let newLog = [channel];
                        value.values.forEach((log) => {
                            newLog.push(log)
                        });
                        newLogs.push(newLog)
                    }
                } else {
                    let newLog = [channel];
                    value.values.forEach((log) => {
                        newLog.push(log)
                    });
                    newLogs.push(newLog)
                }

                await logDataSchema.findOneAndUpdate({
                    guildId: interaction.guild.id
                }, {
                    logs: newLogs
                }, {
                    upsert: true
                });

                await value.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Log configuration: \`Adding logs\`')
                            .setAuthor({
                                name: " || " + interaction.guild.name,
                                iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                            })
                            .setThumbnail(`https://clashroyalekingdom.com/wp-content/uploads/2017/09/The-Log-In-Depth-Analysis-Clash-Royale-Kingdom.jpg`)
                            .setDescription(`>>> Setting up logs at: <#${channel}>\n\nLogs added: \`${value.values.join(' ║ ')}\``)
                            .setColor('Blurple')
                            .setFooter({
                                text: `requested by ${interaction.user.tag}`,
                                iconURL: interaction.member.displayAvatarURL()
                            })
                            .setTimestamp()
                    ],
                    ephemeral: true
                });

                await interaction.editReply({
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId('addLogs')
                                    .setPlaceholder('Pick which log(s) you want to add!')
                                    .addOptions(convertLogs(logData?.logs, true))
                                    .setMaxValues(convertLogs(logData?.logs, true).length)
                            )
                    ],
                })
            });
        }

        if (subCmd === 'remove') {

            if (!logData) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error: You do not have any logs set up!')
                        .setDescription('Set up some logs using \`/logs add\`!')
                        .setColor('Red')
                        .setFooter({
                            text: `requested by ${interaction.user.tag}`,
                            iconURL: interaction.member.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            })

            const msg = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Log configuration: \`Removing logs\`')
                        .setAuthor({
                            name: " || " + interaction.guild.name,
                            iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                        })
                        .setThumbnail(`https://clashroyalekingdom.com/wp-content/uploads/2017/09/The-Log-In-Depth-Analysis-Clash-Royale-Kingdom.jpg`)
                        .setDescription(`>>> Removing logs from out database. This action can not be undone.`)
                        .setColor('Blurple')
                        .setFooter({
                            text: `requested by ${interaction.user.tag}`,
                            iconURL: interaction.member.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('removeLogs')
                                .setPlaceholder('Pick which log(s) you want to remove!')
                                .addOptions(convertLogs(logData?.logs, false))
                                .setMaxValues(convertLogs(logData?.logs, false).length)
                        )
                ],
                ephemeral: true
            });

            const collector = msg.createMessageComponentCollector({ idle: 35000 })

            collector.on('collect', async (value) => {

                await value.deferUpdate()

                let newLogs = logData?.logs

                if (value.values.includes('noLog')) {
                    return await value.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Error!')
                                .setColor('Red')
                                .setDescription('You currently have no logs set up! Use \`/logs add\` to bulk add or \`/logs home\` to add and set up each log individually!')
                        ],
                        ephemeral: true
                    })
                }

                if (!value.values.includes('All Data')) {

                    newLogs.forEach((logs) => logs.forEach((log) => {
                        if (value.values.includes(log)) {
                            logs.splice(logs.indexOf(log), 1)
                        }
                    }))

                    newLogs.forEach((logs) => logs.forEach((log) => {
                        if (value.values.includes(log)) {
                            logs.splice(logs.indexOf(log), 1)
                        }
                        if (logs.length == 1) {
                            newLogs.splice(newLogs.indexOf(logs), 1)
                        }
                    }))

                    if (newLogs.length == 0) {

                        await logDataSchema.deleteOne({
                            guildId: interaction.guild.id
                        })

                        await value.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('Log configuration: \`Removing logs\`')
                                    .setAuthor({
                                        name: " || " + interaction.guild.name,
                                        iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                                    })
                                    .setThumbnail(`https://clashroyalekingdom.com/wp-content/uploads/2017/09/The-Log-In-Depth-Analysis-Clash-Royale-Kingdom.jpg`)
                                    .setDescription(`>>> Deleted all the log data. Set it up again using \`/logs add\``)
                                    .setColor('Blurple')
                                    .setFooter({
                                        text: `requested by ${interaction.user.tag}`,
                                        iconURL: interaction.member.displayAvatarURL()
                                    })
                                    .setTimestamp()
                            ],
                            ephemeral: true
                        });
                    } else {
                        await value.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('Log configuration: \`Removing logs\`')
                                    .setAuthor({
                                        name: " || " + interaction.guild.name,
                                        iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                                    })
                                    .setThumbnail(`https://clashroyalekingdom.com/wp-content/uploads/2017/09/The-Log-In-Depth-Analysis-Clash-Royale-Kingdom.jpg`)
                                    .setDescription(`>>> Logs removed: \`${value.values.join(' ║ ')}\``)
                                    .setColor('Blurple')
                                    .setFooter({
                                        text: `requested by ${interaction.user.tag}`,
                                        iconURL: interaction.member.displayAvatarURL()
                                    })
                                    .setTimestamp()
                            ],
                            ephemeral: true
                        });
                        await logDataSchema.findOneAndUpdate({
                            guildId: interaction.guild.id
                        }, {
                            logs: newLogs
                        });
                    }
                } else {
                    await logDataSchema.deleteOne({
                        guildId: interaction.guild.id
                    })

                    await value.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Log configuration: \`Removing logs\`')
                                .setAuthor({
                                    name: " || " + interaction.guild.name,
                                    iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                                })
                                .setThumbnail(`https://clashroyalekingdom.com/wp-content/uploads/2017/09/The-Log-In-Depth-Analysis-Clash-Royale-Kingdom.jpg`)
                                .setDescription(`>>> Deleted all the log data. Set it up again using \`/logs add\` or \`/logs home\``)
                                .setColor('Blurple')
                                .setFooter({
                                    text: `requested by ${interaction.user.tag}`,
                                    iconURL: interaction.member.displayAvatarURL()
                                })
                                .setTimestamp()
                        ],
                        ephemeral: true
                    });
                }
                await interaction.editReply({
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId('removeLogs')
                                    .setPlaceholder('Pick which log(s) you want to remove!')
                                    .addOptions(convertLogs(logData?.logs, false))
                                    .setMaxValues(convertLogs(logData?.logs, false).length)
                            )
                    ],
                })
            })
        }

        if (subCmd === 'move') {

            if (!logData) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error: You do not have any logs set up!')
                        .setDescription('Set up some logs using \`/logs add\` or \`/logs home\`!')
                        .setColor('Red')
                        .setFooter({
                            text: `requested by ${interaction.user.tag}`,
                            iconURL: interaction.member.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            })

            const msg = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Log configuration: \`Moving logs\`')
                        .setAuthor({
                            name: " || " + interaction.guild.name,
                            iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                        })
                        .setThumbnail(`https://clashroyalekingdom.com/wp-content/uploads/2017/09/The-Log-In-Depth-Analysis-Clash-Royale-Kingdom.jpg`)
                        .setDescription(`>>> Setting up logs at: <#${channel}>`)
                        .setColor('Blurple')
                        .setFooter({
                            text: `requested by ${interaction.user.tag}`,
                            iconURL: interaction.member.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('moveLogs')
                                .setPlaceholder('Pick which log(s) you want to move!')
                                .addOptions(convertLogs(logData?.logs, false, false))
                                .setMaxValues(convertLogs(logData?.logs, false, false).length)
                        )
                ],
                ephemeral: true
            });

            const collector = msg.createMessageComponentCollector({ idle: 35000 })

            collector.on('collect', async (value) => {

                await value.deferUpdate()

                let newLogs = logData?.logs

                newLogs.forEach((logs) => logs.forEach((log) => {
                    if (value.values.includes(log)) {
                        logs.splice(logs.indexOf(log), 1)
                    }
                }))

                newLogs.forEach((logs) => logs.forEach((log) => {
                    if (value.values.includes(log)) {
                        logs.splice(logs.indexOf(log), 1)
                    }
                    if (logs.length == 1) {
                        newLogs.splice(newLogs.indexOf(logs), 1)
                    }
                }))

                let logChannels = []
                logData.logs.forEach((log) => {
                    logChannels.push(log[0])
                })
                const index = logChannels.indexOf(channel)
                if (index >= 0) {
                    value.values.forEach((log) => {
                        newLogs[index].push(log)
                    })
                } else {
                    let newLog = [channel];
                    value.values.forEach((log) => {
                        newLog.push(log)
                    });
                    newLogs.push(newLog)
                }

                await logDataSchema.findOneAndUpdate({
                    guildId: interaction.guild.id
                }, {
                    logs: newLogs
                }, {
                    upsert: true
                });

                await value.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Log configuration: \`Moving logs\`')
                            .setAuthor({
                                name: " || " + interaction.guild.name,
                                iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                            })
                            .setThumbnail(`https://clashroyalekingdom.com/wp-content/uploads/2017/09/The-Log-In-Depth-Analysis-Clash-Royale-Kingdom.jpg`)
                            .setDescription(`>>> Moved the following logs of: \`${value.values.join(' ║ ')}\` to <#${channel}>.`)
                            .setColor('Blurple')
                            .setFooter({
                                text: `requested by ${interaction.user.tag}`,
                                iconURL: interaction.member.displayAvatarURL()
                            })
                            .setTimestamp()
                    ],
                    ephemeral: true
                });

                await interaction.editReply({
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId('moveLogs')
                                    .setPlaceholder('Pick which log(s) you want to move!')
                                    .addOptions(convertLogs(logData?.logs, false))
                                    .setMaxValues(convertLogs(logData?.logs, false).length)
                            )
                    ],
                })

            })
        }

        if (subCmd === 'info') {

            if (!logData) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error: You do not have any logs set up!')
                        .setDescription('Set up some logs using \`/logs add\` or \`/logs home\`!')
                        .setColor('Red')
                        .setFooter({
                            text: `requested by ${interaction.user.tag}`,
                            iconURL: interaction.member.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            })

            let logs = []
            logData.logs.forEach((data) => {
                let obj = {
                    name: '\u200B',
                    value: []
                }
                data.forEach((log) => {
                    if (!Number(log)) obj.value.push(log)
                })
                obj.value = obj.value.join(' \|\| ')
                obj.value = `*** <#${data[0]}> :***\n >>> \` ${obj.value} \``
                logs.push(obj)
            })

            if (logs.length > 25) {
                logs = {
                    name: 'Error',
                    value: 'You have logs set up at more then 25 different channels, which is too long to be shown.'
                }
            }

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Log configuration: \`General Info\`')
                        .setAuthor({
                            name: " || " + interaction.guild.name,
                            iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                        })
                        .setThumbnail(`https://clashroyalekingdom.com/wp-content/uploads/2017/09/The-Log-In-Depth-Analysis-Clash-Royale-Kingdom.jpg`)
                        .setDescription(`>>> General information about logs currently set up at your server.\n\n`)
                        .setColor('Blurple')
                        .addFields(...logs)
                        .setFooter({
                            text: `requested by ${interaction.user.tag}`,
                            iconURL: interaction.member.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            })
        }

        if (subCmd === 'home') {

        }

    }
}