import { MessageEmbed } from "discord.js";
import coinHelper from "../helpers/coinHelper";

module.exports = {
  name: "balance",
  description: "View the amount of coins you have",
  async execute(interaction) {
    let user = await coinHelper.checkInteraction(interaction);

    let coinVariation = user.score == 1 ? "coin" : "coins";
    let embed = new MessageEmbed()
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTitle(`${interaction.member.displayName}'s Balance`)
      .setDescription(
        `${interaction.member.displayName} has ${user.score} ${coinVariation}`
      );

    interaction.reply({ embeds: [embed] });
  },
};
