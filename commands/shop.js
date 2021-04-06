const MessageEmbed = require("discord.js").MessageEmbed;

const coin = require("./coin");
const User = require("../models/User");
const Item = require("../models/Item");

// const ITEMS = {
//   "Plain Fishing Rod": new Item({
//     name: "Plain Fishing Rod",
//     price: "1000",
//     icon: "💦"
//   }),
// };

// const seedItems = async () => {
//     ITEMS['Plain Fishing Rod'].save()
// }

const shopManager = async (message, args) => {
  let primaryArg = args.split(" ")[0];
  switch (primaryArg) {
    case "":
    case "list":
      displayShop(message);
      return;
      break;
    case "buy":
      purchaseShop(message);
      break;
    default:
      console.log("not a valid arg");
      displayShop(message);
      return;
  }
};

const displayShop = async (message) => {
  let shopItems = await Item.find();

  const ShopEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Tilda's Shop")
    .setThumbnail(message.guild.iconURL())
    .setDescription("Here are all the items available for sale!")
    .setTimestamp();

  for (let item of shopItems) {
    ShopEmbed.addField(item.name, `${item.price} coins`, true);
  }

  message.channel.send(ShopEmbed).catch(console.error);
};

const purchaseShop = async (message) => {
  let user = await User.findOne({ userId: message.author.id });

  if (!user) {
    user = await coin.createUser(message);
  }

  let shopItems = await Item.find();

  shopItems = shopItems.filter((item) => !user.items.includes(item._id));

  const ShopEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Tilda's Shop")
    .setThumbnail(message.guild.iconURL())
    .setTimestamp();

  if (!shopItems.length) {
    ShopEmbed.setDescription("There are no items for you to buy!");
  } else {
    for (let item of shopItems) {
      ShopEmbed.setDescription(
        "Click the reaction of the item you'd like to buy!"
      );
      ShopEmbed.addField(
        `${item.icon}  ${item.name}`,
        `${item.price} coins`,
        true
      );
    }
  }

  message.channel
    .send(ShopEmbed)
    .then((messageEmbed) =>
      awaitPurchase(message, messageEmbed, shopItems, user)
    )
    .catch(console.error);
};

const awaitPurchase = async (message, embed, shopItems, user) => {
  for (let item of shopItems) {
    await embed.react(item.icon);
  }

  const filter = (reaction, user) => user.id == message.author.id;
  embed
    .awaitReactions(filter, { max: 1, time: 30000 })
    .then((collected) => handlePurchase(message, user, collected))
    .catch(console.error);
};

const handlePurchase = (message, user, collected) => {
  collected.each(async (reaction) => {
    reaction.message.reactions.removeAll().catch(console.error)
    let selectedItem = await Item.findOne({ icon: reaction.emoji.name });

    if (!selectedItem) {
      failedPurchase(reaction.message);
      return;
    }

    if (user.score >= selectedItem.price) {
      user.items.push(selectedItem._id);
      user.score -= selectedItem.price;
    } else {
      insufficientCoins(reaction.message);
      return;
    }

    user
      .save()
      .then(() => successfulPurchase(reaction.message, user, selectedItem))
      .catch(console.error);
  });
};

const insufficientCoins = (message) => {
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setTitle("You don't have enough coins to buy that item!")

  message.edit(embed);
};

const successfulPurchase = async (message, user, selectedItem) => {
  let guildMember = await message.guild.members.fetch(user.userId);
  const ShopEmbed = new MessageEmbed()
    .setColor(`#00ff00`)
    .setTitle("Tilda's Shop")
    .setThumbnail(message.guild.iconURL())
    .setDescription(
      `${guildMember.displayName} purchased a \`${selectedItem.name}\``
    )
    .setTimestamp();

  message.edit(ShopEmbed);
};

const failedPurchase = (message) => {
  const ShopEmbed = new MessageEmbed()
    .setColor(`#ff0000`)
    .setTitle("Tilda's Shop")
    .setThumbnail(message.guild.iconURL())
    .setDescription(
      "That was not a valid reaction, please try the command again"
    )
    .setTimestamp();

  message.edit(ShopEmbed);
};

module.exports = { shopManager };
