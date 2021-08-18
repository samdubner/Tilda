const MessageEmbed = require("discord.js").MessageEmbed;

const warnWrongChannel = (message) => {
  let embed = new Discord.MessageEmbed()
    .setColor(`#ff0000`)
    .setTitle(`Invalid Channel`)
    .setDescription("Please only use coin commands in <#735399594917363722>");

  message.reply(embed).catch(console.error);
};

const leaderboard = async (message) => {
  if (
    message.channel.id != "735399594917363722" &&
    message.author.id != "340002869912666114"
  ) {
    warnWrongChannel(message);
    return;
  }

  let userList = await User.find()
    .sort([["score", -1]])
    .limit(10);
  let members = await message.guild.members.fetch();
  userList = userList.filter(
    (user) => message.guild.member(user.userId) != undefined
  );
  userList = userList.slice(0, 5);

  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Coin Leaderboard")
    .setThumbnail("https://i.imgur.com/hPCYkuG.gif");

  let i = 1;
  for (let user of userList) {
    if (user.score == userList[0].score) {
      if (members.get(user.userId) != undefined) {
        embed.addField(
          `${1}) ${members.get(user.userId).user.username}`,
          ` 🎉 ${user.score} 🎉`,
          false
        );
      }
    } else {
      if (members.get(user.userId) != undefined) {
        embed.addField(
          `${i}) ${members.get(user.userId).user.username}`,
          user.score,
          false
        );
      }
    }
    i++;
  }

  message.channel.send(embed).catch(console.error);
};

