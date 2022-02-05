const fishHelper = require("../helpers/fishHelper");
const coin = require("../helpers/coinHelper");

module.exports = {
  name: "sell",
  description: "command to sell your fish",
  options: [
    {
      name: "all",
      type: "SUB_COMMAND",
      description: "sell all of your fish",
    },
    {
      name: "rarity",
      type: "SUB_COMMAND",
      description: "sell all fish of a specific rarity",
      options: [
        {
          name: "rarity",
          type: "STRING",
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
    },
    {
      name: "fish",
      type: "SUB_COMMAND",
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
    },
  ],
  async execute(interaction) {
    let user = await coin.checkInteraction(interaction);

    let subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "all":
        sellAll(interaction, user);
        break;
      case "rarity":
        sellRarity(interaction, user);
        break;
      case "fish":
        sellFish(interaction, user);
        break;
    }
  },
};

const sellAll = (interaction, user) => {
  let result = user.fish;

  fishHelper.sellFishCheck(interaction, user, result);
};

const sellRarity = (interaction, user) => {
  let rarity = interaction.options.get("rarity").value;

  let result = user.fish.filter((fish) => fish.rarity == rarity);

  fishHelper.sellFishCheck(interaction, user, result);
};

const sellFish = (interaction, user) => {
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
};
