import { MessageEmbed } from "discord.js";

import coinHelper from "../helpers/coinHelper";
import catchHelper from "../helpers/catchHelper";
const FISH = catchHelper.FISH;

//show all of a users's fish in a given rarity
const displayFish = async (interaction, rarity) => {
  let user = await coinHelper.checkInteraction(interaction);

  if (!user.fish || user.fish.length == 0) {
    noFish(interaction);
    return;
  }

  let selectedRarity = FISH.rarities.find((rar) => rar.type == rarity);
  let userRarityFish = user.fish.filter(
    (fish) => fish.rarity == selectedRarity.type
  );

  let fishCount = {};

  for (let fish of selectedRarity.names) {
    fishCount[fish] = 0;
  }

  for (let fish of userRarityFish) {
    fishCount[fish.name]++;
  }

  const fishEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(`${interaction.member.displayName}'s Fish Inventory`)
    .setDescription(`${catchHelper.fName(selectedRarity.type)} Fish`)
    .setThumbnail(interaction.user.displayAvatarURL())
    .setTimestamp();

  if (user.fish.length) {
    let totalFishPrice = 0;
    user.fish.forEach((fish) => (totalFishPrice += fish.price));
    fishEmbed.setFooter({ text: `FW: ${totalFishPrice} coins` });
  }

  for (let fish in fishCount) {
    if (fishCount[fish] == 0) continue;
    fishEmbed.addField(catchHelper.fName(fish), `${fishCount[fish]}`, true);
  }

  if (!fishEmbed.fields.length) {
    fishEmbed.addField(
      "You don't have any fish of this rarity!",
      "Try catching some and then come back here..."
    );
  }

  interaction.reply({ embeds: [fishEmbed] });
};

//display an embed to the user if they have no fish
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

//show a logbook of all the species fish the user has captured
const fishLog = async (interaction) => {
  let user = await coinHelper.checkInteraction(interaction);

  const fishEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(`${interaction.member.displayName}'s Fish Logbook`)
    .setThumbnail(interaction.user.displayAvatarURL());

  let fishNames = [];

  for (let rarity of FISH.rarities) {
    for (let fish of rarity.names) {
      if (user.caughtFish.includes(fish)) {
        fishNames.push(fish);
      } else {
        fishNames.push("???");
      }
    }

    let fishString = fishNames.join("\n");
    fishEmbed.addField(
      `${catchHelper.fName(rarity.type)} Fish`,
      fishString,
      true
    );
    fishNames = [];
  }

  interaction.reply({ embeds: [fishEmbed] }).catch(console.error);
};

//verify the user has fish to sell and the fish they are trying to sell
//is valid before selling
const sellFishCheck = async (interaction, user, result) => {
  if (!user.fish.length) {
    noFish(interaction);
    return;
  }

  if (!result.length) {
    invalidFish(interaction);
    return;
  }

  sellFish(interaction, user, [...result]);
};

//sell a user's fish
const sellFish = (interaction, user, fish) => {
  let totalSale = 0;
  let totalFish = fish.length;
  let fishIndex;

  fish.forEach((single) => {
    totalSale += single.price;
    fishIndex = user.fish.findIndex((i) => i._id == single._id);
    user.fish.splice(fishIndex, 1);
  });

  user.score += totalSale;

  const fishEmbed = new MessageEmbed()
    .setColor(`#00ff00`)
    .setTitle(`${interaction.member.displayName} sold ${totalFish} fish`)
    .setThumbnail(interaction.user.displayAvatarURL())
    .addField(
      `Sold ${totalFish} fish for ${totalSale} coins!`,
      `They now have ${user.score} coins!`
    );

  user.save();

  interaction.reply({ embeds: [fishEmbed] }).catch(console.error);
};

//let a user know they have no fish of that kind to sell
const invalidFish = (interaction) => {
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setTitle("You don't have any fish like that!")
    .setDescription("Make sure you spelled the name correctly...");

  interaction.reply({ embeds: [embed] });
};

//check a user to see if they have a single kind of fish
const checkForFish = async (interaction, fishName) => {
  let user = await coinHelper.checkInteraction(interaction);

  if (!user.fish) {
    noFish(interaction);
    return;
  }

  let fishList = user.fish.filter((fish) => fish.name == fishName);

  if (!fishList.length) {
    invalidFish(interaction);
    return;
  }

  displaySingleFish(interaction, fishList);
};

//send an embed displaying all of a user's fish of a given species
const displaySingleFish = (interaction, fishList) => {
  const fishEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(
      `${interaction.member.displayName}'s ${catchHelper.fName(
        fishList[0].name
      )}`
    )
    .setThumbnail(interaction.user.displayAvatarURL())
    .setTimestamp();

  for (let fish of fishList) {
    fishEmbed.addField(
      `${catchHelper.fName(fish.rarity)} ${fish.size}cm`,
      `${fish.price} coins`,
      true
    );
  }

  interaction.reply({ embeds: [fishEmbed] });
};

export default {
  displayFish,
  fishLog,
  sellFishCheck,
  checkForFish,
};
