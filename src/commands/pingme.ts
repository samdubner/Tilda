import { MessageEmbed } from "discord.js"

module.exports = {
  name: "pingme",
  description: "enable/disable certain roles for notifications!",
  options: [
    {
      name: "role",
      type: "STRING",
      description: "the role you'd like to add/remove for pings",
      required: true,
      choices: [
        {
          name: "Announcements",
          value: "announcements",
        },
        {
          name: "Events",
          value: "events",
        },
      ],
    },
  ],
  async execute(interaction) {
    if (interaction.guild.id != "881621682870190091") {
      interaction.reply({
        content: "You cannot use this command outside of Tilda's main server",
        ephemeral: true,
      });
      return;
    }

    let announcementsRole = "881733593595011094";
    let eventsRole = "892624445737422849";

    let setRole =
      interaction.options.getString("role") == "announcements"
        ? announcementsRole
        : eventsRole;

    let hasRole = interaction.member.roles.cache.has(setRole);
    let role = await interaction.guild.roles.fetch(setRole);

    let embed = new MessageEmbed()
      .setAuthor({
        name: `Announcement Pings`,
        iconURL: interaction.user.avatarURL(),
      })
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);

    if (hasRole) {
      interaction.member.roles.remove(setRole);

      embed
        .setColor(`#ff0000`)
        .addField(
          `You have removed the \`${role.name}\` role!`,
          `You will no longer be pinged with the \`${role.name}\` role`
        );
    } else {
      interaction.member.roles.add(setRole);

      embed
        .setColor(`#00ff00`)
        .addField(
          `You now have the \`${role.name}\` role!`,
          `You will now be pinged with the \`${role.name}\` role`
        );
    }

    interaction
      .reply({ embeds: [embed], ephemeral: true })
      .catch(console.error);
  },
};
