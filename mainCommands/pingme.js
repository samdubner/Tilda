const MessageEmbed = require("discord.js").MessageEmbed;

module.exports = {
  name: "pingme",
  description: "enable/disable being pinged for server announcements!",
  async execute(interaction) {
    let announcementsRole = "881733593595011094"
    let hasRole = interaction.member.roles.cache.has(announcementsRole);

    let embed = new MessageEmbed()
      .setAuthor(`Announcement Pings`, interaction.user.avatarURL())
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);

    if (hasRole) {
      interaction.member.roles.remove(announcementsRole);

      embed
        .setColor(`#ff0000`)
        .addField(
          `You have disabled announcement pings!`,
          `You will no longer be pinged when there is a server announcement`
        );
    } else {
      interaction.member.roles.add(announcementsRole);

      embed
        .setColor(`#00ff00`)
        .addField(
          `You have enabled announcement pings!`,
          `You will now be pinged whenever there is a server announcement`
        );
    }

    interaction
      .reply({ embeds: [embed], ephemeral: true })
      .catch(console.error);
  },
};
