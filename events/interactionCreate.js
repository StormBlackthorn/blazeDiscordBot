const {
	Collection,
	EmbedBuilder,
	PermissionsBitField,
	Interaction,
	InteractionType
} = require('discord.js');
const ms = require('ms');
const { client } = require('../index.js')
const config = require('../config/config.json');
const cooldown = new Collection();


/** 
 * @param {Interaction} interaction
 */

module.exports = {
	event: 'interactionCreate',
	async run(interaction) {
		const slashCommand = client.slashCommands.get(interaction.commandName);

		if (interaction.isAutocomplete()) {
			if (!slashCommand) return;
			if (interaction.commandName === 'help') {
				const focused = interaction.options.getFocused();
				const choices = client.slashCommands.map(({
					name
				}) => name);
				const filtered = choices.filter((choice) => choice.includes(focused));
				if(focused) {
					await interaction.respond(
						filtered.map((choice) => ({
							name: choice,
							value: choice
						})),
					);
				}
			} else if (interaction.commandName == 'timeout') {
				const focused = interaction.options.getFocused();
				const choices = ['remove', '30seconds', '5minutes', '10minutes', '1hour', '4hours', '8hours', '1day', '3days', '7days', '21days']
				const filtered = choices.filter((choice) => choice.includes(focused));
				await interaction.respond(
					filtered.map((choice) => ({
						name: choice,
						value: choice
					})),
				);
			}
			return;
		}

		if (!interaction.guild) return interaction.reply('Please use my commands outside of my DMs!')
		if (interaction.type !== InteractionType.ApplicationCommand) return

		try {
			if (slashCommand.cooldown) {
				if (cooldown.has(`slash-${slashCommand.name}${interaction.user.id}`)) return interaction.reply({
					content: config.messages["COOLDOWN_MESSAGE"].replace('<duration>', ms(cooldown.get(`slash-${slashCommand.name}${interaction.user.id}`) - Date.now(), {
						long: true,
						ephemeral: true
					}))
				})
				if (slashCommand.userPerms || slashCommand.botPerms) {
					if (!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
						const userPerms = new EmbedBuilder()
							.setDescription(`🚫 ${interaction.user}, You don't have \`${slashCommand.userPerms}\` permissions to use this command!`)
							.setColor('Red')
						return interaction.reply({
							embeds: [userPerms],
							ephemeral: true
						})
					}
					if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
						const botPerms = new EmbedBuilder()
							.setDescription(`🚫 ${interaction.user}, I don't have \`${slashCommand.botPerms}\` permissions to use this command!`)
							.setColor('Red')
						return interaction.reply({
							embeds: [botPerms],
							ephemeral: true
						})
					}

				}

				await slashCommand.run({
					client,
					interaction
				});
				cooldown.set(`slash-${slashCommand.name}${interaction.user.id}`, Date.now() + slashCommand.cooldown)
				setTimeout(() => {
					cooldown.delete(`slash-${slashCommand.name}${interaction.user.id}`)
				}, slashCommand.cooldown)
			} else {
				if (slashCommand.userPerms || slashCommand.botPerms) {
					if (!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
						const userPerms = new EmbedBuilder()
							.setDescription(`🚫 ${interaction.user}, You don't have \`${slashCommand.userPerms}\` permissions to use this command!`)
							.setColor('Red')
						return interaction.reply({
							embeds: [userPerms],
							ephemeral: true
						})
					}
					if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
						const botPerms = new EmbedBuilder()
							.setDescription(`🚫 ${interaction.user}, I don't have \`${slashCommand.botPerms}\` permissions to use this command!`)
							.setColor('Red')
						return interaction.reply({
							embeds: [botPerms],
							ephemeral: true
						})
					}

				}
				await slashCommand.run({
					client,
					interaction
				});
			}
		} catch (e) {
			client.channels.cache.get('1064687749728309389').send({
				embeds: [
					new EmbedBuilder()
						.setTitle('Error!')
						.setDescription(`\`${interaction.user.tag}\` Used the \`${slashCommand?.name}\` command.\n\nUser ID: \`${interaction.user.id}\`\nGuild ID: \`${interaction.guild.id}\`\n\n\`\`\`sh\n${e}\`\`\``)
						.setColor('Red')
						.setTimestamp()
				]
			});
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle('Error')
						.setDescription(`An error occurred while running the command. The developers has been noticed. If you want to further help us investigate/fix this issue, *[please Join my server here](https://discord.gg/WaxXEEXbUC)*\n\`\`\`sh\n${e}\`\`\``)
						.setColor('Red')
				],
				ephemeral: true
			});
		}
	}
}