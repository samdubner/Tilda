const MessageEmbed = require("discord.js").MessageEmbed;

const coin = require("./coinHelper");
const catchHelper = require("./catchHelper");
const Fish = require("../models/Fish");

const PONDS = catchHelper.PONDS;

const displayFish = async (interaction, pondName) => {
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

  interaction.reply({ embeds: [fishEmbed] });
};

const noFish = (interaction) => {
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setTitle("You don't have any fish!")
    .setDescription("Try catching some fish first...");

  interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

const fishLog = async (interaction) => {
  let user = await coin.checkInteraction(interaction);

  if (!user.fish || user.fish.length == 0) {
    noFish(interaction);
    return;
  }

  const fishEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(`${interaction.member.displayName}'s Fish Logbook`)
    .setThumbnail(interaction.user.displayAvatarURL());

  let fishNames = [];

  for (let pond in PONDS) {
    for (let fish of PONDS[pond].names) {
      if (user.caughtFish.includes(fish)) {
        fishNames.push(fish);
      } else {
        fishNames.push("???");
      }
    }

    let fishString = fishNames.join("\n");
    fishEmbed.addField(
      `${catchHelper.fName(PONDS[pond].name)} Pond`,
      fishString,
      true
    );
    fishNames = [];
  }

  interaction.reply({ embeds: [fishEmbed] }).catch(console.error);
};

const sellFishCheck = async (interaction) => {
  let user = await coin.checkInteraction(interaction);

  if (!user.fish.length) {
    noFish(interaction);
    return;
  }

  // args = args.toLowerCase().split(" ");

  // if (!args[1] && !(args[1] == "all" || args[1] == "a")) {
  //   const embed = new MessageEmbed()
  //     .setColor("#ff0000")
  //     .setTitle("It doesn't look like that command was structured properly")
  //     .setDescription(
  //       `Make sure you do \`${
  //         message.content.split(" ")[0]
  //       } sell [fish name] [fish size]\``
  //     );

  //   message.reply(embed);
  //   return;
  // }

  let result;

  if (args[1] == "all" || args[1] == "a") {
    result = user.fish;
  } else if (["common", "uncommon", "rare", "legendary"].includes(args[1])) {
    result = user.fish.filter((fish) => fish.rarity == args[1]);
  } else if (args[2] == "all" || args[2] == "a" || (args[1] && !args[2])) {
    result = user.fish.filter((fish) => fish.name == args[1]);
  } else {
    result = user.fish.filter(
      (fish) => fish.name == args[1] && fish.size == parseInt(args[2])
    );
  }

  if (!result.length) {
    invalidFish(interaction);
    return;
  }

  sellFish(message, user, [...result]);
};

sellFish = (message, user, fish) => {
  let totalSale = 0;
  let fishIndex;

  fish.forEach((single) => {
    totalSale += single.price;
    fishIndex = user.fish.findIndex((i) => i._id == single._id);
    user.fish.splice(fishIndex, 1);
  });

  user.score += totalSale;

  const fishEmbed = new MessageEmbed()
    .setColor(`#00ff00`)
    .setTitle(`${message.member.displayName} sold ${fish.length} fish`)
    .setThumbnail(message.author.displayAvatarURL())
    .addField(
      `Sold ${fish.length} fish for ${totalSale} coins!`,
      `They now have ${user.score} coins!`
    );

  user
    .save()
    .then(message.reply(fishEmbed).catch(console.error))
    .catch(console.error);
};

const invalidFish = (interaction) => {
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setTitle("You don't have any fish like that!")
    .setDescription("Make sure you spelled the name correctly...");

  interaction.reply({ embeds: [embed] });
};

module.exports = {
  displayFish,
  fishLog,
};
