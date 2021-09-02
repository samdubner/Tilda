const MessageEmbed = require("discord.js").MessageEmbed;

const room = require("../helpers/roomHelper")

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
    let options = interaction.options.get("option").value;

    switch(options) {
      case "start":
        room.createCategory(interaction)
        break;
      case "end":
        break;
      case "private":
        break;
      case "public":
        break;
      }

		interaction.reply('Under Construction!');
	},
};