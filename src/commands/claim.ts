import coinHelper from "../helpers/coinHelper";

module.exports = {
  name: "claim",
  description: "Be the first one to claim the coin event!",
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    let user = await coinHelper.checkInteraction(interaction);
    let result = await coinHelper.claim(interaction, user);

    if (result) {
      interaction.editReply({
        content: "You won the coin event!",
        ephemeral: true,
      });
    }
  },
};
