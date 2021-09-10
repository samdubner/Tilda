const MessageEmbed = require("discord.js").MessageEmbed;

module.exports = {
  name: "help",
  description: "helpful command to show you all of Tilda's features",
  options: [
    {
      type: "STRING",
      name: "menu",
      description: "select which group of commands you would like help with",
      required: true,
      choices: [
        {
          name: "Basic Commands",
          value: "basic",
        },
        {
          name: "Room Commands",
          value: "room",
        },
        {
          name: "Coin Commands",
          value: "coin",
        },
        {
          name: "Role Commands",
          value: "role",
        },
        {
          name: "Shop Commands",
          value: "shop",
        },
        {
          name: "Fish Commands",
          value: "fish",
        },
      ],
    },
  ],
  async execute(interaction) {
    let user = await helper.checkInteraction(interaction);
  },
};