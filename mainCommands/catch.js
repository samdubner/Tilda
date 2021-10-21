const catchHelper = require("../helpers/catchHelper");
const coin = require("../helpers/coinHelper");

module.exports = {
  name: "catch",
  description: "catch some fish using your coins!",
  async execute(interaction) {
    let user = await coin.checkInteraction(interaction);

    catchHelper.catchFish(interaction, user);
  },
};
