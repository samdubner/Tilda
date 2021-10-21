const MessageEmbed = require("discord.js").MessageEmbed;

const Fish = require("../models/Fish");

const FISH = {
  rarities: [
    {
      type: "common",
      value: 0,
      names: [
        "bass",
        "catfish",
        "salmon",
        "sardine",
        "trout",
        "tuna",
        "cod",
        "eel",
        "guppy",
      ],
    },
    {
      type: "uncommon",
      value: 1,
      names: [
        "goldfish",
        "anglerfish",
        "mudfish",
        "mossfish",
        "crayfish",
        "piranha",
        "sand dollar",
        "slime",
      ],
    },
    {
      type: "rare",
      value: 2,
      names: [
        "vacuumfish",
        "jellyfish",
        "eagle ray",
        "reaverfish",
        "magmaworm",
        "aerogill",
        "ruinfish",
      ],
    },
    {
      type: "legendary",
      value: 3,
      names: ["megalodon", "kraken", "leviathan", "astrofish", "guardian"],
    },
    {
      type: "mythical",
      value: 4,
      names: ["dreameater", "soulfish", "starfish", "truth"],
    },
  ],
};

const rodId = "606a5c0169756d515427c86e";
const pondPrice = 25;

const catchFish = async (interaction, user) => {
  if (!user.items.includes(rodId)) {
    noRod(interaction);
    return;
  }

  if (user.score >= pondPrice) {
    user.score -= pondPrice;
    generateFish(interaction, user);
  } else {
    insufficientCoins(interaction);
    return;
  }
};

const generateFish = (interaction, user) => {
  let rarity = generateRarity();

  let namesLength = rarity.names.length;
  let name = rarity.names[Math.floor(Math.random() * namesLength)];

  let size = generateSize(rarity);
  let price = generatePrice(size, rarity);

  let embedColor = getColor(rarity.type);

  let fish = new Fish({
    name,
    rarity: rarity.type,
    size,
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
    .setFooter(`Fishing Cost: ${pondPrice} coins`);

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
      return "#a3a3a3";
    case "uncommon":
      return "#33f230";
    case "rare":
      return "#2134ff";
    case "legendary":
      return "#9f00e3";
    case "mythical":
      return "#ff0073";
  }
};

const generatePrice = (size, rarity) => {
  return Math.floor(size / 2) + 10 ** (rarity.value - 1);
};

const generateSize = (rarity) => {
  let minVal;
  let maxVal;

  switch (rarity.type) {
    case "common":
      minVal = 30;
      maxVal = 70;
      break;
    case "uncommon":
      minVal = 71;
      maxVal = 111;
      break;
    case "rare":
      minVal = 112;
      maxVal = 152;
      break;
    case "legendary":
      minVal = 153;
      maxVal = 193;
      break;
    case "mythical":
      minVal = 194;
      maxVal = 234;
  }

  return Math.floor(Math.random() * (maxVal - minVal)) + minVal + 1;
};

const generateRarity = () => {
  // [common, uncommon, rare, legendary, mythical]
  let rarities = Object.keys(FISH.rarities);
  let weights = [725, 175, 80, 19, 1];

  let totalWeight = weights.reduce((acc, cur) => acc + cur);
  let random = Math.floor(Math.random() * totalWeight);

  let res = totalWeight - random;

  for (let i = 0; i <= weights.length; i++) {
    res -= weights[i];

    if (res <= 1) {
      return FISH.rarities.find((rar) => rar.value == i);
    }
  }
};

const noRod = (interaction) => {
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setDescription(
      "You must purchase the fishing rod in the shop in order to fish..."
    )
    .setTitle("You don't have the fishing rod!");

  interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

const insufficientCoins = (interaction) => {
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setDescription("You don't have enough coins to go fishing...")
    .setTitle(
      `You need at least ${pondPrice} coins to go fishing in the Pond!`
    );

  interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};

module.exports = {
  FISH,
  catchFish,
  fName,
};
