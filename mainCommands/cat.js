const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "cat",
  description: "get a random image of a cat",
  async execute(interaction) {
    await interaction.deferReply();

    let response = await fetch("https://api.thecatapi.com/v1/images/search");
    let data = await response.json();
    let cat = data[0].url;

    let embed = new MessageEmbed()
      .setTitle("Random Cat")
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setImage(cat);

    interaction.editReply({ embeds: [embed] }).catch(console.error);
  },
};
