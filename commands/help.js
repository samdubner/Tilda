const MessageEmbed = require('discord.js').MessageEmbed

let help = (message) => {
  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(`Help`)
    .setThumbnail(message.guild.iconURL())
    .addField(
      "~suggest [message]",
      `Sends <@340002869912666114> a message with your idea to improve Tilda`,
      false
    )
    .addField(
      "~pfp <@person>",
      `Gets the pfp of mentioned users, can work with multiple mentions`,
      false
    )
    .addField("~ui <@person>", `Gets user info of mentioned users`, false)
    .addField("~si", `Get basic server information`, false)
    .addField(
      "~8ball [question]",
      `Ask the all powerful 8ball your questions`,
      false
    )
    .addField(
      "~leaderboard",
      `Get the top coin scores of everyone in the server!`,
      false
    )
    .addField("~balance", `View the amount of coins you have`, false)
    .addField("~flip [amount of coins]", `50/50`, false)
    .addField("~daily", `Get 100 coins once every 24 hours`, false)
    .addField("~beg", `Get 10 coins every 10 minutes`, false)
    .addField(
      "~give [amount of coins] <@person>",
      `Give \`x\` amount of coins to mentioned person`,
      false
    )
    .addField("~help", `How did you end up here?!?!`, false)
    .setTimestamp();

  message.channel.send(embed);
};

module.exports.help = help;
