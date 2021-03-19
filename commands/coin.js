const MessageEmbed = require("discord.js").MessageEmbed;

const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const Users = sequelize.define("userList", {
  userId: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  score: Sequelize.INTEGER,
  dailyDate: Sequelize.INTEGER,
  begDate: Sequelize.INTEGER,
});

let sync = () => Users.sync();

let leaderboard = async (message) => {
  if (message.channel.id != "735399594917363722") {
    message.reply("Please only use coin commands in <#735399594917363722>");
    return;
  }

  let userList = await Users.findAll({ order: [["score", "DESC"]] });

  userList = userList.slice(0, 5);

  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Coin Leaderboard")
    .setThumbnail("https://i.imgur.com/hPCYkuG.gif");

  let i = 1;
  for (let user of userList) {
    if (user.score == userList[0].score) {
      if (message.guild.members.cache.get(user.userId) != undefined) {
        embed.addField(
          `${i}) ${message.guild.members.cache.get(user.userId).user.username}`,
          ` 🎉 ${user.score} 🎉`,
          false
        );
      } else {
        Users.destroy({
          where: {userId: user.userId}
        })
      }
    } else {
      if (message.guild.members.cache.get(user.userId) != undefined) {
        embed.addField(
          `${i}) ${message.guild.members.cache.get(user.userId).user.username}`,
          user.score,
          false
        );
      }
    }
    i++;
  }

  message.channel.send(embed).catch(console.error);
};

let continueUser = async (message, args, type) => {
  if (message.channel.id != "735399594917363722") {
    message.reply("Please only use gambling commands in <#735399594917363722>");
    return;
  }

  let user = await Users.findOne({ where: { userId: message.author.id } });

  if (!user) {
    user = await createUser(message);
    console.log(
      `Added <${user.userId}> ${message.author.username} to the coin table`
    );
    return;
  }

  switch (type) {
    case "flip":
      flip(message, args, user);
      break;
    case "daily":
      daily(message, user);
      break;
    case "beg":
      beg(message, user);
      break;
    case "balance":
      balance(message, user);
      break;
    case "give":
      give(message, args, user);
      break;
    case "print":
      print(message, args, user);
      break;
    case "claim":
      claim(message, user);
      break;
    case "challenge":
      challenge(message, args, user);
      break;
    default:
      balance(message, user);
  }
};

let flip = (message, args, user) => {
  let flipResult = Math.floor(Math.random() * 2);
  let bet = Math.ceil(args.split(" ")[0]);

  args = args.toLowerCase();

  if (user.score == 0) {
    message.reply(
      "You need more coins before you can bet again, try using ~daily or ~beg"
    );
    return;
  }

  if (bet <= 0) {
    message.reply(
      "You cannot bet a number of coins less than or equal to zero"
    );
    return;
  }

  if (bet > user.score) {
    message.reply("That bet is too large, please try again with a smaller bet");
    return;
  }

  if (
    (args == null || args == undefined || isNaN(args) || args == "") &&
    args != "all" &&
    args != "a"
  ) {
    message.reply(
      "You have to bet a valid amount, please try again with a valid number"
    );
    return;
  }

  if (args == "all" || args == "a") bet = user.score;

  let scoreWon = bet;

  if (flipResult) {
    let embed = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle(`You won ${scoreWon} coin(s)!`)
      .setDescription(
        `You now have ${parseInt(user.score) + parseInt(scoreWon)} coins`
      )
      .setThumbnail("https://i.imgur.com/hPCYkuG.gif");
    message.reply(embed);
    scoreWon = bet;
  } else {
    let embed = new MessageEmbed()
      .setColor("#ff0000")
      .setTitle(`You lost ${scoreWon} coin(s)`)
      .setDescription(
        `You now have ${parseInt(user.score) - parseInt(scoreWon)} coin(s)`
      )
      .setThumbnail("https://i.imgur.com/hPCYkuG.gif");
    message.reply(embed);
    scoreWon = bet * -1;
  }

  Users.update(
    { score: parseInt(user.score) + parseInt(scoreWon) },
    { where: { userId: message.author.id } }
  );
};

