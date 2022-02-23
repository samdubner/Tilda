// const MessageEmbed = require("discord.js").MessageEmbed;

module.exports = {
  name: "pfp",
  description: "Sends the profile picture of the mentioned person",
  options: [
    {
      type: "USER",
      name: "person",
      description:
        "the person whose profile picture you'd like to receive, can be yourself",
      required: true,
    },
  ],
  async execute(interaction) {
    let mentionedUser = interaction.options.get("person").user;

    let embed = new MessageEmbed()
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTitle(`${mentionedUser.username}'s pfp`)
      .setImage(mentionedUser.displayAvatarURL());

    interaction.reply({ embeds: [embed], ephemeral: true }).catch(console.error);
  },
};
