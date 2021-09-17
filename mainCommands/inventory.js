const fishHelper = require("../helpers/fishHelper")

module.exports = {
  name: "inventory",
  description: "see all the fish you've caught",
  options: [
    {
      type: "STRING",
      name: "pond",
      description: "the pond of fish you'd like to see",
      required: true,
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
    let fishOption = interaction.options.get("pond").value;

    fishHelper.displayFish(interaction, fishOption);
  },
};
