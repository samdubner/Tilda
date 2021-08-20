const MessageEmbed = require("discord.js").MessageEmbed;

const User = require("../models/User");
const helper = require("../helpers/coinHelper");

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
    let user = await helper.checkUser(interaction);
    let args = interaction.options.get("amount").value.toLowerCase();

    let flipResult = Math.floor(Math.random() * 2);
    let bet = Math.ceil(args.split(" ")[0]);

    if (user.score == 0) {
      sendErrorMessage(
        interaction,
        "You need more coins before you can bet again, try using ~daily or ~beg"
      );
      return;
    }

    if (bet <= 0) {
      sendErrorMessage(
        interaction,
        "You cannot bet a number of coins less than or equal to zero"
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

    if (
      (args == null || args == undefined || isNaN(args) || args == "") &&
      args != "all" &&
      args != "a"
    ) {
      sendErrorMessage(
        interaction,
        "You have to bet a valid amount, please try again with a valid number"
      );
      return;
    }

    if (args == "all" || args == "a") bet = user.score;

    let scoreWon = bet;

    let totalCoins;
    let totalCoinsVariation;

    let coinVariation;

    if (flipResult) {
      totalCoins = parseInt(user.score) + parseInt(scoreWon);
      coinVariation = scoreWon == 1 ? "coin" : "coins";
      totalCoinsVariation = totalCoins == 1 ? "coin" : "coins";
      let embed = new MessageEmbed()
        .setColor("#00ff00")
        .setTitle(
          `${interaction.user.username} won ${scoreWon} ${coinVariation}!`
        )
        .setDescription(`They now have ${totalCoins} ${totalCoinsVariation}`)
        .setThumbnail("https://i.imgur.com/hPCYkuG.gif");
      interaction.reply({ embeds: [embed] });
      scoreWon = bet;
    } else {
      totalCoins = parseInt(user.score) - parseInt(scoreWon);
      coinVariation = scoreWon == 1 ? "coin" : "coins";
      totalCoinsVariation = totalCoins == 1 ? "coin" : "coins";
      let embed = new MessageEmbed()
        .setColor("#ff0000")
        .setTitle(
          `${interaction.user.username} lost ${scoreWon} ${coinVariation}`
        )
        .setDescription(`They now have ${totalCoins} ${totalCoinsVariation}`)
        .setThumbnail("https://i.imgur.com/hPCYkuG.gif");
      interaction.reply({ embeds: [embed] });
      scoreWon = bet * -1;
    }

    User.updateOne(
      { userId: interaction.user.id },
      { score: parseInt(user.score) + parseInt(scoreWon) }
    ).catch(console.error);
  },
};

const sendErrorMessage = (interaction, error) => {
  let embed = new MessageEmbed()
    .setColor(`#ff0000`)
    .setTitle("Flip Error")
    .setDescription(error);

  interaction.reply({ embeds: [embed], ephemeral: true }).catch(console.error);
};
