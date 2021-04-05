const MessageEmbed = require("discord.js").MessageEmbed;

const coin = require("./coin");
const User = require("../models/User");
const Fish = require("../models/Fish");

const PONDS = {
  Plain: [
    "Trout",
    "Sardine",
    "Salmon",
    "Tuna",
    "Catfish",
    "Bass",
    "Goldfish",
    "Guppy",
  ],
  Underground: [],
  Underworld: [],
  Sky: [],
  Ancient: [],
  Void: [],
};

const catchFish = async (message, args) => {
  if (message.author.id != "340002869912666114") return;

  let user = await User.findOne({ userId: message.author.id });

  if (!user) {
    user = await coin.createUser(message);
  }

  // let primaryArg = args.split(" ")[0]
  // switch (primaryArg) {
  //   case "":
  //     break;
  //   default:
  //     return;
  // }

  if (!user.items.includes("606a5c0169756d515427c86e")) {
    noRod(message);
    return; }

  if (user.score >= 25) {
    generateFish(message, user);
  } else {
    insufficientCoins(message);
    return;
  }
};

const generateFish = (message, user) => {
  let pondSize = PONDS["Plain"].length;
  let name = PONDS["Plain"][Math.floor(Math.random() * pondSize)];
  let rarity = generateRarity();
  let size = generateSize(rarity);
  let pond = 1;
  let price = generatePrice(size, pond);
  let fish = new Fish({
    name,
    rarity,
    size,
    pond,
    price,
  });

  const FishEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("You caught a fish!")
    .setThumbnail(message.author.displayAvatarURL())
    .setDescription(`${message.member.displayName} caught a ${fish.rarity} ${fish.name}`)
    .addField('Size', `${fish.size}cm`, true)
    .addField('Price', `${fish.price} coins`, true)
    .setTimestamp();

  message.reply(FishEmbed)

  user.fish.push(fish);
  user.save();
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

const noRod = (message) => {
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setDescription(
      "You must purchase a fishing rod in the shop in order to go fishing..."
    )
    .setTitle("You don't have a fishing rod!");

  message.reply(embed);
};

const insufficientCoins = (message) => {
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setDescription("You don't have enough coins to go fishing...")
    .setTitle("You need at least 10 coins to go fishing in the Plain Pond!");

  message.reply(embed);
};

module.exports = {
  catchFish,
};
