import { MessageEmbed } from "discord.js";

module.exports = {
  name: "about",
  description: "basic information about Tilda",
  async execute(interaction) {

    let embed = new MessageEmbed()
      .setAuthor({
        name: "User Info",
        iconURL: interaction.client.avatarURL,
      })
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setThumbnail(interaction.client.user.avatarURL())
    interaction.reply({ embeds: [embed] }).catch(console.error);
  },
};