let daily = (message, user) => {
  let checkDate = user.dailyDate;
  let dailyTimer = new Date().getTime() - 86400000;

  if (dailyTimer < checkDate) {
    let minutes = Math.trunc(((checkDate - dailyTimer) / 60000) % 60);
    let hours = Math.trunc(((checkDate - dailyTimer) / 3600000) % 24);

    let embed = new MessageEmbed()
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTitle(`Daily`)
      .setDescription(
        `Daily available in ${hours} ${
          hours == 1 ? "hour" : "hours"
        } and ${minutes} ${minutes == 1 ? "minute" : "minutes"}`
      )
      .setThumbnail("https://i.imgur.com/PRhGygj.jpg");

    message.reply(embed).catch(console.error);
    return;
  }

  Users.update(
    { score: parseInt(user.score) + 100, dailyDate: new Date().getTime() },
    { where: { userId: message.author.id } }
  );

  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(`You got 100 coins!`)
    .setDescription(`You now have ${user.score + 100} coins`)
    .setThumbnail("https://i.imgur.com/PRhGygj.jpg");

  message.reply(embed).catch(console.error);
};

let beg = (message, user) => {
  let checkDate = user.begDate;
  let begTimer = new Date().getTime() - 10 * 60 * 1000;

  if (begTimer < checkDate) {
    let seconds = Math.trunc(((checkDate - begTimer) / 1000) % 60);
    let minutes = Math.trunc(((checkDate - begTimer) / 60000) % 60);
    let embed = new MessageEmbed()
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTitle(`Beg`)
      .setDescription(
        `You can beg in ${minutes} ${
          minutes == 1 ? "minute" : "minutes"
        } and ${seconds} ${seconds == 1 ? "second" : "seconds"}`
      )
      .setThumbnail("https://i.imgur.com/PRhGygj.jpg");
    message.reply(embed);
    return;
  }

  Users.update(
    { score: parseInt(user.score) + 10, begDate: new Date().getTime() },
    { where: { userId: message.author.id } }
  );

  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(`You got 10 coins!`)
    .setDescription(`You now have ${user.score + 10} coins`)
    .setThumbnail("https://i.imgur.com/PRhGygj.jpg");

  message.reply(embed);
};

let give = async (message, args, sender) => {
  let receipt = await Users.findOne({
    where: { userId: message.mentions.users.first().id },
  });

  if (!receipt) {
    message.reply(
      "You cannot give money to someone who hasn't used a betting command before, tell them to use `~bal`"
    );
    return;
  }

  let giveAmount = args.split(" ")[0];

  if (isNaN(giveAmount)) {
    message.reply(
      "Make sure you put the amount you want to give before the mention"
    );
    return;
  }

  if (giveAmount < 1) {
    message.reply("You cannot give less than one coin");
    return;
  }

  if (sender.score < giveAmount) {
    message.reply("You don't have that much money to give away");
    return;
  }

  if (receipt.userId == message.author.id) {
    message.reply("You cannot give yourself coins")
    return;
  }

  Users.update(
    { score: parseInt(sender.score) - parseInt(giveAmount) },
    { where: { userId: sender.userId } }
  ).catch(console.error);

  Users.update(
    { score: parseInt(receipt.score) + parseInt(giveAmount) },
    { where: { userId: receipt.userId } }
  ).catch(console.error);

  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Coin Transfer")
    .addField(
      `${message.author.username}'s Balance (-)`,
      `${parseInt(sender.score) - parseInt(giveAmount)}`,
      false
    )
    .addField(
      `${message.mentions.users.first().username}'s Balance (+)`,
      `${parseInt(receipt.score) + parseInt(giveAmount)}`,
      false
    );

  message.channel.send(embed);
};

