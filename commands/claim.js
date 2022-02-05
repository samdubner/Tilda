const helper = require("../helpers/coinHelper");

module.exports = {
  name: "claim",
  description: "Be the first one to claim the coin event!",
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    let user = await helper.checkInteraction(interaction);
    let result = await helper.claim(interaction, user);

    if (result) {
      interaction.editReply({
        content: "You won the coin event!",
        ephemeral: true,
      });
    }
  },
};
