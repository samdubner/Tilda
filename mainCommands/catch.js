const MessageEmbed = require("discord.js").MessageEmbed;

const catchHelper = require("../helpers/catchHelper")
const coin = require("../helpers/coinHelper")

module.exports = {
  name: "catch",
  description: "helpful command to show you all of Tilda's features",
  options: [
    {
      type: "STRING",
      name: "pond",
      description: "the pond you'd like to fish from",
      required: false,
      choices: [
        {
          name: "Plain Pond",
          value: "plain",
        },
        {
          name: "Underground Pond",
          value: "underground",
        },
        {
          name: "Underworld Pond",
          value: "underworld",
        },
        {
          name: "Sky Pond",
          value: "sky",
        },
        {
          name: "Ancient Pond",
          value: "ancient",
        },
        {
          name: "Void Pond",
          value: "void",
        },
      ],
    },
  ],
  async execute(interaction) {
    let user = await coin.checkInteraction(interaction);

    let pond;

    if (interaction.options.get("pond")) {
      pond = interaction.options.get("pond").value
    } else {
      pond = "plain"
    }
  
    console.log(pond)
  
    // catchFish(message, args, PONDS[primaryArg]);
  },
};