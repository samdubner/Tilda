const MessageEmbed = require("discord.js").MessageEmbed;

const room = require("../helpers/roomHelper");

module.exports = {
  name: "remove",
  description: "remove people from your room [only affects private rooms]",
  options: [
    {
      type: "MENTIONABLE",
      name: "person",
      description:
        "the person who you'd like to remove from your custom room",
      required: true,
    },
  ],
  async execute(interaction) {
    if (!interaction.options.get("person").user) {
      interaction.reply({
        content: "You can only remove users to your room",
        ephemeral: true,
      });
      return;
    }

    mentionedUser = interaction.options.get("person").user;

    room.removeUserFromRoom(interaction, mentionedUser)
  },
};