let print = async (message, args) => {
  if (message.author.id != "340002869912666114") {
    let embed = new MessageEmbed()
      .setColor(`#ff0000`)
      .setTitle("You cannot use this command.");

    message.channel.send(embed);
    return;
  }

  let receipt = await Users.findOne({
    where: { userId: message.mentions.users.first().id },
  });

  if (!receipt) {
    message.reply(
      "You cannot give money to someone who hasn't used a betting command before, tell them to use `~bal`"
    );
    return;
  }

  let giveAmount = args.split(" ")[0];

  if (isNaN(giveAmount)) {
    message.reply(
      "Make sure you put the amount you want to bet before the ping"
    );
    return;
  }

  if (giveAmount < 1) {
    message.reply("You cannot give less than one coin");
    return;
  }

  Users.update(
    { score: parseInt(receipt.score) + parseInt(giveAmount) },
    { where: { userId: receipt.userId } }
  ).catch(console.error);

  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Coins Printed")
    .addField(
      `${message.mentions.users.first().username}'s Balance (+)`,
      `${parseInt(receipt.score) + parseInt(giveAmount)}`,
      false
    );

  message.channel.send(embed);
};

let balance = async (message, user) => {
  if (message.mentions.users.first() == null) {
    let embed = new MessageEmbed()
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTitle(`${message.author.username}'s Balance`)
      .setDescription(`${message.author.username} has ${user.score} coins`);

    message.channel.send(embed);
    return;
  }

  message.mentions.users.forEach(async (messageUser) => {
    let mentionedUser = await Users.findOne({
      where: { userId: messageUser.id },
    });

    if (mentionedUser == null) {
      message.reply(
        `You cannot see \`${messageUser.username}'s\` balance as they have not use any gambling command before`
      );
    } else {
      let embed = new MessageEmbed()
        .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
        .setTitle(`${messageUser.username}'s Balance`)
        .setDescription(
          `${messageUser.username} has ${mentionedUser.score} coins`
        );

      message.channel.send(embed);
    }
  });
};

let claim = (message, user) => {
  if (!coinEvent.isUp) {
    message.channel.send("There is currently no ongoing coin event to claim!");
    return;
  }

  Users.update(
    { score: parseInt(user.score) + coinEvent.coinAmount },
    { where: { userId: message.author.id } }
  );

  let embed = new MessageEmbed()
    .setColor(`#00ff00`)
    .setThumbnail("https://i.imgur.com/hPCYkuG.gif")
    .setTitle("Random Coin Event")
    .addField(
      `${message.author.username} claimed ${coinEvent.coinAmount} coins!`,
      `They now have ${parseInt(user.score) + coinEvent.coinAmount} coins`,
      false
    );

  message.channel.messages.cache.get(coinEvent.messageId).edit(embed);
  coinEvent.isUp = false;
};

let coinEvent = {
  isUp: false,
  messageId: 0,
};

let randomCoinEvent = (client) => {
  let coinAmount = Math.floor(Math.random() * 50) + 26;

  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setThumbnail("https://i.imgur.com/hPCYkuG.gif")
    .setTitle("Random Coin Event")
    .setDescription(`Use \`~claim\` to win ${coinAmount} coins!`);

  client.channels.cache
    .get("735399594917363722")
    .send(embed)
    .then((message) => {
      coinEvent = { isUp: true, messageId: message.id, coinAmount };
    });
};

let challenge = async (message, args, user) => {
  message.reply("Big Sad");
};

let createUser = async (message) => {
  let user = await Users.create({
    userId: message.author.id,
    score: 100,
    dailyDate: new Date().getTime(),
    begDate: new Date().getTime(),
  });

  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(`${message.author.username} has registered with Tilda!`)
    .setThumbnail(message.author.displayAvatarURL())
    .addField("New Account Balance", `You currently have 100 coins`, false)
    .addField("Cooldown Status", "You have just received 100 coins, `~daily` and `~beg` are on cooldown")
    .setFooter(
      "Thank you for registering with Tilda",
      message.client.user.displayAvatarURL()
    );

  message.channel.send(embed);

  return user;
};

let getUser = async (userId) => {
  let user = await Users.findOne({ where: { userId } });
  let username = client.guilds.cache
    .get("735395621703385099")
    .members.cache.get(userId).user.username;

  if (!user) {
    user = await createUser(message);
    console.log(`Added <${user.userId}> ${username} to the database`);
  }

  return user;
};

module.exports = {
  sync,
  leaderboard,
  continueUser,
  getUser,
  randomCoinEvent,
  coinEvent
};
