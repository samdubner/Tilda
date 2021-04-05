const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Role = require('./Role')
const Item = require('./Item')

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
    },
    items: {
        type: [Schema.Types.ObjectId],
        ref: "Item"
    }
})

module.exports = User = mongoose.model('User', UserSchema)