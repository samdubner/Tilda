const MessageEmbed = require("discord.js").MessageEmbed;

const helper = require("../helpers/coinHelper");

module.exports = {
  name: "beg",
  description: "Receive 10 coins every 10 minutes!",
  async execute(interaction) {
    let user = await helper.checkInteraction(interaction);

    let checkDate = user.begDate;
    let begTimer = new Date().getTime() - 10 * 60 * 1000;

    if (begTimer < checkDate) {
      let seconds = Math.trunc(((checkDate - begTimer) / 1000) % 60);
      let minutes = Math.trunc(((checkDate - begTimer) / 60000) % 60);
      let embed = new MessageEmbed()
        .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
        .setTitle(`You've already begged too recently!`)
        .setDescription(
          `You can beg in ${minutes} ${
            minutes == 1 ? "minute" : "minutes"
          } and ${seconds} ${seconds == 1 ? "second" : "seconds"}`
        )
        .setThumbnail("https://i.imgur.com/PRhGygj.jpg");
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    user.score += 10;
    user.begDate = new Date().getTime();
    user.save();

    let embed = new MessageEmbed()
      .setColor(`#00ff00`)
      .setTitle(`${interaction.member.displayName} got 10 coins!`)
      .setDescription(`They now have ${user.score} coins`)
      .setThumbnail("https://i.imgur.com/PRhGygj.jpg");

    interaction.reply({ embeds: [embed] });
  },
};
