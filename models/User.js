const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Role = require('./Role')

const UserSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    score: {
        type: Number
    },
    dailyDate: {
        type: Number
    },
    begDate: {
        type: Number
    },
    role: {
        type: Role.schema
    }
})

module.exports = User = mongoose.model('User', UserSchema)