const {
	ActivityType
} = require('discord.js');
const { client } = require('../index.js')
const chalk = require('chalk');

module.exports = {
	event: 'ready',
	async run() {
		const activities = [{
				name: `${client.guilds.cache.size} Servers`,
				type: ActivityType.Listening
			},
			{
				name: `CAT!!!`,
				type: ActivityType.Playing
			},
			{
				name: `${client.guilds.cache.reduce((acc, { memberCount }) => acc + memberCount, 0)} Users`,
				type: ActivityType.Watching
			},
			{
				name: `Meow! /help`,
				type: ActivityType.Competing
			}
		];

		let i = 0;
		setInterval(() => {
			if (i >= activities.length) i = 0
			client.user.setActivity(activities[i])
			i++;
		}, 5000);
		
		console.log(chalk.red(`Logged in as ${client.user.tag}!`));
		global.slashCommandsFetchList = await client.application.commands.fetch();
	}
}