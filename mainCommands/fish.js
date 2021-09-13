const MessageEmbed = require("discord.js").MessageEmbed;

module.exports = {
  name: "fish",
  description: "helpful commands to manage your caught fish",
  options: [
    {
      type: "STRING",
      name: "options",
      description: "select what you'd like to do with your fish",
      required: true,
      choices: [
        {
          name: "Fish Inventory",
          value: "inventory",
        },
        {
          name: "Fish Logbook",
          value: "log",
        },
        {
          name: "Sell Fish",
          value: "sell",
        },
      ],
    },
  ],
  async execute(interaction) {
    let fishOption = interaction.options.get("options").value;

    switch(fishOption) {
      case "inventory":
        break;
      case "log":
        break;
      case "sell":
    }
  },
};
