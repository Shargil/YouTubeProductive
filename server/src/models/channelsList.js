const mongoose = require('mongoose')

const channelsListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    upVotes: {
        type: Number,
        default: 0
    },
    numOfUsers: {
        type: Number,
        default: 0
    },
    list: {
        type: Array,
        required: true
    },
});

module.exports = mongoose.model('ChannelsList', channelsListSchema)