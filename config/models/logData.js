const { db } = require('../../index.js')
const mongoose = require('mongoose')

const logData = new mongoose.Schema({
    guildId: String,
    logs: Array,
});
module.exports = db.model('logData', logData, 'LogData')