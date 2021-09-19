const fishHelper = require("../helpers/fishHelper");
const coin = require("../helpers/coinHelper");

module.exports = {
  name: "sellrarity",
  description: "sell all fish of a specific rarity",
  options: [
    {
      type: "STRING",
      name: "rarity",
      description: "the rarity of fish you'd like to sell",
      required: true,
      choices: [
        {
          name: "Common Fish",
          value: "common",
        },
        {
          name: "Uncommon Fish",
          value: "uncommon",
        },
        {
          name: "Rare Fish",
          value: "rare",
        },
        {
          name: "Legendary Fish",
          value: "legendary",
        },
      ],
    },
  ],
  async execute(interaction) {
    let rarity = interaction.options.get("rarity").value;

    let user = await coin.checkInteraction(interaction);

    let result = user.fish.filter((fish) => fish.rarity == rarity);

    fishHelper.sellFishCheck(interaction, user, result);
  },
};
