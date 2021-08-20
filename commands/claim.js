const MessageEmbed = require("discord.js").MessageEmbed;

const User = require("../models/User");
const helper = require("../helpers/coinHelper");

module.exports = {
  name: "claim",
  description: "Be the first one to claim the coin event!",
  async execute(interaction) {
    let user = await helper.checkUser(interaction);
    let result = helper.claim(interaction, user);

    if (result) {
      interaction.reply({
        content: "You won the coin event!",
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content:
          "Sorry, either you weren't first or there is no coin event to claim",
        ephemeral: true,
      });
    }
  },
};
