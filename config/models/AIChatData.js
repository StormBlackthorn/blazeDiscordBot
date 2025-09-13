const { db } = require('../../index.js')
const mongoose = require('mongoose')

const AIChatChannels = new mongoose.Schema({
    channelId: String,
    timeoutId: Number,
})

module.exports = db.model('AIChatChannels', AIChatChannels, 'AIChatChannels')