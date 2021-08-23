const MessageEmbed = require("discord.js").MessageEmbed;

const User = require("../models/User");
const helper = require("../helpers/coinHelper");

module.exports = {
  name: "give",
  description: "Sends some coins to a thankful person!",
  options: [
    {
      type: "MENTIONABLE",
      name: "person",
      description: "the person who you'd like to send coins to",
      required: true,
    },
    {
      type: "INTEGER",
      name: "amount",
      description: "the amount of coins you'd like to give",
      required: true,
    },
  ],
  async execute(interaction) {
    if (!interaction.options.get("person").user) {
      interaction.reply({
        content: "You can only gives coins to users",
        ephemeral: true,
      });
      return;
    }

    let sender = await helper.checkInteraction(interaction);
    let receiptCheck = await helper.checkUser(
      interaction.options.get("person").user
    );

    if (!receiptCheck) {
      interaction.reply(
        "You cannot give money to someone who hasn't used a betting command before, tell them to use `~bal`"
      );
      return;
    }

    let receipt = await User.findOne({
      userId: interaction.options.get("person").user.id,
    }).catch(console.error);

    let giveAmount = interaction.options.get("amount").value;

    if (interaction.options.get("amount").value > sender.score) {
      interaction.reply({
        content: "You cannot give more coins than you have",
        ephemeral: true,
      });
      return;
    }

    if (giveAmount < 1) {
      interaction.reply({
        content: "You cannot give less than one coin",
        ephemeral: true,
      });
      return;
    }

    if (receipt.userId == interaction.user.id) {
      interaction.reply({
        content: "You cannot give yourself coins",
        ephemeral: true,
      });
      return;
    }

    User.updateOne(
      { userId: sender.userId },
      { score: parseInt(sender.score) - giveAmount }
    ).catch(console.error);

    User.updateOne(
      { userId: receipt.userId },
      { score: parseInt(receipt.score) + giveAmount }
    ).catch(console.error);

    let embed = new MessageEmbed()
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTitle("Coin Transfer")
      .addField(
        `${interaction.user.username}'s Balance (-${giveAmount})`,
        `${parseInt(sender.score) - parseInt(giveAmount)}`,
        false
      )
      .addField(
        `${interaction.options.get("person").user.username}'s Balance (+${giveAmount})`,
        `${parseInt(receipt.score) + parseInt(giveAmount)}`,
        false
      );

    interaction.reply({ embeds: [embed] });
  },
};
