import fishHelper from "../helpers/fishHelper";

module.exports = {
  name: "inventory",
  description: "see all the fish you've caught",
  options: [
    {
      type: "STRING",
      name: "rarity",
      description: "the rarity of the fish you'd like to see",
      required: true,
      choices: [
        {
          name: "Common",
          value: "common",
        },
        {
          name: "Uncommon",
          value: "uncommon",
        },
        {
          name: "Rare",
          value: "rare",
        },
        {
          name: "Legendary",
          value: "legendary",
        },
        {
          name: "Mythical",
          value: "mythical",
        },
      ],
    },
  ],
  async execute(interaction) {
    let fishOption = interaction.options.get("rarity").value;

    fishHelper.displayFish(interaction, fishOption);
  },
};
