const axios = require("axios")
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "cat",
  description: "get a random image of a cat",
  async execute(interaction) {
    await interaction.deferReply();

    let response = await axios("https://api.thecatapi.com/v1/images/search")
    let cat = response.data[0].url;

    let embed = new MessageEmbed()
      .setTitle("Random Cat")
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setImage(cat);

    interaction.guild.members.fetch("340002869912666114")
      .then((member) => console.log(member))
      .catch((e) => console.log(e))

    interaction.editReply({ embeds: [embed] }).catch(console.error);
  },
};