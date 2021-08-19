const MessageEmbed = require("discord.js").MessageEmbed;

const User = require("../models/User");
const helper = require("../helpers/coinHelper")

module.exports = {
  name: "beg",
  description: "Receive 10 coins every 10 minutes!",
  async execute(interaction) {
    let user = await helper.checkUser(interaction);

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
      interaction.reply({embeds: [embed]});
      return;
    }
  
    User.updateOne(
      { userId: interaction.user.id },
      { score: parseInt(user.score) + 10, begDate: new Date().getTime() }
    ).catch(console.error);
  
    let embed = new MessageEmbed()
      .setColor(`#00ff00`)
      .setTitle(`${interaction.member.displayName} got 10 coins!`)
      .setDescription(`They now have ${user.score + 10} coins`)
      .setThumbnail("https://i.imgur.com/PRhGygj.jpg");
  
    interaction.reply({embeds: [embed]});
  },
};