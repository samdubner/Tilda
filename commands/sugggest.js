const MessageEmbed = require("discord.js").MessageEmbed;

module.exports = {
  name: "suggest",
  description: "suggest new ideas for me to add to Tilda",
  options: [
    {
      type: "STRING",
      name: "suggestion",
      description: "the suggestion you would like to give for Tilda",
      required: true,
    },
  ],
  async execute(interaction) {
    let suggestion = interaction.options.get("suggestion").value
    console.log(
      `[SUGGESTION] ${interaction.user.username}#${interaction.user.discriminator} => ${suggestion}`
    );
  
    let embed = new MessageEmbed()
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTitle("Bot Feature Suggestion Sent")
      .addField("Request", suggestion, false)
      .setThumbnail(interaction.user.displayAvatarURL())
  
    interaction.reply({embeds: [embed]});
  },
};