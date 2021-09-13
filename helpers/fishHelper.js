const MessageEmbed = require("discord.js").MessageEmbed;

const coin = require("./coinHelper");
const catchHelper = require("./catchHeler")
const User = require("../models/User");
const Fish = require("../models/Fish");

const PONDS = catchHelper.PONDS