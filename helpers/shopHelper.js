const MessageEmbed = require("discord.js").MessageEmbed;

const coin = require("./coinHelper");
const Item = require("../models/Item");

const displayShop = async (interaction) => {
  let shopItems = await Item.find();

  const ShopEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Tilda's Shop")
    .setThumbnail(interaction.guild.iconURL())
    .setDescription("Here are all the items available for sale!");

  for (let item of shopItems) {
    ShopEmbed.addField(item.name, `${item.price} coins`, true);
  }

  interaction.reply({ embeds: [ShopEmbed] }).catch(console.error);
};

const handlePurchase = async (interaction, item) => {
  let user = await coin.checkInteraction(interaction);

  let selectedItem = await Item.findOne({ name: item });

  if (user.items.includes(selectedItem._id)) {
    failedPurchase(interaction);
    return;
  }

  if (user.score >= selectedItem.price) {
    user.items.push(selectedItem._id);
    user.score -= selectedItem.price;
  } else {
    insufficientCoins(interaction);
    return;
  }

  user
    .save()
    .then(() => successfulPurchase(interaction, user, selectedItem))
    .catch(console.error);
};

const insufficientCoins = (interaction) => {
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setTitle("You don't have enough coins to buy that item!");

  interaction.reply({ embeds: [embed], ephemeral: true });
};

const successfulPurchase = async (interaction, user, selectedItem) => {
  let guildMember = await interaction.guild.members.fetch(user.userId);
  const ShopEmbed = new MessageEmbed()
    .setColor(`#00ff00`)
    .setTitle("Tilda's Shop")
    .setDescription(
      `${guildMember.displayName} purchased a \`${selectedItem.name}\``
    );

  interaction.reply({ embeds: [ShopEmbed] });
};

const failedPurchase = (interaction) => {
  const FailEmbed = new MessageEmbed()
    .setColor(`#ff0000`)
    .addField(
      "You already have that item!",
      "You cannot purchase that item because you already own it"
    );

  interaction.reply({ embeds: [FailEmbed], ephemeral: true });
};

module.exports = { displayShop, handlePurchase };
