const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    score: {
        type: Number
    },
    dailyDate: {
        type: Date
    },
    begDate: {
        type: Date
    }
})

module.exports = User = mongoose.model('User', UserSchema)