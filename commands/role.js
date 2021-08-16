const MessageEmbed = require("discord.js").MessageEmbed;

const coin = require("../helpers/coinHelper.js");
const User = require("../models/User");
const Role = require("../models/Role");

module.exports = {
  name: "role",
  description: "a command to change your custom role's name and color",
  options: [{
    type: "STRING",
    name: "aspect",
    description: "select what you would like to change about your role",
    required: false,
    choices: [
      {
        name: "Role Name",
        value: "name"
      },
      {
        name: "Role Color",
        value: "color"
      },
    ]
  }],
  async execute(interaction) {
    switch (interaction.options.get("aspect").value) {
      case "name":
        updateRole("name", data, customRole, message);
        break;
      case "color":
        updateRole("color", data, customRole, message);
        break;
      default:
        let embed = new MessageEmbed()
          .setColor(customRole.hexColor)
          .setTitle(`${message.author.username}'s Custom Role`)
          .setThumbnail(message.author.displayAvatarURL())
          .addField(
            "Role Details",
            `Your role currently has a color of \`${customRole.hexColor}\` and name of \`${customRole.name}\``,
            false
          )
          .setFooter(
            "Don't forget to check out ~help",
            message.client.user.displayAvatarURL()
          );
  
        message.channel.send(embed);
    }
  },
};