const MessageEmbed = require("discord.js").MessageEmbed;

const coin = require("./coinHelper");
const User = require("../models/User");
const Fish = require("../models/Fish");

const PONDS = {
  plain: {
    name: "plain",
    rodId: "606a5c0169756d515427c86e",
    level: 1,
    cost: 25,
    names: [
      "bass",
      "catfish",
      "goldfish",
      "guppy",
      "salmon",
      "sardine",
      "trout",
      "tuna",
      "cod",
    ],
  },
  underground: {
    name: "underground",
    rodId: "6074c897563e2b56fd529f07",
    level: 2,
    cost: 50,
    names: [
      "mudfish",
      "eel",
      "dirtfish",
      "jellyfish",
      "piranha",
      "crayfish",
      "anglerfish",
      "slime",
    ],
  },
  underworld: {
    name: "underworld",
    rodId: "6074c8ca563e2b56fd529f08",
    level: 3,
    cost: 75,
    names: [
      "magmaworm",
      "devilfish",
      "reaverfish",
      "direfish",
      "sand dollar",
      "soulfish",
    ],
  },
  sky: {
    name: "sky",
    rodId: "6074c8e8563e2b56fd529f09",
    level: 4,
    cost: 100,
    names: [
      "pigeon",
      "gullifish",
      "parrotfish",
      "aerogill",
      "eagle ray",
      "pelican eel",
    ],
  },
  ancient: {
    name: "ancient",
    rodId: "6074c905563e2b56fd529f0a",
    level: 5,
    cost: 125,
    names: [
      "megalodon",
      "kraken",
      "leviathan",
      "mossfish",
      "ruinfish",
      "guardian",
    ],
  },
  void: {
    name: "void",
    rodId: "6074c92c563e2b56fd529f0b",
    level: 6,
    cost: 150,
    names: [
      "dreameater",
      "starfish",
      "astrofish",
      "truth",
      "steve",
      "vacuumfish",
    ],
  },
};

const catchFish = async (interaction, user, pondName) => {
  let pond = PONDS[pondName];

  if (!user.items.includes(pond.rodId)) {
    noRod(interaction);
    return;
  }

  if (user.score >= pond.cost) {
    user.score -= pond.cost;
    generateFish(interaction, user, pond);
  } else {
    insufficientCoins(interaction, pond);
    return;
  }
};

const generateFish = (interaction, user, pond) => {
  let pondSize = pond.names.length;
  let name = pond.names[Math.floor(Math.random() * pondSize)];
  let rarity = generateRarity();
  let size = generateSize(rarity);
  let price = generatePrice(size, pond.level);
  let embedColor = getColor(rarity);

  let fish = new Fish({
    name,
    rarity,
    size,
    pond: pond.name,
    price,
  });

  if (!user.caughtFish.includes(name)) {
    user.caughtFish.push(name);
  }

  const FishEmbed = new MessageEmbed()
    .setColor(embedColor)
    .setTitle("You caught a fish!")
    .setThumbnail(interaction.user.displayAvatarURL())
    .setDescription(
      `${interaction.member.displayName} caught a ${fish.rarity} ${fName(
        fish.name
      )}`
    )
    .addField("Size", `${fish.size}cm`, true)
    .addField("Price", `${fish.price} coins`, true)
    .setFooter(`Fishing Cost: ${pond.cost} coins`);

  interaction.reply({ embeds: [FishEmbed] });

  user.fish.push(fish);
  user.save().catch(console.error);
};

const fName = (name) => {
  arr = name.split(" ");
  arr = arr.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  name = arr.join(" ");
  return name;
};

const getColor = (rarity) => {
  switch (rarity) {
    case "common":
      return "#bec2bf";
    case "uncommon":
      return "#39ff36";
    case "rare":
      return "#3647ff";
    case "legendary":
      return "#b300ff";
  }
};

const generatePrice = (size, pondLevel) => {
  return Math.floor(size / 3) * pondLevel;
};

const generateSize = (rarity) => {
  let minVal;
  let maxVal;

  switch (rarity) {
    // 1 - 2 feet
    case "common":
      minVal = 30;
      maxVal = 60;
      break;
    // 2 - 4
    case "uncommon":
      minVal = 61;
      maxVal = 121;
      break;
    // 4 - 6
    case "rare":
      minVal = 122;
      maxVal = 182;
      break;
    // 6 - 8
    case "legendary":
      minVal = 183;
      maxVal = 243;
      break;
  }

  return Math.floor(Math.random() * (maxVal - minVal)) + minVal + 1;
};

const generateRarity = () => {
  let rarities = ["common", "uncommon", "rare", "legendary"];
  let weights = [64, 20, 15, 1];

  let totalWeight = weights.reduce((acc, cur) => acc + cur);
  let random = Math.floor(Math.random() * totalWeight);

  for (let i = 0; i < rarities.length; i++) {
    random -= weights[i];

    if (random < 0) {
      return rarities[i];
    }
  }
};

const noRod = (interaction) => {
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setDescription(
      "You must purchase the correlating fishing rod in the shop in order to fish here..."
    )
    .setTitle("You don't have the proper fishing rod!");

  interaction.reply({
    embeds: [embed],
    ephemeral: true
  });
};

const insufficientCoins = (interaction, pond) => {
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setDescription("You don't have enough coins to go fishing...")
    .setTitle(
      `You need at least ${pond.cost} coins to go fishing in the ${fName(
        pond.name
      )} Pond!`
    );

  interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

module.exports = {
  catchFish,
  fName,
  PONDS
};
