// const catchHelper = require("../helpers/catchHelper");
// const coin = require("../helpers/coinHelper");

// const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "catch",
  description: "catch some fish using your coins!",
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("Sorry, this command has been temporarily disabled")
      
    interaction.reply({embeds: [embed], ephemeral: true})
    // let user = await coin.checkInteraction(interaction);

    // catchHelper.catchFish(interaction, user);
  },
};
