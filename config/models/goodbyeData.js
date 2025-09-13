const { db } = require('../../index.js')
const mongoose = require('mongoose')

const leaveMsg = new mongoose.Schema({
    guildId: String,
    channelId: String,
    embed: Object, 
    active: Boolean
})

module.exports = db.model('goodbye', leaveMsg, 'Leavemsg')