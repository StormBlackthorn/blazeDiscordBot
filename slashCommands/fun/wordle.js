const {
    ApplicationCommandType,
} = require('discord.js')

module.exports = {
    name: "wordle",
    description: "Play a game of wordle right in discord!",
    category: "fun",
    cooldown: 5000,
    userPerms: [],
    botPerms: [],
    type: ApplicationCommandType.ChatInput,
    category: 'fun',

    async run({
        client,
        interaction
    }) {
        const { Wordle } = require('discord-gamecord');

        new Wordle({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: 'Wordle',
            color: '#5865F2',
          },
          customWord: null,
          timeoutTime: 1000 * 60 * 6,
          winMessage: 'You won! The word was **{word}**.',
          loseMessage: 'You lost! The word was **{word}**.',
          playerOnlyMessage: 'Only {player} can use these buttons.',
          showKeyboard: true
        }).startGame();
  }
}