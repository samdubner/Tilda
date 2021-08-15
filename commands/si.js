const MessageEmbed = require("discord.js").MessageEmbed;

module.exports = {
  name: "update",
  description: "updates tilda to the latest version! (authorized users only)",
  async execute(interaction) {
    let embed = new MessageEmbed()
    .setAuthor("Server Info", message.author.avatarURL())
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setThumbnail(message.guild.iconURL())
    .addFields([
      { name: "Server Name", value: message.guild.name, inline: false },
      { name: "# of Members", value: message.guild.memberCount, inline: false },
      {
        name: "# of Boosters",
        value: message.guild.premiumSubscriptionCount,
        inline: false,
      },
      {
        name: "Server Creation Date",
        value: message.guild.createdAt.toLocaleString(),
        inline: false,
      },
      { name: "Owner", value: message.guild.owner, inline: false },
    ]);

  message.channel.send(embed).catch(console.error);
  },
};
