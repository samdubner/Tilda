const MessageEmbed = require("discord.js").MessageEmbed;

module.exports = {
  name: "help",
  description: "helpful command to show you all of Tilda's features",
  options: [{
    type: "STRING",
    name: "menu",
    description: "select which group of commands you would like help with",
    required: true,
    choices: [
      {
        name: "Basic Commands",
        value: "basic"
      },
      {
        name: "Room Commands",
        value: "room"
      },
      {
        name: "Coin Commands",
        value: "coin"
      },
      {
        name: "Role Commands",
        value: "role"
      },
      {
        name: "Shop Commands",
        value: "shop"
      },
      {
        name: "Fish Commands",
        value: "fish"
      },
    ]
  }],
  async execute(interaction) {
    let menuOption = interaction.options.get("menu").value;

    let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(`Help`)
    .setThumbnail(interaction.guild.iconURL())

    switch(menuOption) {
      case "basic":
        embed.setDescription("Basic Commands").addFields(
          {
            name: "request [message]",
            value:
              "Sends <@340002869912666114> a message with your idea to improve Tilda",
          },
          {
            name: "8ball [question]",
            value: "Ask the all powerful 8ball your questions",
          },
          {
            name: "ui <@person>",
            value:
              "Sends some basic info about the mentioned person",
          },
          { name: "si", value: "Sends basic server information" },
          {
            name: "pfp <@person>",
            value:
              "Sends the profile pictures of the mentioned people or yourself if nobody is mentioned",
          },
          {
            name: "roll <number of sides>",
            value:
              "Will roll a x number sided die (default: 6)",
          }
        );
        break;
      case "room":
        embed.setDescription("Room Commands").addFields(
          { name: "room start", value: "Create your own category and channels! [rooms are now limited to 1 per person]" },
          {
            name: "room end",
            value: "Removes the category and channels within",
          },
          {
            name: "room private",
            value: "Changes the room to only be visible to you and whoever you add",
          },
          {
            name: "room public",
            value: "Changes the room to only be visible to everyone",
          },
          {
            name: "room add @user",
            value: "Add other users to your private room",
          },
          {
            name: "room remove @user",
            value: "Remove users from your private room",
          }
        );
        break;
      case "coin":
        embed.setDescription("Coin Commands").addFields(
          {
            name: "leaderboard",
            value: "Get the top coin scores of everyone in the server!",
          },
          { name: "balance", value: "View the amount of coins you have" },
          { name: "flip [amount of coins]", value: "50/50" },
          { name: "daily", value: "Get 100 coins once every 24 hours (do it every day for a bonus!)" },
          { name: "beg", value: "Get 10 coins every 10 minutes" },
          {
            name: "leaderboard",
            value: "Get the top coin scores of everyone in the server!",
          },
          {
            name: "give [amount of coins] <@person>",
            value: "Give `x` amount of coins to mentioned person",
          },
          {
            name: "challenge [entry price] <@people>",
            value: "Challenge mentioned users to a quick math game!",
          }
        );
        break;
      case "role":
        embed.setDescription("Role Commands").addFields(
          {
            name: "role",
            value: "creates your custom role and displays info",
          },
          {
            name: "role name [custom name]",
            value: "change your role's name",
          },
          {
            name: "role color [hex code]",
            value: "change your role's color `EX: ~role color #FF0000`",
          }
        );
        break;
      case "shop":
        embed.setDescription("Shop Commands").addFields(
          {
            name: "shop",
            value: "View all items available for you to purchase in the shop!",
          },
          {
            name: "shop buy",
            value: "open menu to purchase an item from the shop",
          }
        );
        break;
      case "fish":
        embed.setDescription("Fish Commands").addFields(
          {
            name: "catch [pond name]",
            value: "Catch a fish! (will default to plain pond)",
          },
          { name: "fish inv", value: "See all the fish you've caught" },
          {
            name: "fish sell [type of fish] [size of fish]",
            value: "sells the specific fish of that type and size",
          },
          {
            name: "fish sell [rarity]",
            value: "sells all the fish of that rarity",
          },
          {
            name: "fish log",
            value: "shows you all the types of fish you've caught!",
          }
        );
    }

    interaction.reply({embeds: [embed], ephemeral: true})
  },
};