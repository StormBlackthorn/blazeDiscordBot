const {
	Client,
	GatewayIntentBits,
	Partials,
	Collection,
	WebhookClient,
	EmbedBuilder
} = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
	],
	partials: [
		Partials.Channel,
		Partials.Message,
		Partials.User,
		Partials.GuildMember,
		Partials.Reaction,
	]
});

require('dotenv').config()
client.commands = new Collection()
client.aliases = new Collection()
client.slashCommands = new Collection();
global.prefix = '!';

const mongoose = require('mongoose');

const glob = require('glob');
const {
	promisify
} = require('util');

const globPromise = promisify(glob);

async function func() {
	const handlers = await globPromise(`${process.cwd().replace(/\\/g, '/')}/handlers/*.js`);
	handlers.forEach((handler) => {
		require(handler)(client);
	});
}

func()

client.login(process.env.TOKEN)

function makeNewConnection(uri) {
	const db = mongoose.createConnection(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	db.on('error', function (error) {
		console.log(`MongoDB>$ connection ${this.name} ${JSON.stringify(error)}`);
		db.close().catch(() => console.log(`MongoDB>$ failed to close connection ${this.name}`));
	});

	db.on('connected', function () {
		console.log(`MongoDB>$ connected ${this.name}`);
	});

	db.on('disconnected', function () {
		console.log(`MongoDB>$ disconnected ${this.name}`);
	});

	return db;
}

const db = makeNewConnection(process.env.mongooseConnectionString);

webHook = new WebhookClient({ url: 'https://discord.com/api/webhooks/1082838778625925231/nTKgUsz7UpRIiXX5QpmVDYjC8gKLn8k4BlQv2Il7cKrxmkSdy2M5KzAzv0624gtm-GEJ' })

process.on('uncaughtException', (err, origin) => {
	try {
		webHook.send({
			content: `<@864372060305883136>`,
			embeds: [
				new EmbedBuilder()
					.setTitle('UncaughtException Error')
					.setColor('Red')
					.setDescription(`***${err} [ \`${origin}\` ]***\n\n\`\`\`sh\n${err.stack}\`\`\` `)
					.setTimestamp()
			]
		})
	} catch {
		webHook.send({
			content: `<@864372060305883136>`,
			embeds: [
				new EmbedBuilder()
					.setTitle('UncaughtException Error')
					.setColor('Red')
					.setDescription(`***${err} [ \`${origin}\` ]***\n\n\`No error backtrace due to it being too long. It has been logged to the console.\` `)
					.setTimestamp()
			]
		})
	} finally {
		console.warn(`----------ERROR----------\n${err} [ ${origin} ]\n\n${err.stack}\n-------------------------`)
	}
})

module.exports = {
	client,
	db,
}
