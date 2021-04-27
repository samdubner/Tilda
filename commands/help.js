const MessageEmbed = require("discord.js").MessageEmbed;

const help = (message, helpEmbed) => {
  let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  let embed = new MessageEmbed()
    .setColor(color)
    .setTitle(`Help`)
    .setThumbnail(message.guild.iconURL())
    .addField("1️⃣", "Basic Commands", true)
    .addField("2️⃣", "Channel Commands", true)
    .addField("3️⃣", "Coin Commands", true)
    .addField("4️⃣", "Role Commands", true)
    .addField("5️⃣", "Shop Commands", true)
    .addField("6️⃣", "Fish Commands", true);

  if (helpEmbed == undefined) {
    message.channel
      .send(embed)
      .then((helpMessage) => createReactionHandler(helpMessage, message, color))
      .catch(console.error);
  } else {
    helpEmbed.reactions.removeAll();
    helpEmbed
      .edit(embed)
      .then((helpMessage) => createReactionHandler(helpMessage, message, color))
      .catch(console.error);
  }
};

let createReactionHandler = (helpMessage, message, color) => {
  helpMessage.react("1️⃣");
  helpMessage.react("2️⃣");
  helpMessage.react("3️⃣");
  helpMessage.react("4️⃣");
  helpMessage.react("5️⃣");
  helpMessage.react("6️⃣");

  let filter = (reaction, user) => message.author.id == user.id;
  helpMessage
    .awaitReactions(filter, { max: 1 })
    .then((collection) => {
      collection.each((collected) => {
        if (
          !["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"].includes(collected.emoji.name)
        ) {
          message.reply("Please use ~help again and react with a valid emoji!");
          return;
        }

        editEmbed(helpMessage, message, collected.emoji.name, color);
      });
    })
    .catch(console.error);
};

let editEmbed = (helpEmbed, message, num, color) => {
  helpEmbed.reactions.removeAll();

  let embed = new MessageEmbed()
    .setColor(color)
    .setTitle("Help")
    .setThumbnail(message.guild.iconURL());

  switch (num) {
    case "1️⃣":
      embed.setDescription("Basic Commands").addFields(
        {
          name: "~request [message]",
          value:
            "Sends <@340002869912666114> a message with your idea to improve Tilda",
        },
        {
          name: "~8ball [question]",
          value: "Ask the all powerful 8ball your questions",
        },
        {
          name: "~ui <@people>",
          value:
            "Sends some basic info about the mentioned peopple or yourself if nobody is mentioned",
        },
        { name: "~si", value: "Sends basic server information" },
        {
          name: "~pfp <@people>",
          value:
            "Sends the profile pictures of the mentioned people or yourself if nobody is mentioned",
        }
      );
      break;
    case "2️⃣":
      embed
        .setDescription("Room Commands")
        .addFields(
          { name: "~room start", value: "Create your own category!" },
          { name: "~room end", value: "Removes the category and channels within" },
          { name: "~room private", value: "Changes the room to only be visible to you!" },
          { name: "~room add @user", value: "Add other users to your private room" },
          { name: "~room remove @user", value: "Remove users from your private room" }
        );
      break;
    case "3️⃣":
      embed.setDescription("Coin Commands").addFields(
        {
          name: "~leaderboard",
          value: "Get the top coin scores of everyone in the server!",
        },
        { name: "~balance", value: "View the amount of coins you have" },
        { name: "~flip [amount of coins]", value: "50/50" },
        { name: "~daily", value: "Get 100 coins once every 24 hours" },
        { name: "~beg", value: "Get 10 coins every 10 minutes" },
        {
          name: "~leaderboard",
          value: "Get the top coin scores of everyone in the server!",
        },
        {
          name: "~give [amount of coins] <@person>",
          value: "Give `x` amount of coins to mentioned person",
        },
        {
          name: "~challenge [entry price] <@people>",
          value: "Challenge mentioned users to a quick math game!",
        }
      );
      break;
    case "4️⃣":
      embed.setDescription("Role Commands").addFields(
        {
          name: "~role",
          value: "creates your custom role and displays info",
        },
        {
          name: "~role name [custom name]",
          value: "change your role's name",
        },
        {
          name: "~role color [hex code]",
          value: "change your role's color `EX: ~role color #FF0000`",
        }
      );
      break;
    case "5️⃣":
      embed.setDescription("Shop Commands").addFields(
        {
          name: "~shop",
          value: "View all items available for you to purchase in the shop!",
        },
        {
          name: "~shop buy",
          value: "open menu to purchase an item from the shop",
        }
      );
      break;
    case "6️⃣":
      embed.setDescription("Fish Commands").addFields(
        {
          name: "~catch [pond name]",
          value: "Catch a fish! (will default to plain pond)",
        },
        { name: "~fish inv", value: "See all the fish you've caught" },
        {
          name: "~fish sell [type of fish] [size of fish]",
          value: "sells the specific fish of that type and size",
        },
        {
          name: "~fish sell [rarity]",
          value: "sells all the fish of that rarity",
        }
      );
      break;
  }

  helpEmbed.edit(embed).then((helpMessage) => {
    helpMessage.react("◀️");

    let filter = (reaction, user) => message.author.id == user.id;
    helpMessage
      .awaitReactions(filter, { max: 1 })
      .then(() => help(message, helpEmbed))
      .catch(console.error);
  });
};

module.exports = { help };
