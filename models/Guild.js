const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const GuildSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },
    botChannelId: {
        type: String
    }
})

module.exports = Guild = mongoose.model("Guild", GuildSchema)