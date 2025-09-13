const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  name: 'help',
  description: 'The help menu',
  category: 'info',
  cooldown: 1000,
  type: ApplicationCommandType.ChatInput,
  userPerms: [],
  botPerms: [],
  options: [{
    name: "command",
    description: "Details about the command of your choice!",
    type: ApplicationCommandOptionType.String,
    required: false,
    autocomplete: true,
  }],

  async run({
    client,
    interaction,
  }) {
    const {
      options
    } = interaction;
    if (options.getString('command')) {

      const cmdString = options.getString('command');
      const command = client.slashCommands.get(cmdString);
      if(!command) return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('Error!')
            .setColor('Red')
            .setDescription(`The command \`${cmdString}\` does not exist.`)
        ],
        ephemeral: true
      })

  
      let commandType;

      if (command.type === 1) {
        commandType = "Chat Input"
      } else if (command.type === 2) {
        commandType = "User"
      } else if (command.type === 3) {
        commandType = "Message"
      }

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
          .setTitle(`Help Menu | ${command.name}`)
          .setDescription(`***Description: ${command.description}***`)
          .setAuthor({
            name: " || " + interaction.guild.name,
            iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
          })
          .setThumbnail('https://cdn-icons-png.flaticon.com/512/682/682055.png')
          .setColor('#14FFA4')
          .addFields({
            name: `Cooldown:`,
            value: `\`${Number(command.cooldown) / 1000} seconds\``,
            inline: true,
          }, {
            name: `User permission:`,
            value: `\`${command.userPerms[0] ?? "None"}\``,
            inline: true,
          }, {
            name: `Bot permission:`,
            value: `\`${command.botPerms[0] ?? "None"}\``,
            inline: true,
          }, {
            name: `Category:`,
            value: `\`${command.category}\``,
            inline: true,
          }, {
            name: `Type:`,
            value: `\`${commandType}\``,
            inline: true,
          })
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.member.displayAvatarURL()
          })
          .setTimestamp()
        ],
        components: [
          new ActionRowBuilder()
          .addComponents([
            new ButtonBuilder()
            .setLabel('Invite')
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=8&scope=bot%20applications.commands`)
            .setStyle(ButtonStyle.Link)
          ])
          .addComponents([
            new ButtonBuilder()
            .setLabel('Server')
            .setURL('https://discord.gg/5ZkHmczvuW')
            .setStyle(ButtonStyle.Link)
          ])
          .addComponents([
            new ButtonBuilder()
            .setLabel('Website')
            .setURL('https://stormblackthorn.cf/')
            .setStyle(ButtonStyle.Link)
          ])
          .addComponents([
            new ButtonBuilder()
            .setLabel('Youtube')
            .setURL('https://www.youtube.com/channel/UCJKumJYcn8y6TMB5hAtVdUQ')
            .setStyle(ButtonStyle.Link)
          ])
        ]
      })
    }

    const commands = client.slashCommands;
    let cmds = [];
    const cmdCategories = await commands.map(cmd => cmd.category);
    const catFilter = [...new Set(cmdCategories)];
    let count = 0;
    let slashCommands = []
    
      var slashCmd = commands.map(cmd => cmd.name)
      slashCmd.forEach((item) => {
        item = item.split('')
        item.splice(0, 0, '</')
        item.push(`:${slashCommandsFetchList.map((slash) => slash.id)[count]}>`)
        item = item.join('')
        count++
        slashCommands.push(item)
      })    

    for (const cat of catFilter) {
      const catCommands = commands.filter((cmds) => cmds.category === cat).map((cmd) => cmd.name)
        cmds.push({
          name: `📂 ${cat.toUpperCase()} 〘${catCommands.length}〙`,
          value: `ㅤ➢ **-﴾**  ${slashCommands.filter((item) => catCommands.includes(item.split(':')[0].slice(2))).join(' **║** ')}  **﴿-**`,
        });
    }

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
        .setTitle('Help Menu')
        .setAuthor({
          name: " || " + interaction.guild.name,
          iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
        })
        .setThumbnail('https://cdn-icons-png.flaticon.com/512/682/682055.png')
        .setDescription(`Total commands: 〘${commands.map((name) => name).length}〙`)
        .setColor('#14FFA4')
        .addFields({
          name: `type /help <command> to learn more about that command!`,
          value: '\u200B'
        })
        .addFields(...cmds)
        .addFields({
          name: '\u200B',
          value: '*[Join my server](https://discord.gg/WaxXEEXbUC) • [Invite me](https://discordapp.com/api/oauth2/authorize?client_id=1001343278316277810&permissions=8&scope=bot%20applications.commands) • [Youtube channel](https://www.youtube.com/channel/UCJKumJYcn8y6TMB5hAtVdUQ)*'
        })
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.member.displayAvatarURL()
        })
        .setTimestamp()
      ],
      components: [
        new ActionRowBuilder()
        .addComponents([
          new ButtonBuilder()
          .setLabel('Invite')
          .setURL(`https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=8&scope=bot%20applications.commands`)
          .setStyle(ButtonStyle.Link)
        ])
        .addComponents([
          new ButtonBuilder()
          .setLabel('Server')
          .setURL('https://discord.gg/5ZkHmczvuW')
          .setStyle(ButtonStyle.Link)
        ])
        .addComponents([
          new ButtonBuilder()
          .setLabel('Website')
          .setURL('https://stormblackthorn.cf/')
          .setStyle(ButtonStyle.Link)
        ])
        .addComponents([
          new ButtonBuilder()
          .setLabel('Youtube')
          .setURL('https://www.youtube.com/channel/UCJKumJYcn8y6TMB5hAtVdUQ')
          .setStyle(ButtonStyle.Link)
        ])
      ]
    })
  }
}