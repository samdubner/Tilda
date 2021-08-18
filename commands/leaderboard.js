const MessageEmbed = require("discord.js").MessageEmbed;

const User = require("../models/User");

module.exports = {
  name: "leaderboard",
  description: "Shows the coins of the top 5 users in the server!",
  async execute(interaction) {
    let userList = await User.find()
      .sort([["score", -1]])
      .limit(10);

    // try {
    //   let members = await interaction.guild.members.fetch();
    // } catch(e) {
    //   console.error(e)
    // }
    await removeNotInGuild(userList, interaction)
    interaction.reply("testing");

    // userList = userList.filter(
    //   (user) => interaction.guild.members.fetch(user.userId) != undefined
    // );
    // userList = userList.slice(0, 5);

    // let embed = new MessageEmbed()
    //   .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    //   .setTitle("Coin Leaderboard")
    //   .setThumbnail("https://i.imgur.com/hPCYkuG.gif");

    // let i = 1;
    // for (let user of userList) {
    //   if (user.score == userList[0].score) {
    //     // if (members.get(user.userId) != undefined) {
    //       embed.addField(
    //         `${1}) ${await interaction.guild.fetch(user.userId).user.username}`,
    //         ` 🎉 ${user.score} 🎉`,
    //         false
    //       );
    //     // }
    //   } else {
    //     // if (members.get(user.userId) != undefined) {
    //       embed.addField(
    //         `${i}) ${members.get(user.userId).user.username}`,
    //         user.score,
    //         false
    //       );
    //     // }
    //   }
    //   i++;
    // }
    // interaction.reply({embeds: [embed]}).catch(console.error);
  },
};

removeNotInGuild = async (userList, interaction) => {
  // let newList = [];

  // for (let user of userList) {
  //   user = await interaction.guild.members.resolve(user.id)
  //   console.log(user)
  // }

  // return newList;
}
