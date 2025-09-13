/*
* In the good memory of AI chat by ChatGPT
* I am officially broke and have no money to pay :(
* I worked so hard for this too :((((

const { client } = require('../../index.js')
const AIChat = require('../config/models/AIChatData.js')
const { EmbedBuilder } = require('discord.js')

module.exports = {
	event: 'messageCreate',
	async run(message) {

		try {
			let next = true
			let chat = await AIChat.findOne({
				channelId: message.channel.id
			})
			if (message.author.bot) return;
			if (!chat) return;

			const APIRequestBody = {
				model: 'gpt-3.5-turbo',
				messages: [
					{ role: 'system', content: 'I am a nice, friendly, funny and smart Discord bot named Blaze Blackthorn, female and age 16, developed by Storm7093#6591' },
					{ role: 'user', content: message.content }
				]
			}

			await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					"Authorization": "Bearer " + process.env.openAIAPIKey,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(APIRequestBody)
			}).then((data) => {
				return data.json()
			}).then(async (data) => {
				if(data?.error?.message == 'You exceeded your current quota, please check your plan and billing details.') {
					message.reply('Sorry, but our monthly free ChatGPT API usage has exceed the limit. Sorry for the inconvenience, but this command is free to everyone, so please understand. You AI Chat session has been stopped.')
					await AIChat.findOneAndDelete({
						channelId: message.channel.id
					})
					return next = false
				}
				if (!data?.choices) return message.reply('Slow down there! The API is currently getting rate limited. Please wait a second or two before sending another message!')
				return message.reply(data?.choices ? (data?.choices[0]?.message?.content.length > 2000 ? data?.choices[0]?.message?.content?.slice(0, 1800)?.split('')?.push('.........(Answer sliced off due to it being longer then 2000 characters).') : data?.choices[0]?.message?.content) : 'An error occurred while generating a reply.')
			}).then(async () => {
				if (!next) return
				chat = await AIChat.findOne({
					channelId: message.channel.id
				})
				clearTimeout(chat.timeoutId)
				const timeoutId = setTimeout(async () => {
					chat = await AIChat.findOne({
						channelId: message.channel.id
					})
					if (chat) {
						await client.channels.cache.get(chat.channelId).send('The AI Chat session has been ended due to inactivity for ten minutes(excluding bot messages).')
						await AIChat.findOneAndDelete({
							channelId: message.channel.id
						})
					}

				}, 600000)

				await AIChat.findOneAndUpdate({
					channelId: message.channel.id
				}, {
					timeoutId: timeoutId
				})
			})

		} catch (e) {
			console.log(e)
			await AIChat.findOneAndDelete({
				channelId: message.channel.id
			})
			await client.channels.cache.get('1064687749728309389').send({
				embeds: [
					new EmbedBuilder()
						.setTitle('Error!')
						.setDescription(`\`${message.author.tag}\` Used the \`${message.name}\` command.\n\nUser ID: \`${message.author.id}\`\nGuild ID: \`${message.guild.id}\`\n\n\`\`\`sh\n${e}\`\`\``)
						.setColor('Red')
						.setTimestamp()
				]
			});
			return message.reply({
				content: 'An error occurred while using this command. The AI chat feature is still a little unstable, so sorry about this. The devs has been contacted.',
				ephemeral: true
			})
		}


	}
}
*/
