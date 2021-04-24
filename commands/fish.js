const MessageEmbed = require("discord.js").MessageEmbed;

const coin = require("./coin");
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

const catchManager = (message, args) => {
  let primaryArg = args.split(" ")[0];
  if (primaryArg == "") primaryArg = "plain";

  if (!PONDS[primaryArg]) {
    alertInvalidPond(message);
    return;
  }

  catchFish(message, args, PONDS[primaryArg]);
};

const fishManager = (message, args) => {
  let primaryArg = args.split(" ")[0];
  if (primaryArg)
    switch (primaryArg) {
      case "":
        informCatchFish();
        break;
      case "list":
      case "inventory":
      case "inv":
        displayFish(message, "plain");
        break;
      case "sell":
      case "s":
        sellFishCheck(message, args);
        break;
      default:
        checkForFish(message, args);
    }
};

const informCatchFish = (message) => {
  message.reply(
    "If you are trying to catch a fish, use the `~catch` command or `~c` for short"
  );
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

  if (!args[1] && !(args[1] == "all" || args[1] == "a")) {
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

  user
    .save()
    .then(message.reply(fishEmbed).catch(console.error))
    .catch(console.error);
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

const displayFish = async (message, pondName, embed = false) => {
  let user = await User.findOne({ userId: message.author.id });

  let pond = PONDS[pondName];
  let pondFish = user.fish.filter((fish) => fish.pond == pondName);

  if (!user) {
    user = coin.createUser();

    noFish(message);
    return;
  } else if (!user.fish || user.fish.length == 0) {
    noFish(message);
    return;
  }

  let fishCount = {};

  for (let fish of pond.names) {
    fishCount[fish] = 0;
  }

  for (let fish of pondFish) {
    fishCount[fish.name]++;
  }

  const fishEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(`${message.member.displayName}'s Fish Inventory`)
    .setDescription(`${fName(pond.name)} Fish`)
    .setThumbnail(message.author.displayAvatarURL())
    .setTimestamp();

    if (user.fish.length) {
      let totalFishPrice = 0;
      user.fish.forEach((fish) => totalFishPrice += fish.price);
      fishEmbed.setFooter(`FW: ${totalFishPrice} coins`)
    }

  for (fish in fishCount) {
    if (fishCount[fish] == 0) continue;
    fishEmbed.addField(fName(fish), fishCount[fish], true);
  }

  if (!fishEmbed.fields.length) {
    fishEmbed.addField(
      "You don't have any fish from this pond!",
      "Try catching some and come back here later..."
    );
  }

  if (embed) {
    embed
      .edit(fishEmbed)
      .then((msg) => reactAndWait(message, msg))
      .catch(console.error);
  } else {
    message
      .reply(fishEmbed)
      .then((msg) => reactAndWait(message, msg))
      .catch(console.error);
  }
};

const reactAndWait = async (message, embed) => {
  validReactions = ["💦", "🐍", "🔥", "☁️", "🕸️", "⚫"];

  for (let reaction of validReactions) {
    await embed.react(reaction);
  }

  const filter = (reaction, user) =>
    user.id == message.author.id &&
    validReactions.includes(reaction.emoji.name);
  embed
    .awaitReactions(filter, { max: 1, time: 30000 })
    .then((collected) => handleSelection(message, collected, embed))
    .catch(console.error);
};

const handleSelection = (message, collected, embed) => {
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

  displayFish(message, pondName, embed);
};

const alertInvalidPond = (message) => {
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setTitle("That is not a valid pond!")
    .setDescription("Try checking the log to see valid pond names...");

  message.reply(embed);
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

const catchFish = async (message, args, pond) => {
  let user = await User.findOne({ userId: message.author.id });

  if (!user) {
    user = await coin.createUser(message);
  }

  if (!user.items.includes(pond.rodId)) {
    noRod(message);
    return;
  }

  if (user.score >= pond.cost) {
    user.score -= pond.cost;
    generateFish(message, user, pond);
  } else {
    insufficientCoins(message, pond);
    return;
  }
};

const generateFish = (message, user, pond) => {
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
    .setThumbnail(message.author.displayAvatarURL())
    .setDescription(
      `${message.member.displayName} caught a ${fish.rarity} ${fName(
        fish.name
      )}`
    )
    .addField("Size", `${fish.size}cm`, true)
    .addField("Price", `${fish.price} coins`, true)
    .setFooter(`Fishing Cost: ${pond.cost} coins`);

  message.reply(FishEmbed);

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

const noRod = (message) => {
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setDescription(
      "You must purchase the correlating fishing rod in the shop in order to fish here..."
    )
    .setTitle("You don't have the proper fishing rod!");

  message.reply(embed);
};

const insufficientCoins = (message, pond) => {
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setDescription("You don't have enough coins to go fishing...")
    .setTitle(
      `You need at least ${pond.cost} coins to go fishing in the ${fName(
        pond.name
      )} Pond!`
    );

  message.reply(embed);
};

module.exports = {
  fishManager,
  catchManager,
  catchFish,
};