const continueUser = async (message, args, type) => {
  if (
    message.channel.id != "735399594917363722" &&
    message.author.id != "340002869912666114" &&
    message.author.id != "171330866189041665" &&
    message.author.id != "385991322693009421"
  ) {
    warnWrongChannel();
    return;
  }

  let user = await User.findOne({ userId: message.author.id });

  if (!user) {
    user = await createUser(message);
    return;
  }

  for (let mentionedUser of message.mentions.users) {
    let dbUser = await User.findOne({ userId: mentionedUser[0] });

    if (!dbUser) {
      message.reply(
        `${mentionedUser[1].username} is not yet registered with tilda, they cannot use any coin commands!`
      );
      return;
    }
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

const sendErrorMessage = (message, error) => {
  let embed = new MessageEmbed()
    .setColor(`#ff0000`)
    .setTitle(`Argument Error`)
    .setDescription(error);

  message.reply(embed).catch(console.error);
};

const flip = (message, args, user) => {
  let flipResult = Math.floor(Math.random() * 2);
  let bet = Math.ceil(args.split(" ")[0]);

  args = args.toLowerCase();

  if (user.score == 0) {
    sendErrorMessage(
      message,
      "You need more coins before you can bet again, try using ~daily or ~beg"
    );
    return;
  }

  if (bet <= 0) {
    sendErrorMessage(
      message,
      "You cannot bet a number of coins less than or equal to zero"
    );
    return;
  }

  if (bet > user.score) {
    sendErrorMessage(
      message,
      "That bet is too large, please try again with a smaller bet"
    );
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

  let totalCoins;
  let totalCoinsVariation;

  let coinVariation;

  if (flipResult) {
    totalCoins = parseInt(user.score) + parseInt(scoreWon);
    coinVariation = scoreWon == 1 ? "coin" : "coins";
    totalCoinsVariation = totalCoins == 1 ? "coin" : "coins";
    let embed = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle(`${message.author.username} won ${scoreWon} ${coinVariation}!`)
      .setDescription(`They now have ${totalCoins} ${totalCoinsVariation}`)
      .setThumbnail("https://i.imgur.com/hPCYkuG.gif");
    message.reply(embed);
    scoreWon = bet;
  } else {
    totalCoins = parseInt(user.score) - parseInt(scoreWon);
    coinVariation = scoreWon == 1 ? "coin" : "coins";
    totalCoinsVariation = totalCoins == 1 ? "coin" : "coins";
    let embed = new MessageEmbed()
      .setColor("#ff0000")
      .setTitle(`${message.author.username} lost ${scoreWon} ${coinVariation}`)
      .setDescription(`They now have ${totalCoins} ${totalCoinsVariation}`)
      .setThumbnail("https://i.imgur.com/hPCYkuG.gif");
    message.reply(embed);
    scoreWon = bet * -1;
  }

  User.updateOne(
    { userId: message.author.id },
    { score: parseInt(user.score) + parseInt(scoreWon) }
  ).catch(console.error);
};

const daily = (message, user) => {
  let dailyDone = user.dailyDone;

  if (dailyDone) {
    let currentDate = new Date();
    let hours = 23 - currentDate.getHours();
    let hourText = hours == 1 ? "hour" : "hours";
    let minutes = 59 - currentDate.getMinutes();
    let minuteText = minutes == 1 ? "minute" : "minutes";

    let embed = new MessageEmbed()
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTitle(`You already got your daily today!`)
      .setDescription(
        `Daily will reset in ${hours} ${hourText} and ${minutes} ${minuteText}`
      )
      .setThumbnail("https://i.imgur.com/PRhGygj.jpg");

    message.reply(embed).catch(console.error);
    return;
  }

  user.streak++;
  let streakBonus = user.streak * 10;
  if (streakBonus > 200) streakBonus = 200;
  let totalDaily = 100 + streakBonus;

  User.updateOne(
    { userId: message.author.id },
    {
      score: parseInt(user.score) + totalDaily,
      dailyDone: true,
      streak: user.streak,
    }
  ).catch(console.error);

  let embed = new MessageEmbed()
    .setColor(`#00ff00`)
    .setTitle(`${message.author.username} got ${totalDaily} coins!`)
    .setDescription(`They now have ${user.score + totalDaily} coins`)
    .setFooter(`Daily Streak: ${user.streak} days`)
    .setThumbnail("https://i.imgur.com/PRhGygj.jpg");

  message.reply(embed).catch(console.error);
};

const beg = (message, user) => {
  let checkDate = user.begDate;
  let begTimer = new Date().getTime() - 10 * 60 * 1000;

  if (begTimer < checkDate) {
    let seconds = Math.trunc(((checkDate - begTimer) / 1000) % 60);
    let minutes = Math.trunc(((checkDate - begTimer) / 60000) % 60);
    let embed = new MessageEmbed()
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTitle(`You've already begged too recently!`)
      .setDescription(
        `You can beg in ${minutes} ${
          minutes == 1 ? "minute" : "minutes"
        } and ${seconds} ${seconds == 1 ? "second" : "seconds"}`
      )
      .setThumbnail("https://i.imgur.com/PRhGygj.jpg");
    message.reply(embed);
    return;
  }

  User.updateOne(
    { userId: message.author.id },
    { score: parseInt(user.score) + 10, begDate: new Date().getTime() }
  ).catch(console.error);

  let embed = new MessageEmbed()
    .setColor(`#00ff00`)
    .setTitle(`${message.author.username} got 10 coins!`)
    .setDescription(`They now have ${user.score + 10} coins`)
    .setThumbnail("https://i.imgur.com/PRhGygj.jpg");

  message.reply(embed);
};

const give = async (message, args, sender) => {
  let receipt = await User.findOne({
    userId: message.mentions.users.first().id,
  }).catch(console.error);

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
    message.reply("You cannot give yourself coins");
    return;
  }

  User.updateOne(
    { userId: sender.userId },
    { score: parseInt(sender.score) - parseInt(giveAmount) }
  ).catch(console.error);

  User.updateOne(
    { userId: receipt.userId },
    { score: parseInt(receipt.score) + parseInt(giveAmount) }
  ).catch(console.error);

  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Coin Transfer")
    .addField(
      `${message.author.username}'s Balance (-${giveAmount})`,
      `${parseInt(sender.score) - parseInt(giveAmount)}`,
      false
    )
    .addField(
      `${message.mentions.users.first().username}'s Balance (+${giveAmount})`,
      `${parseInt(receipt.score) + parseInt(giveAmount)}`,
      false
    );

  message.channel.send(embed);
};

const print = async (message, args) => {
  if (message.author.id != "340002869912666114") {
    let embed = new MessageEmbed()
      .setColor(`#ff0000`)
      .setTitle("You cannot use this command.");

    message.channel.send(embed);
    return;
  }

  let receipt = await User.findOne({
    userId: message.mentions.users.first().id,
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

  User.updateOne(
    { userId: receipt.userId },
    { score: parseInt(giveAmount) }
  ).catch(console.error);

  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Coins Printed")
    .addField(
      `${message.mentions.users.first().username}'s Balance (+)`,
      `${parseInt(giveAmount)}`,
      false
    );

  message.channel.send(embed);
};

const balance = async (message, user) => {
  let coinVariation;
  if (message.mentions.users.first() == null) {
    coinVariation = user.score == 1 ? "coin" : "coins";
    let embed = new MessageEmbed()
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTitle(`${message.author.username}'s Balance`)
      .setDescription(
        `${message.author.username} has ${user.score} ${coinVariation}`
      );

    message.channel.send(embed);
    return;
  }

  message.mentions.users.forEach(async (messageUser) => {
    let mentionedUser = await User.findOne({ userId: messageUser.id });

    if (mentionedUser == null) {
      message.reply(
        `You cannot see \`${messageUser.username}'s\` balance as they have not use any coin command before`
      );
    } else {
      coinVariation = mentionedUser.score == 1 ? "coin" : "coins";
      let embed = new MessageEmbed()
        .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
        .setTitle(`${messageUser.username}'s Balance`)
        .setDescription(
          `${messageUser.username} has ${mentionedUser.score} ${coinVariation}`
        );

      message.channel.send(embed);
    }
  });
};

const claim = (message, user) => {
  if (!coinEvent.isUp) {
    let embed = new MessageEmbed()
      .setColor(`#ff0000`)
      .setTitle(
        `${message.member.displayName}, there is currently no ongoing coin event to be claimed :(`
      );

    message.reply(embed).catch(console.error);
    return;
  }

  User.updateOne(
    { userId: message.author.id },
    { score: parseInt(user.score) + coinEvent.coinAmount }
  ).catch(console.error);

  let embed = new MessageEmbed()
    .setColor(`#00ff00`)
    .setThumbnail("https://i.imgur.com/hPCYkuG.gif")
    .setTitle("Random Coin Event")
    .addField(
      `${message.author.username} claimed ${coinEvent.coinAmount} coins!`,
      `They now have ${parseInt(user.score) + coinEvent.coinAmount} coins`,
      false
    );

  message.channel.messages.cache
    .get(coinEvent.messageId)
    .edit(embed)
    .catch(console.error);
  coinEvent.isUp = false;
};

const challenge = async (message, args, user) => {
  let entryPrice = args.split(" ")[0];
  let unconfirmed = 0;
  let users = [user];

  if (entryPrice <= 0) {
    message.reply("You cannot set an entry of less than or equal to zero");
    return;
  }

  if (entryPrice > user.score) {
    message.reply(
      "That entry price is too large, please try again with a smaller amonut of coins"
    );
    return;
  }

  if (
    entryPrice == null ||
    entryPrice == undefined ||
    isNaN(entryPrice) ||
    entryPrice == ""
  ) {
    message.reply(
      "You must set an entry price with a valid amount, please try again with a valid number"
    );
    return;
  }

  message.mentions.users.forEach(async (mentionedUser) => {
    if (mentionedUser.id != message.author.id && !message.author.bot) {
      let dbUser = await User.findOne({
        userId: mentionedUser.id,
      });

      if (dbUser.score < entryPrice) {
        message.channel.send(
          `${mentionedUser.username} has less than ${entryPrice} coins, they cannot accept this challenge!` +
            `\nMaybe try creating a new challenge with a lower entry price?`
        );
        return;
      }

      unconfirmed++;
      message.channel.send(
        `${mentionedUser.username}, respond \`yes\` to accept ${message.author.username}'s challenge for \`${entryPrice}\` coins!`
      );
      const filter = (m) => m.author.id == mentionedUser.id;
      message.channel
        .awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] })
        .then(async (messages) => {
          let response = messages.first();
          if (response.content.toLowerCase() != "yes") {
            message.channel.send(
              `${mentionedUser.username} has rejected ${message.author.username}'s challenge!`
            );
            return;
          }

          unconfirmed--;

          users.push(dbUser);

          if (unconfirmed == 0) {
            challengeCountdown(message, users, entryPrice);
          }
        })
        .catch(() => {
          message.channel.send(
            `${mentionedUser.username} did not accept the challenge in time!`
          );
        });
    }
  });
};

const challengeCountdown = (message, users, entryPrice) => {
  let pool = 0;

  for (let user of users) {
    User.updateOne(
      { userId: user.userId },
      { score: parseInt(user.score) - parseInt(entryPrice) }
    ).catch(console.error);
    pool += parseInt(entryPrice);
  }

  message.channel.send(`Everyone has accepted, challenge is starting now!`);
  message.channel.send(
    `I will ask a basic math question and the first person to get it right wins all the coins!`
  );

  let num1 = Math.floor(Math.random() * 100) + 1;
  let num2 = Math.floor(Math.random() * 100) + 1;
  let ans = num1 + num2;

  let i = 3;
  let interval = setInterval(() => {
    if (i != 0) {
      message.channel.send(`${i}...`);
      i--;
    } else {
      message.channel.send(`\`${num1}\` + \`${num2}\` is equal to what?`);
      catchResponse(message, pool, users, ans);
      clearInterval(interval);
    }
  }, 1000);
};

const catchResponse = (message, prizePool, users, ans) => {
  let ids = users.map((user) => user.userId);
  const filter = (m) => m.content == ans && ids.includes(m.author.id);

  message.channel
    .awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] })
    .then((collected) => {
      let res = collected.first();
      res.react("🌟");
      message.channel.send(
        `${res.author.username} got the correct answer with ${ans}, they win ${prizePool} coins!`
      );

      let winner = users.filter((user) => user.userId == res.author.id)[0];

      User.updateOne(
        { userId: res.author.id },
        { score: parseInt(winner.score) + parseInt(prizePool) }
      ).catch(console.error);
    })
    .catch(() => {
      message.channel.send("Nobody got the problem correct in time :(");
    });
};

const createUser = async (message) => {
  const newUser = new User({
    userId: message.author.id,
    score: 100,
    streak: 0,
    dailyDone: true,
    begDate: new Date().getTime(),
  });

  newUser.save().catch(console.error);

  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] Added <${newUser.userId}> ${
      message.author.username
    } to the coin collection`
  );

  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(`${message.author.username} has registered with Tilda!`)
    .setThumbnail(message.author.displayAvatarURL())
    .addField("New Account Balance", `You currently have 100 coins`, false)
    .addField(
      "Cooldown Status",
      "You have just received 100 coins, `~daily` and `~beg` are on cooldown"
    )
    .setFooter(
      "Thank you for registering with Tilda",
      message.client.user.displayAvatarURL()
    );

  message.channel.send(embed);

  return newUser;
};

const getUser = async (userId) => {
  let user = await Users.findOne({ userId });
  let username = client.guilds.cache
    .get("735395621703385099")
    .members.cache.get(userId).user.username;

  if (!user) {
    user = await createUser(message);
    console.log(
      `[${new Date().toLocaleTimeString("en-US")}] Added <${
        user.userId
      }> ${username} to the database`
    );
  }

  return user;
};

module.exports = {
  leaderboard,
  continueUser,
  getUser,
};