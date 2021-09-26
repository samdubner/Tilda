const helper = require("../helpers/coinHelper");

module.exports = {
  name: "claim",
  description: "Be the first one to claim the coin event!",
  async execute(interaction) {
    let user = await helper.checkInteraction(interaction);
    let result = await helper.claim(interaction, user);

    if (result) {
      interaction.reply({
        content: "You won the coin event!",
        ephemeral: true,
      });
    }
  },
};
