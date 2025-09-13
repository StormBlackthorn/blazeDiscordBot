const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
    EmbedBuilder,
} = require('discord.js')

module.exports = {
    name: "connect4",
    description: "Play a round of connect four right in your discord server!",
    category: "fun",
    cooldown: 5000,
    userPerms: [],
    botPerms: [],
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "opponent",
        description: "Find an opponent to plat against!",
        required: false,
        type: ApplicationCommandOptionType.User,
    }, {
        name: 'nickname',
        description: 'Set a nickname for yourself if you are playing by your self!',
        required: false,
        type: ApplicationCommandOptionType.String
    }],

    async run({
        client,
        interaction
    }) {
        const { Connect4 } = require('discord-gamecord');
        let opponent = interaction.options.getUser('opponent')
        const nickname = interaction.options.getString('nickname')

            if(opponent?.bot) return interaction.reply({
                content: 'You can not challenge a bot!',
                ephemeral: true
            })

        if(nickname && opponent && opponent.id !== interaction.user.id) return interaction.reply({
            content: 'You can not have a nickname if you are mentioning someone to challenge them for a game of **connect four**, only when you are playing by yourself!',
            ephemeral: true
        })

        if(nickname) opponent = nickname
      
        new Connect4({
            message: interaction,
            isSlashGame: true,
            opponent: opponent,
            embed: {
                title: 'Connect4 Game',
                statusTitle: 'Status',
                color: '#5865F2'
            },
            emojis: {
                board: '⚫',
                player1: '🔴',
                player2: '🔵'
            },
            mentionUser: true,
            timeoutTime: 1000 * 60 * 10,
            buttonStyle: 'Primary',
            turnMessage: '{emoji} | It\'s **{player}**\'s turn!.',
            winMessage: '{emoji} | **{player}** won the Connect4 Game.',
            tieMessage: 'The Game tied! No one won the Game!',
            timeoutMessage: 'The Game went unfinished! No one won the Game!',
            playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.',
            waitingMessage: 'It is not your turn yet!',
            requestMessage: 'Hey {opponent}, seems like that {player} challenged you to a game of **Connect4**!',
            rejectMessage: 'Looks like {opponent} does not want to play a game of **Connect 4**.',
            reqTimeoutTime: 1000 * 60 * 2,
            reqTimeoutMessage: 'Looks like {opponent} didn\'t show up for a game of **Connect4**!'
        }).startGame();
    }
}



