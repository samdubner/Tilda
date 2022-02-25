import shopHelper from "../helpers/shopHelper";

module.exports = {
  name: "shop",
  description: "view or purchase items from the shop",
  options: [
    {
      name: "list",
      type: "SUB_COMMAND",
      description: "view items in the shop",
    },
    {
      name: "buy",
      type: "SUB_COMMAND",
      description: "options to buy from the shop",
      options: [
        {
          name: "item",
          type: "STRING",
          description: "the item you'd like to buy from the shop",
          required: true,
          choices: [
            {
              name: "Plain Fishing Rod",
              value: "Plain Fishing Rod",
            }
          ],
        },
      ],
    },
  ],
  async execute(interaction) {
    let options = interaction.options.getSubcommand();

    switch (options) {
      case "list":
        shopHelper.displayShop(interaction);
        break;
      case "buy":
        let item = interaction.options.get("item").value;
        shopHelper.handlePurchase(interaction, item);
    }
  },
};
