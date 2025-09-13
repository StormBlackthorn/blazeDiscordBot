/*
* In memory of spamming ppl with dms :D

const {
  EmbedBuilder
} = require('discord.js');

module.exports = {
  name: 'dm',
  description: '???',
  category: "secret",
  cooldown: 0,
  userPerms: [],
  botPerms: [],

  async run ({
    message, args
    }) {
    if (!message.author.id === "864372060305883136") return;

      const user = message.mentions.users.first();
      let content;
      if (!user) return message.author.send('You need to mention a user!');

      let numTimes = args[1] ? parseInt(args[1]) : 1;
      if (!numTimes) {
        numTimes = 1;
        content = args.slice(1).join(' ');
      } else if (numTimes < 1) {
        numTimes = 1;
        content = args.slice(2).join(' ');
      } else {
        content = args.slice(2).join(' ');
      }
      if (!content || content.length < 1) return message.author.send('You need to specify what to DM the user!');
      if (content.length > 2000) return message.author.send('You can\'t DM a user more than 2000 characters!');
      message.delete()
      for (let i = 0; i < numTimes; i++) {
        try {
          await user.send(content);
        } catch (e) {
          message.delete()
          console.error(e.stack);
          return message.author.send({
            embeds: [
              new EmbedBuilder()
              .setTitle('Error')
              .setDescription(`An error occurred while DMing the user.\n\`\`\`sh\n${e}\`\`\``)
              .setColor('Red')
            ]
          });
        }
      }
      return message.author.send(`DMed __*${user.tag}*__ ${content} for ***${numTimes}*** times!`);
  }
};
*/