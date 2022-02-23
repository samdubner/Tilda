const voice = require("../helpers/voiceHelper");

// const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "skip",
  description: "skip the song currently playing",
  async execute(interaction) {
    let result = voice.playNextOrLeave(true, interaction);

    if (result) {
      let embed = new MessageEmbed()
        .setAuthor({
          name: `Skipped Song`,
          iconURL: interaction.user.avatarURL(),
        })
        .setColor(`#d1580d`)
        .setThumbnail(interaction.guild.iconURL())
        .setTitle("Skipping Current Song....");

      interaction.reply({ embeds: [embed] });
    }
  },
};
