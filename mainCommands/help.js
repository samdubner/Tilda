const MessageEmbed = require("discord.js").MessageEmbed;

module.exports = {
  name: "help",
  description: "helpful command to show you all of Tilda's features",
  options: [
    {
      type: "STRING",
      name: "menu",
      description: "select which group of commands you would like help with",
      required: true,
      choices: [
        {
          name: "Basic Commands",
          value: "basic",
        },
        {
          name: "Room Commands",
          value: "room",
        },
        {
          name: "Coin Commands",
          value: "coin",
        },
        {
          name: "Role Commands",
          value: "role",
        },
        {
          name: "Shop Commands",
          value: "shop",
        },
        {
          name: "Fish Commands",
          value: "fish",
        },
      ],
    },
  ],
  async execute(interaction) {
    let menuOption = interaction.options.get("menu").value;

    let embed = new MessageEmbed()
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTitle(`Help`)
      .setThumbnail(interaction.guild.iconURL());

    switch (menuOption) {
      case "basic":
        embed.setDescription("Basic Commands").addFields(
          {
            name: "/request [message]",
            value:
              "Sends <@340002869912666114> a message with your idea to improve Tilda",
          },
          {
            name: "/8ball [question]",
            value: "Ask the all powerful 8ball your questions",
          },
          {
            name: "/ui <@person>",
            value: "Sends some basic info about the mentioned person",
          },
          { name: "/si", value: "Sends basic server information" },
          {
            name: "/pfp <@person>",
            value:
              "Sends the profile pictures of the mentioned people or yourself if nobody is mentioned",
          },
          {
            name: "/roll <number of sides>",
            value: "Will roll a x number sided die (default: 6)",
          },
          {
            name: "/pingme",
            value: "add/remove a role to be pinged for announcements",
          }
        );
        break;
      case "room":
        embed.setDescription("Room Commands").addFields(
          {
            name: "/room",
            value:
              "General command to start/end your room as well as manage it's privacy",
          },
          {
            name: "/add @user",
            value: "Add other users to your private room",
          },
          {
            name: "/remove @user",
            value: "Remove users from your private room",
          }
        );
        break;
      case "coin":
        embed.setDescription("Coin Commands").addFields(
          {
            name: "/leaderboard",
            value: "Shows the coins of the top 5 users in the server!",
          },
          { name: "/balance", value: "View the amount of coins you have" },
          { name: "/flip [amount of coins]", value: "50/50" },
          {
            name: "/daily",
            value:
              "Get 100 coins once every 24 hours (do it every day for a bonus)!",
          },
          { name: "/beg", value: "Receive 10 coins every 10 minutes!" },
          {
            name: "/give @person [coins]",
            value: "Sends some coins to a thankful person!",
          }
        );
        break;
      case "role":
        embed.setDescription("Role Commands").addFields(
          {
            name: "/role",
            value: "creates your custom role and displays info",
          },
          {
            name: "/role name [custom name]",
            value: "change your role's name",
          },
          {
            name: "/role color [hex code]",
            value: "change your role's color `EX: ~role color #FF0000`",
          }
        );
        break;
      case "fish":
        embed.setDescription("Fish Commands").addFields(
          {
            name: "/catch [pond name]",
            value: "Catch a fish! (will default to plain pond)",
          },
          {
            name: "/inventory [pond name]",
            value: "See all the fish you've caught",
          },
          {
            name: "/logbook",
            value: "shows you all the types of fish you've caught!",
          },
          {
            name: "/view [fish name]",
            value: "view all your fish of a specific species",
          },
          {
            name: "/sellfish [type of fish] [size of fish]",
            value: "sells the specific fish of that type and size",
          },
          {
            name: "/sellrarity [rarity]",
            value: "sells all the fish of that rarity",
          },
          {
            name: "/sellall",
            value: "sells all of your fish",
          }
        );
        break;
      case "shop":
        embed.setDescription("Shop Commands").addFields(
          {
            name: "/shop list",
            value: "View all items available for you to purchase in the shop!",
          },
          {
            name: "/shop buy <item name>",
            value: "Purchase an item from the shop",
          }
        );
    }

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
