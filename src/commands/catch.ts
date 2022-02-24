import { MessageEmbed } from "discord.js";
// import coinHelper from "../helpers/coinHelper";
// import catchHelper from "../helpers/catchHelper";

module.exports = {
  name: "catch",
  description: "catch some fish using your coins!",
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle("Sorry, this command has been temporarily disabled")
      
    interaction.reply({embeds: [embed], ephemeral: true})
    // let user = await coinHelper.checkInteraction(interaction);

    // catchHelper.catchFish(interaction, user);
  },
};
