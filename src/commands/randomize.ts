import clientHelper from "../helpers/clientHelper";

module.exports = {
  name: "randomize",
  description: "Command to randomize server name/color [ADMIN ONLY]",
  options: [
    {
      type: "SUB_COMMAND",
      name: "name",
      description: "randomize the name of the server",
    },
    {
      type: "SUB_COMMAND",
      name: "color",
      description: "randomize the color of the server",
    },
  ],
  async execute(interaction) {
    if (interaction.user.id != "340002869912666114") {
      interaction.reply({
        content: "Sorry, only the bot owner can run this command",
        ephemeral: true,
      });
      return;
    }

    let sub = interaction.options.getSubcommand();

    switch (sub) {
      case "name":
        clientHelper.randomizeServerName(interaction.client);
        interaction.reply({ content: "Randomized server name", ephemeral: true });
        break;
      case "color":
        clientHelper.randomizeRoleColor(interaction.client);
        interaction.reply({content: "Randomized server color", ephemeral: true})
        break;
      default:
        interaction.reply({ content: "Improper Subcommand", ephemeral: true });
    }
  },
};
