const fishHelper = require("../helpers/fishHelper");
const coin = require("../helpers/coinHelper");

module.exports = {
  name: "sellfish",
  description: "sell fish of a specific type",
  options: [
    {
      type: "STRING",
      name: "name",
      description: "the type of fish you'd like to sell",
      required: true,
    },
    {
      type: "INTEGER",
      name: "length",
      description: "the length of the fish you'd like to sell",
      required: false,
    },
  ],
  async execute(interaction) {
    let user = await coin.checkInteraction(interaction);

    let result;

    let fishName = interaction.options.get("name").value.toLowerCase();

    if (interaction.options.get("length")) {
      let fishLength = interaction.options.get("length").value;
      result = user.fish.filter(
        (fish) => fish.name == fishName && fish.size == fishLength
      );
    } else {
      result = user.fish.filter((fish) => fish.name == fishName);
    }

    fishHelper.sellFishCheck(interaction, user, result);
  },
};
