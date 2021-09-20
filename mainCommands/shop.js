const shop = require("../helpers/shopHelper");
const coin = require("../helpers/coinHelper");

module.exports = {
  name: "shop",
  description: "view or purchase items from the shop",
  options: [
    {
      type: "STRING",
      name: "option",
      description: "what you'd like to do in the shop",
      required: true,
      choices: [
        {
          name: "List Items",
          value: "list",
        },
        {
          name: "Buy Items",
          value: "buy",
        },
      ],
    },
  ],
  async execute(interaction) {
    let user = await coin.checkInteraction(interaction);
  },
};
