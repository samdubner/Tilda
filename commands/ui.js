const MessageEmbed = require("discord.js").MessageEmbed;

module.exports = {
  name: "ui",
  description: "Sends some basic info about the mentioned person",
  options: [
    {
      type: "MENTIONABLE",
      name: "person",
      description: "the person whose info you'd like to receive, can be yourself",
      required: true,
    },
  ],
  async execute(interaction) {
    let nick = interaction.member.nickname;
    let role = interaction.member.roles.hoist || interaction.member.roles.highest;
    let roleColor = interaction.member.displayHexColor;
    if (roleColor == "#000000") roleColor = "#99aab5";

    let embed = new MessageEmbed()
      .setAuthor("User Info", interaction.user.avatarURL())
      .setColor(roleColor)
      .setThumbnail(interaction.user.avatarURL())
      .addField("Username", interaction.user.username, false);
    if (!(nick == null || nick == interaction.user.username)) {
      embed.addField("Nickname", nick, false);
    }
    // if (interaction.member.presence.activities.length != 0) {
    //   embed.addField("Game", interaction.member.presence.activities[0].name, false);
    // }
    // embed.addField("Status", interaction.member.presence.status, false);
    embed.addField(
      "Joined Date",
      interaction.member.joinedAt.toLocaleString(),
      false
    );
    embed.addField(
      "Account Creation Date",
      interaction.user.createdAt.toLocaleString(),
      false
    );
    embed.addField("Highest Role", role.name, false);

    interaction.reply({embeds: [embed]}).catch(console.error);
  },
};