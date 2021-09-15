const MessageEmbed = require("discord.js").MessageEmbed;

const fishHelper = require("../helpers/fishHelper")

module.exports = {
  name: "inventory",
  description: "see all the fish you've caught",
  options: [
    {
      type: "STRING",
      name: "options",
      description: "the pond of fish you'd like to see",
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
        fishHelper.displayFish(interaction, "plain");
        break;
      case "log":
        break;
      case "sell":
    }
  },
};
