const MessageEmbed = require("discord.js").MessageEmbed;

const coin = require("./coinHelper");
const catchHelper = require("./catchHelper");
const User = require("../models/User");
const Fish = require("../models/Fish");

const PONDS = catchHelper.PONDS;

const displayFish = async (interaction, pondName, embed = false) => {
  let user = await coin.checkInteraction(interaction);

  if (!user.fish || user.fish.length == 0) {
    noFish(interaction);
    return;
  }

  let pond = PONDS[pondName];
  let pondFish = user.fish.filter((fish) => fish.pond == pondName);

  let fishCount = {};

  for (let fish of pond.names) {
    fishCount[fish] = 0;
  }

  for (let fish of pondFish) {
    fishCount[fish.name]++;
  }

  const fishEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(`${interaction.member.displayName}'s Fish Inventory`)
    .setDescription(`${catchHelper.fName(pond.name)} Fish`)
    .setThumbnail(interaction.user.displayAvatarURL())
    .setTimestamp();

  if (user.fish.length) {
    let totalFishPrice = 0;
    user.fish.forEach((fish) => (totalFishPrice += fish.price));
    fishEmbed.setFooter(`FW: ${totalFishPrice} coins`);
  }

  for (fish in fishCount) {
    if (fishCount[fish] == 0) continue;
    fishEmbed.addField(catchHelper.fName(fish), `${fishCount[fish]}`, true);
  }

  if (!fishEmbed.fields.length) {
    fishEmbed.addField(
      "You don't have any fish from this pond!",
      "Try catching some and come back here later..."
    );
  }

  if (embed) {
    embed
      .edit({embeds: [fishEmbed]})
      .then((msg) => reactAndWait(interaction, msg))
      .catch(console.error);
  } else {
    await interaction.reply({ embeds: [fishEmbed]})
    let reply = await interaction.fetchReply()
    reactAndWait(interaction, reply)
  }
};

const reactAndWait = async (interaction, msg) => {
  validReactions = ["💦", "🐍", "🔥", "☁️", "🕸️", "⚫"];

  for (let reaction of validReactions) {
    await msg.react(reaction);
  }

  const filter = (reaction, user) =>
    user.id == interaction.user.id &&
    validReactions.includes(reaction.emoji.name);
  msg
    .awaitReactions(filter, { max: 1, time: 30000 })
    .then((collected) => handleSelection(interaction, collected, embed))
    .catch(console.error);
};

const handleSelection = (interaction, collected, msg) => {
  let pondName;

  collected.each((reaction) => {
    reaction.message.reactions.removeAll().catch(console.error);

    switch (reaction.emoji.name) {
      case "💦":
        pondName = "plain";
        break;
      case "🐍":
        pondName = "underground";
        break;
      case "🔥":
        pondName = "underworld";
        break;
      case "☁️":
        pondName = "sky";
        break;
      case "🕸️":
        pondName = "ancient";
        break;
      case "⚫":
        pondName = "void";
        break;
    }
  });

  if (!pondName) return;

  displayFish(interaction, pondName, msg);
};

const noFish = (interaction) => {
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setTitle("You don't have any fish!")
    .setDescription("Try catching some fish first...");

  interaction.reply({
    embeds: [embed],
    ephemeral: true
  });
};

module.exports = {
  displayFish,
};
