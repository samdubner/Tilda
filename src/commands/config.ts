import guildHelper from "../helpers/guildHelper";

module.exports = {
  name: "config",
  description: "set up basic config for tilda to get started!",
  options: [
    {
      type: "SUB_COMMAND",
      name: "channel",
      description:
        "configure the channel you would like to restrict Tilda's commands to",
      options: [
        {
          type: "CHANNEL",
          name: "channel",
          description: "the channel you would like to use",
          required: true,
        },
      ],
    },
  ],
  async execute(interaction) {
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      interaction.reply({
        content:
          "Sorry, this command can only be run by people with the ADMINISTRATOR permission",
        ephemeral: true,
      });
      return;
    }

    let subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "channel":
        changeCommandChannel(interaction);
        break;
      default:
        console.log("subcommand not found in config.js");       return;
    }
  },
};

let changeCommandChannel = async (interaction) => {
  let channel = interaction.options.getChannel("channel");
  await guildHelper.setGuildChannel(channel);

  interaction.reply({
    content: `This guild's bot channel was updated to #${channel.name}`,
    ephemeral: true,
  });
};
