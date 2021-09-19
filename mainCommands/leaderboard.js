const MessageEmbed = require("discord.js").MessageEmbed;

const User = require("../models/User");

module.exports = {
  name: "leaderboard",
  description: "Shows the coins of the top 5 users in the server!",
  async execute(interaction) {
    let userList = await User.find()
      .sort([["score", -1]])
      .limit(10);

    userList = await removeNotInGuild(userList, interaction);
    userList = userList.slice(0, 5);

    let embed = new MessageEmbed()
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTitle("Coin Leaderboard")
      .setThumbnail("https://i.imgur.com/hPCYkuG.gif");

    let i = 1;
    for (let user of userList) {
      if (user.score == userList[0].score) {
        let guildMember = await interaction.guild.members.fetch(user.userId);
        embed.addField(
          `${1}) ${guildMember.user.username}`,
          ` 🎉 ${user.score} 🎉`,
          false
        );
      } else {
        let guildMember = await interaction.guild.members.fetch(user.userId);
        embed.addField(
          `${i}) ${guildMember.user.username}`,
          `${user.score}`,
          false
        );
      }
      i++;
    }

    interaction.reply({ embeds: [embed] }).catch(console.error);
  },
};

removeNotInGuild = async (userList, interaction) => {
  let newList = [];

  for (let user of userList) {
    guildMember = await interaction.guild.members.fetch(user.userId);

    if (guildMember) newList.push(user);
  }

  return newList;
};
