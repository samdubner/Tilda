import { MessageEmbed } from "discord.js"
import User from "../models/User"

module.exports = {
  name: "leaderboard",
  description: "Shows the coins of the top 5 users registered with Tilda!",
  async execute(interaction) {
    let userScores = await User.find()
      .sort([["score", -1]])
      .limit(10);

      userScores = userScores.slice(0, 5);

    let embed = new MessageEmbed()
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTitle("Coin Leaderboard")
      .setThumbnail("https://i.imgur.com/hPCYkuG.gif");

    let i = 1;
    for (let document of userScores) {
      if (document.score == userScores[0].score) {
        let user = await interaction.client.users.fetch(document.userId);
        embed.addField(
          `${1}) ${user.username}`,
          ` 🎉 ${document.score} 🎉`,
          false
        );
      } else {
        let user = await interaction.client.users.fetch(document.userId);
        embed.addField(
          `${i}) ${user.username}`,
          `${document.score}`,
          false
        );
      }
      i++;
    }

    interaction.reply({ embeds: [embed] }).catch(console.error);
  },
};