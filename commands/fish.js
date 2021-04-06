const MessageEmbed = require("discord.js").MessageEmbed;

const coin = require("./coin");
const User = require("../models/User");
const Fish = require("../models/Fish");

const PONDS = {
  Plain: [
    "bass",
    "catfish",
    "goldfish",
    "guppy",
    "salmon",
    "sardine",
    "trout",
    "tuna",
  ],
  Underground: [],
  Underworld: [],
  Sky: [],
  Ancient: [],
  Void: [],
};

const fishManager = (message, args) => {
  let primaryArg = args.split(" ")[0];
  switch (primaryArg) {
    case "":
      catchFish(message, args);
      break;
    case "list":
    case "inventory":
    case "inv":
      displayFish(message);
      break;
    case "sell":
    case "s":
      sellFishCheck(message, args);
      break;
    default:
      checkForFish(message, args);
  }
};

const sellFishCheck = async (message, args) => {
  let user = await User.findOne({ userId: message.author.id });

  if (!user) {
    coin.createUser(message);
    noFish(message);
    return;
  } else if (!user.fish.length) {
    noFish(message);
    return;
  }

  args = args.toLowerCase().split(" ");

  if ((!args[1] || !args[2]) && !(args[1] == "all" || args[1] == "a")) {
    const embed = new MessageEmbed()
      .setColor("#ff0000")
      .setTitle("It doesn't look like that command was structured properly")
      .setDescription(
        `Make sure you do \`${
          message.content.split(" ")[0]
        } sell [fish name] [fish size]\``
      );

    message.reply(embed);
    return;
  }

  let result;

  if (args[1] == "all" || args[1] == "a") {
    result = user.fish;
  } else if (args[2] == "all" || args[2] == "a") {
    result = user.fish.filter((fish) => fish.name == args[1]);
  } else {
    result = user.fish.filter(
      (fish) => fish.name == args[1] && fish.size == parseInt(args[2])
    );
  }

  if (!result.length) {
    invalidFish(message);
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

  user.save().then(message.reply(fishEmbed).catch(console.error)).catch(console.error);
};

const checkForFish = async (message, args) => {
  let user = await User.findOne({ userId: message.author.id });
  fishName = args.split(" ")[0];

  if (!user) {
    user = coin.createUser();
    noFish(message);
    return;
  } else if (!user.fish) {
    noFish(message);
    return;
  }

  let fishList = user.fish.filter((fish) => fish.name == args.toLowerCase());

  if (fishList.length == 0) {
    invalidFish(message);
    return;
  }

  displaySingleFish(message, fishList);
};

const displaySingleFish = (message, fishList) => {
  const fishEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(`${message.member.displayName}'s ${fName(fishList[0].name)}`)
    .setThumbnail(message.author.displayAvatarURL())
    .setTimestamp();

  for (fish of fishList) {
    fishEmbed.addField(
      `${fName(fish.rarity)} ${fish.size}cm`,
      `${fish.price} coins`,
      true
    );
  }

  message.reply(fishEmbed);
};

const displayFish = async (message) => {
  let user = await User.findOne({ userId: message.author.id });

  if (!user) {
    user = coin.createUser();

    noFish(message);
    return;
  } else if (!user.fish || user.fish.length == 0) {
    noFish(message);
    return;
  }

  let fishCount = {};

  for (let fish of PONDS["Plain"]) {
    fishCount[fish] = 0;
  }

  for (let fish of user.fish) {
    fishCount[fish.name]++;
  }

  const fishEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(`${message.member.displayName}'s Fish Inventory`)
    .setDescription(`Plain Fish`)
    .setThumbnail(message.author.displayAvatarURL())
    .setTimestamp();

  for (fish in fishCount) {
    if (fishCount[fish] == 0) continue;
    fishEmbed.addField(fName(fish), fishCount[fish], true);
  }

  message.reply(fishEmbed);
};

const noFish = (message) => {
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setTitle("You don't have any fish!")
    .setDescription("Try catching some fish first...");

  message.reply(embed);
};

const invalidFish = (message) => {
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setTitle("You don't have any fish like that!")
    .setDescription("Make sure you spelled the name correctly...");

  message.reply(embed);
};

// CATCHING FISH #########################################################

const catchFish = async (message, args) => {
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
    return;
  }

  if (user.score >= 25) {
    user.score -= 25;
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
  let embedColor = getColor(rarity)
  let fish = new Fish({
    name,
    rarity,
    size,
    pond,
    price,
  });

  const FishEmbed = new MessageEmbed()
    .setColor(embedColor)
    .setTitle("You caught a fish!")
    .setThumbnail(message.author.displayAvatarURL())
    .setDescription(
      `${message.member.displayName} caught a ${fish.rarity} ${fName(
        fish.name
      )}`
    )
    .addField("Size", `${fish.size}cm`, true)
    .addField("Price", `${fish.price} coins`, true)
    .setFooter(`Fishing Cost: 25 coins`);

  message.reply(FishEmbed);

  user.fish.push(fish);
  user.save().catch(console.error);
};

const fName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const getColor = (rarity) => {
  switch(rarity) {
    case "common":
      return "#bec2bf";
    case "uncommon":
      return "#39ff36";
    case "rare":
      return "#3647ff";
    case "legendary":
      return "#cea3ff"
  }
}

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
    .setTitle("You need at least 25 coins to go fishing in the Plain Pond!");

  message.reply(embed);
};

module.exports = {
  fishManager,
  catchFish,
};
