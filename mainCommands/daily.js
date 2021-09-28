const MessageEmbed = require("discord.js").MessageEmbed;

const User = require("../models/User");
const helper = require("../helpers/coinHelper");

module.exports = {
  name: "daily",
  description:
    "Get 100 coins once every 24 hours (do it every day for a bonus)!",
  async execute(interaction) {
    let user = await helper.checkInteraction(interaction);

    let dailyDone = user.dailyDone;

    if (dailyDone) {
      let currentDate = new Date();
      let hours = 23 - currentDate.getHours();
      let hourText = hours == 1 ? "hour" : "hours";
      let minutes = 59 - currentDate.getMinutes();
      let minuteText = minutes == 1 ? "minute" : "minutes";

      let embed = new MessageEmbed()
        .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
        .setTitle(`You already got your daily today!`)
        .setDescription(
          `Daily will reset in ${hours} ${hourText} and ${minutes} ${minuteText}`
        )
        .setThumbnail("https://i.imgur.com/PRhGygj.jpg");

      interaction.reply({ embeds: [embed], ephemeral: true }).catch(console.error);
      return;
    }

    user.streak++;
    let streakBonus = user.streak * 10;
    if (streakBonus > 200) streakBonus = 200;
    let totalDaily = 100 + streakBonus;

    User.updateOne(
      { userId: interaction.user.id },
      {
        score: parseInt(user.score) + totalDaily,
        dailyDone: true,
        streak: user.streak,
      }
    ).catch(console.error);

    let embed = new MessageEmbed()
      .setColor(`#00ff00`)
      .setTitle(`${interaction.member.displayName} got ${totalDaily} coins!`)
      .setDescription(`They now have ${user.score + totalDaily} coins`)
      .setFooter(`Daily Streak: ${user.streak} days`)
      .setThumbnail("https://i.imgur.com/PRhGygj.jpg");

    interaction.reply({ embeds: [embed] }).catch(console.error);
  },
};
