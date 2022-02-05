const MessageEmbed = require("discord.js").MessageEmbed;

module.exports = {
  name: "roll",
  description: "Will roll a x number sided die (default: 6)",
  options: [
    {
      type: "INTEGER",
      name: "sides",
      description: "the max number of sides you want the die to have",
      required: false,
    },
  ],
  async execute(interaction) {
    numSides = interaction.options.get("sides")
      ? interaction.options.get("sides").value
      : 6;

    randomResult = Math.floor(Math.random() * numSides) + 1;
    let embed = new MessageEmbed()
      .setAuthor({ name: `Roll`, iconURL: interaction.user.avatarURL() })
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .addField(
        `You rolled a ${numSides} sided die`,
        `You got a ${randomResult}`
      );

    interaction.reply({ embeds: [embed] }).catch(console.error);
  },
};
