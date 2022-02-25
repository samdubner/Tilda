import { MessageEmbed } from "discord.js";

module.exports = {
  name: "si",
  description: "Sends basic server information",
  async execute(interaction) {
    let embed = new MessageEmbed()
      .setAuthor({ name: "Server Info", iconURL: interaction.user.avatarURL() })
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setThumbnail(interaction.guild.iconURL())
      .addFields([
        { name: "Server Name", value: interaction.guild.name, inline: false },
        {
          name: "# of Members",
          value: `${interaction.guild.memberCount}`,
          inline: false,
        },
        {
          name: "# of Boosters",
          value: `${interaction.guild.premiumSubscriptionCount}`,
          inline: false,
        },
        {
          name: "Server Creation Date",
          value: interaction.guild.createdAt.toLocaleString(),
          inline: false,
        },
        {
          name: "Owner",
          value: `<@${interaction.guild.ownerId}>`,
          inline: false,
        },
      ]);

    interaction.reply({ embeds: [embed] }).catch(console.error);
  },
};
