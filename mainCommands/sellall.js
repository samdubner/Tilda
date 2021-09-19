const fishHelper = require("../helpers/fishHelper");
const coin = require("../helpers/coinHelper");

module.exports = {
  name: "sellall",
  description: "sell all of your fish",
  async execute(interaction) {
    let user = await coin.checkInteraction(interaction);

    let result = user.fish

    fishHelper.sellFishCheck(interaction, user, result);
  },
};
