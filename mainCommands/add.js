const room = require("../helpers/roomHelper");

module.exports = {
  name: "add",
  description:
    "add people in the server to your room [only affects private rooms]",
  options: [
    {
      type: "USER",
      name: "person",
      description: "the person who you'd like to add to your custom room",
      required: true,
    },
  ],
  async execute(interaction) {
    mentionedUser = interaction.options.get("person").user;

    room.addUserToRoom(interaction, mentionedUser);
  },
};
