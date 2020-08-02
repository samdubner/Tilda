const MessageEmbed = require("discord.js").MessageEmbed;

let help = (message) => {
  let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  let embed = new MessageEmbed()
    .setColor(color)
    .setTitle(`Help`)
    .setThumbnail(message.guild.iconURL())
    .addField("1️⃣", "Basic Commands", true)
    .addField("2️⃣", "Info Commands", true)
    .addField("3️⃣", "Coin Commands", true);

  message.channel.send(embed).then((helpMessage) => {
    helpMessage.react("1️⃣");
    helpMessage.react("2️⃣");
    helpMessage.react("3️⃣");

    let filter = (reaction, user) => message.author.id == user.id;
    helpMessage
      .awaitReactions(filter, { max: 1 })
      .then((collection) => {
        collection.each((collected) => {
          switch (collected.emoji.name) {
            case "1️⃣":
              editEmbed(helpMessage, message, "one", color);
              break;
            case "2️⃣":
              editEmbed(helpMessage, message, "two", color);
              break;
            case "3️⃣":
              editEmbed(helpMessage, message, "three", color);
              break;
            default:
              message.reply(
                "Please use ~help again and react with a valid emoji!"
              );
              return;
          }
        });
      })
      .catch(console.error);
  });

  let editEmbed = (helpEmbed, message, num, color) => {
    helpEmbed.reactions.removeAll();

    let embed = new MessageEmbed()
      .setColor(color)
      .setTitle("Help")
      .setThumbnail(message.guild.iconURL());

    switch (num) {
      case "one":
        embed
          .setDescription("Basic Commands")
          .addField(
            "~suggest [message]",
            `Sends <@340002869912666114> a message with your idea to improve Tilda`,
            false
          )
          .addField(
            "~8ball [question]",
            `Ask the all powerful 8ball your questions`,
            false
          );
        break;
      case "two":
        embed
          .setDescription("Info Commands")
          .addField(
            "~suggest [message]",
            `Sends <@340002869912666114> a message with your idea to improve Tilda`,
            false
          )
          .addField(
            "~8ball [question]",
            `Ask the all powerful 8ball your questions`,
            false
          );
        break;
      case "three":
        embed
          .setDescription("Coin Commands")
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
          );
        break;
    }

    helpEmbed.edit(embed);
  };
};

module.exports.help = help;
