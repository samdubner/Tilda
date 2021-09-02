const MessageEmbed = require("discord.js").MessageEmbed;

module.exports = {
  name: "room",
  description: "commands to create/manage your private category",
  options: [{
    type: "STRING",
    name: "option",
    description: "select what you'd like to do with your category",
    required: true,
    choices: [
      {
        name: "Start Room",
        value: "start"
      },
      {
        name: "End Room",
        value: "end"
      },
      {
        name: "Set Private",
        value: "private"
      },
      {
        name: "Set Public",
        value: "public"
      }
    ]
  }],
  async execute(interaction) {
		await interaction.reply('Pong!');
	},
};