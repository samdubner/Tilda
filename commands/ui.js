const MessageEmbed = require("discord.js").MessageEmbed;

module.exports = {
  name: "ui",
  description: "Sends some basic info about the mentioned person",
  options: [
    {
      type: "USER",
      name: "person",
      description:
        "the person whose info you'd like to receive, can be yourself",
      required: true,
    },
  ],
  async execute(interaction) {
    mentionedMember = interaction.options.get("person").member;

    let nick = mentionedMember.nickname;
    let role = mentionedMember.roles.hoist || mentionedMember.roles.highest;
    let roleColor = mentionedMember.displayHexColor;
    if (roleColor == "#000000") roleColor = "#99aab5";

    let embed = new MessageEmbed()
      .setAuthor({
        name: "User Info",
        iconURL: mentionedMember.user.avatarURL(),
      })
      .setColor(roleColor)
      .setThumbnail(mentionedMember.user.avatarURL())
      .addField("Username", mentionedMember.user.username, false);
    if (!(nick == null || nick == mentionedMember.user.username)) {
      embed.addField("Nickname", nick, false);
    }

    embed.addField("Status", interaction.member.presence.status, false);

    if (interaction.member.presence.activities.length != 0) {
      embed.addField(
        "Activity",
        interaction.member.presence.activities[0].name,
        false
      );
    }

    embed.addField(
      "Joined Date",
      mentionedMember.joinedAt.toLocaleString(),
      false
    );
    embed.addField(
      "Account Creation Date",
      mentionedMember.user.createdAt.toLocaleString(),
      false
    );
    embed.addField("Highest Role", role.name, false);

    interaction.reply({ embeds: [embed] }).catch(console.error);
  },
};
