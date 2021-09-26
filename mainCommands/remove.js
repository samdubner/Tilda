const room = require("../helpers/roomHelper");

module.exports = {
  name: "remove",
  description: "remove people from your room [only affects private rooms]",
  options: [
    {
      type: "USER",
      name: "person",
      description: "the person who you'd like to remove from your custom room",
      required: true,
    },
  ],
  async execute(interaction) {
    mentionedUser = interaction.options.get("person").user;

    room.removeUserFromRoom(interaction, mentionedUser);
  },
};
