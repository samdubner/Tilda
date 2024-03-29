const MessageEmbed = require("discord.js").MessageEmbed;

const fs = require("fs");
const mongoose = require("mongoose");
const db = JSON.parse(fs.readFileSync("./token.json")).mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    console.log(
      `[${new Date().toLocaleTimeString("en-US")}] Connected to Tilda's DB`
    )
  )
  .catch((err) => console.log(err));

const User = require("../models/User");

let coinEvent = {
  isUp: false,
  messageId: 0,
};

const randomCoinEvent = async (client, guildId) => {
  let coinAmount = Math.floor(Math.random() * 50) + 51;

  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setThumbnail("https://i.imgur.com/hPCYkuG.gif")
    .setTitle("Random Coin Event")
    .setDescription(`Use \`/claim\` to win ${coinAmount} coins!`);

  let channelId =
    guildId == "735395621703385099"
      ? "735399594917363722"
      : "469659852109643788";

  let botChannel = await client.channels.resolve(channelId);

  botChannel
    .send({ embeds: [embed] })
    .then((message) => {
      coinEvent = { isUp: true, messageId: message.id, coinAmount };
      console.log(
        `[${new Date().toLocaleTimeString(
          "en-US"
        )}] Generated new coin event for ${coinAmount} coins`
      );
    })
    .catch(console.error);

  setTimeout(() => {
    if (coinEvent.isUp) {
      let embed = new MessageEmbed()
        .setColor(`#ff0000`)
        .setThumbnail("https://i.imgur.com/hPCYkuG.gif")
        .setTitle("Expired Coin Event")
        .setDescription(
          `This coin event has expired and can no longer be claimed!`
        );

      coinEvent.isUp = false;

      botChannel.messages.cache
        .get(coinEvent.messageId)
        .edit({ embeds: [embed] });
    }
  }, 1000 * 60 * 60);
};

const claim = (interaction, user) => {
  if (!coinEvent.isUp) {
    let embed = new MessageEmbed()
      .setColor(`#ff0000`)
      .setTitle(
        `${interaction.member.displayName}, there is currently no ongoing coin event to be claimed :(`
      );

    return false;
  }

  user.score += coinEvent.coinAmount;
  user.save();

  let embed = new MessageEmbed()
    .setColor(`#00ff00`)
    .setThumbnail("https://i.imgur.com/hPCYkuG.gif")
    .setTitle("Random Coin Event")
    .addField(
      `${interaction.user.username} claimed ${coinEvent.coinAmount} coins!`,
      `They now have ${user.score} coins`,
      false
    );

  interaction.channel.messages.cache
    .get(coinEvent.messageId)
    .edit({ embeds: [embed] })
    .catch(console.error);
  coinEvent.isUp = false;

  return true;
};

const bleedTopUser = async () => {
  let topUsers = await User.find()
    .sort([["score", -1]])
    .limit(3);
  let currentTopUser = topUsers[0];

  if (currentTopUser.score > 5) {
    currentTopUser.score = Math.floor(
      currentTopUser.score - currentTopUser.score * 0.05
    );
    console.log(
      `[${new Date().toLocaleTimeString("en-US")}] current top user now has ${
        currentTopUser.score
      } coins`
    );
    currentTopUser.save();
  }

  return topUsers;
};

const checkStreaks = async () => {
  await User.updateMany({ dailyDone: false }, { streak: 0 });
};

const resetDailies = async () => {
  await User.updateMany({}, { dailyDone: false });
};

const notifyDailyReset = async (client, topUsers) => {
  let member = await client.users.fetch(topUsers[0].userId);

  client.channels
    .fetch("735399594917363722")
    .then((channel) => {
      let embed = new MessageEmbed()
        .setColor("#00ff00")
        .setTitle(`Dailies have been reset!`)
        .setDescription(`${member.username} has also misplaced some coins...`)
        .setThumbnail("https://i.imgur.com/hPCYkuG.gif");

      channel.send(embed).catch(console.error);
    })
    .catch(() =>
      console.log(
        "Channel wasn't able to be found, daily reset notification not sent"
      )
    );
};

const checkChampion = async (client, topUsers) => {
  try {
    let guild = await client.guilds.fetch("735395621703385099");

    await guild.members.fetch();
    let championRole = await guild.roles.fetch("832069903703998505");
    let podiumRole = await guild.roles.fetch("834173402016645130");
    let currentChampion = championRole.members.first();

    let leadUser = topUsers[0];
    let podiumUsers = topUsers.slice(1).map((user) => user.userId);

    if (!currentChampion || currentChampion.id != leadUser.userId) {
      currentChampion.roles.remove(championRole.id);

      let newChampion = await guild.members.fetch(leadUser.userId);
      newChampion.roles.add(championRole.id);
    }

    podiumRole.members.each((member) => {
      if (!podiumUsers.includes(member.id)) member.roles.remove(podiumRole.id);
    });

    for (let podiumWinner of podiumUsers) {
      let podiumMember = await guild.members.fetch(podiumWinner);
      podiumMember.roles.add(podiumRole.id);
    }
  } catch (e) {
    console.log("Main server not found... unable to change coin roles");
  }
};

const createUser = async (interaction) => {
  const newUser = new User({
    userId: interaction.user.id,
    score: 100,
    streak: 0,
    dailyDone: true,
    begDate: new Date().getTime(),
  });

  newUser.save().catch(console.error);

  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] Added <${newUser.userId}> ${
      interaction.user.username
    } to the coin collection`
  );

  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(`${user.username} has registered with Tilda!`)
    .setThumbnail(user.displayAvatarURL())
    .addField("New Account Balance", `You currently have 100 coins`, false)
    .addField(
      "Cooldown Status",
      "You have just received 100 coins, `~daily` and `~beg` are on cooldown"
    )
    .setFooter(
      "Thank you for registering with Tilda",
      user.client.user.displayAvatarURL()
    );

  interaction.reply(embed);

  return newUser;
};

//check to see if the person using a command has registered
const checkInteraction = async (interaction) => {
  let user = await User.findOne({ userId: interaction.user.id });

  if (!user) {
    user = await createUser(interaction);
  }

  return user;
};

//used to check if users in an argument have registered
const checkUser = async (user) => {
  let check = await User.findOne({ userId: user.id });

  return !!check;
};

module.exports = {
  coinEvent,
  randomCoinEvent,
  bleedTopUser,
  checkStreaks,
  resetDailies,
  notifyDailyReset,
  checkChampion,
  createUser,
  checkInteraction,
  checkUser,
  claim,
};
