const MessageEmbed = require("discord.js").MessageEmbed;

const room = require("../helpers/roomHelper");

module.exports = {
  name: "add",
  description: "add people in the server to your room [only affects private rooms]",
  options: [
    {
      type: "MENTIONABLE",
      name: "person",
      description:
        "the person who you'd like to add to your custom room",
      required: true,
    },
  ],
  async execute(interaction) {
    if (!interaction.options.get("person").user) {
      interaction.reply({
        content: "You can only add users to your room",
        ephemeral: true,
      });
      return;
    }

    mentionedUser = interaction.options.get("person").user;

    room.addUserToRoom(interaction, mentionedUser)
  },
};
