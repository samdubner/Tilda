import { CommandInteraction, MessageEmbed } from "discord.js";

import coinHelper from "../helpers/coinHelper";
import User from "../models/User";

module.exports = {
  name: "flip",
  description: "50/50",
  options: [
    {
      type: "STRING",
      name: "amount",
      description: "the amount of coins you would like to flip",
      required: true,
    },
  ],
  async execute(interaction) {
    let user = await coinHelper.checkInteraction(interaction);
    let bet = interaction.options.get("amount").value.trim().toLowerCase();

    if (bet == "all" || bet == "a") bet = user.score;

    let flipResult = Math.floor(Math.random() * 2);

    if (user.score == 0) {
      sendErrorMessage(
        interaction,
        "You need more coins before you can bet again, try using ~daily or ~beg"
      );
      return;
    }

    if (bet <= 0 || !bet) {
      sendErrorMessage(
        interaction,
        "You have to bet a valid amount, please try again with a valid number"
      );
      return;
    }

    if (bet > user.score) {
      sendErrorMessage(
        interaction,
        "That bet is too large, please try again with a smaller bet"
      );
      return;
    }

    let scoreWon = sendResultEmbed(interaction, !!flipResult, user, bet);

    User.updateOne(
      { userId: interaction.user.id },
      { score: parseInt(user.score) + scoreWon }
    ).catch(console.error);
  },
};

const sendResultEmbed = (
  interaction: CommandInteraction,
  result: boolean,
  user,
  bet: number
): number => {
  let coinVariation = bet == 1 ? "coin" : "coins";
  let totalCoins = parseInt(user.score) + bet;
  let totalCoinsVariation = totalCoins == 1 ? "coin" : "coins";

  let embed = new MessageEmbed()
    .setColor(`#${result ? "00ff00" : "ff0000"}`)
    .setTitle(`${interaction.user.username} won ${bet} ${coinVariation}!`)
    .setDescription(`You now have ${totalCoins} ${totalCoinsVariation}`)
    .setThumbnail("https://i.imgur.com/hPCYkuG.gif");

  interaction.reply({ embeds: [embed] });
  return result ? bet : -1 * bet;
};

const sendErrorMessage = (interaction, error) => {
  let embed = new MessageEmbed()
    .setColor(`#ff0000`)
    .setTitle("Flip Error")
    .setDescription(error);

  interaction.reply({ embeds: [embed], ephemeral: true }).catch(console.error);
};
