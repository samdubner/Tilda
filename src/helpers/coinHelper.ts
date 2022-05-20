import { MessageEmbed } from "discord.js";

import * as fs from "fs";
import * as mongoose from "mongoose";
const db = JSON.parse(fs.readFileSync("./token.json").toString()).mongoURI;

const MAIN_GUILD_ID = "881621682870190091";
const MAIN_BOT_CHANNEL = "881622803449774090";

const CHAMPION_ROLE_ID = "881626975649796097";
const PODIUM_ROLE_ID = "881627048014151730";

mongoose
  .connect(db)
  .then(() =>
    console.log(
      `[${new Date().toLocaleTimeString("en-US")}] Connected to Tilda's DB`
    )
  )
  .catch((err) => console.log(err));

import User from "../models/User";

interface CoinEvent {
  isUp: boolean;
  messageId: string;
  startingAmount: number;
  currentAmount: number;
}

let coinEvent: CoinEvent = {
  isUp: false,
  messageId: "",
  startingAmount: 0,
  currentAmount: 0,
};
let eventInterval;

const randomCoinEvent = async (client) => {
  let startingAmount = Math.floor(Math.random() * 150) + 51;

  let embed = new MessageEmbed()
    .setColor(`#00ff00`)
    .setThumbnail("https://i.imgur.com/hPCYkuG.gif")
    .setTitle("Random Coin Event")
    .setDescription(`Use \`/claim\` to win ${startingAmount} coins!`);

  let botChannel = await client.channels.fetch(MAIN_BOT_CHANNEL);

  botChannel
    .send({ embeds: [embed] })
    .then((message) => {
      coinEvent = {
        isUp: true,
        messageId: message.id,
        startingAmount,
        currentAmount: startingAmount,
      };
      console.log(
        `[${new Date().toLocaleTimeString(
          "en-US"
        )}] Generated new coin event for ${startingAmount} coins`
      );
    })
    .catch(console.error);

  eventInterval = setInterval(() => {
    coinEvent.currentAmount -= Math.floor(Math.random() * 15) + 5;

    let percentLeft = Math.trunc(
      (coinEvent.currentAmount / coinEvent.startingAmount) * 100
    );

    let redVal = Math.min(255, (100 - percentLeft) * 2.56);
    let greenVal = Math.min(255, percentLeft * 2.56);

    if (coinEvent.currentAmount > 0) {
      let embed = new MessageEmbed()
        .setColor([redVal, greenVal, 0])
        .setThumbnail("https://i.imgur.com/hPCYkuG.gif")
        .setTitle("Random Coin Event")
        .setDescription(
          `Use \`/claim\` to win ${coinEvent.currentAmount} coins!`
        );

      botChannel.messages.cache
        .get(coinEvent.messageId)
        .edit({ embeds: [embed] });
    } else if (coinEvent.isUp) {
      let embed = new MessageEmbed()
        .setColor(`#ff0000`)
        .setThumbnail("https://i.imgur.com/hPCYkuG.gif")
        .setTitle("Expired Coin Event")
        .setDescription(
          `This coin event has expired and can no longer be claimed!`
        );

      botChannel.messages.cache
        .get(coinEvent.messageId)
        .edit({ embeds: [embed] });

      coinEvent = {
        isUp: false,
        startingAmount: 0,
        currentAmount: 0,
        messageId: "",
      };

      clearInterval(eventInterval);
    }
  }, 1000 * 60 * 15);
};

const claim = async (interaction, user) => {
  if (!coinEvent.isUp) {
    let embed = new MessageEmbed()
      .setColor(`#ff0000`)
      .setTitle(
        `${interaction.member.displayName}, there is currently no ongoing coin event to be claimed :(`
      );

    interaction.editReply({ embeds: [embed], ephemeral: true });
    return false;
  }

  user.score += coinEvent.currentAmount;
  user.save();

  let embed = new MessageEmbed()
    .setColor(`#00ff00`)
    .setThumbnail("https://i.imgur.com/hPCYkuG.gif")
    .setTitle("Coin Event Over")
    .addField(
      `${interaction.user.username} won the coin event and gained ${coinEvent.currentAmount} coins! :tada:`,
      `They now have ${user.score} coins`,
      false
    );

  let message = await interaction.channel.messages.fetch(coinEvent.messageId);
  message.edit({ embeds: [embed] }).catch(console.error);

  coinEvent = {
    isUp: false,
    startingAmount: 0,
    currentAmount: 0,
    messageId: "",
  };
  clearInterval(eventInterval);

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

  try {
    let channel = await client.channels.fetch(MAIN_BOT_CHANNEL);

    let embed = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle(`Dailies have been reset!`)
      .setDescription(`${member.username} has also misplaced some coins...`)
      .setThumbnail("https://i.imgur.com/hPCYkuG.gif");

    channel.send({ embeds: [embed] }).catch(console.error);
  } catch (e) {
    console.log(
      "Channel wasn't able to be found, daily reset notification not sent"
    );
  }
};

const checkChampion = async (client, topUsers) => {
  try {
    let guild = await client.guilds.fetch(MAIN_GUILD_ID);

    await guild.members.fetch();

    let championRole = await guild.roles.fetch(CHAMPION_ROLE_ID);
    let podiumRole = await guild.roles.fetch(PODIUM_ROLE_ID);

    championRole.members.each((member) => {
      member.roles.remove(CHAMPION_ROLE_ID);
    });

    guild.members
      .fetch(topUsers.shift().userId)
      .then((currentChampion) => currentChampion.roles.add(CHAMPION_ROLE_ID))
      .catch(console.error);

    podiumRole.members.each((member) => {
      member.roles.remove(PODIUM_ROLE_ID);
    });

    for (let user of topUsers) {
      guild.members
        .fetch(user.userId)
        .then((podiumMember) => podiumMember.roles.add(PODIUM_ROLE_ID))
        .catch(console.error);
    }
  } catch (e) {
    console.log(e);
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
    inMainGuild: interaction.guildId == MAIN_GUILD_ID,
    notifyStatus: true,
  });

  await newUser.save().catch(console.error);

  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] Added <${newUser.userId}> ${
      interaction.user.username
    } to the coin collection`
  );

  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(`${interaction.user.username} has registered with Tilda!`)
    .setThumbnail(interaction.user.displayAvatarURL())
    .addField("New Account Balance", `You currently have 100 coins`, false)
    .addField(
      "Cooldown Status",
      "You have just received 100 coins, `/daily` and `/beg` are on cooldown"
    )
    .setFooter({
      text: "Thank you for registering with Tilda",
      iconURL: interaction.client.user.displayAvatarURL(),
    });

  interaction.channel.send({ embeds: [embed] });

  return newUser;
};

const getUser = async (userId) => {
  let user = await User.findOne({ userId });

  if (!user) return false;
  return user;
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

const notifyUsers = async (client) => {
  let users = await User.find({ dailyDone: false, streak: { $gt: 0 } });

  let embed; 


  for (let user of users) {
    let member = await client.users.fetch(user.userId);

    embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(`Don't forget to use /daily!`)
    .addField("Current Streak Status", `You currently have a ${user.streak} day streak`, false)
    .setFooter({
      text: "Thank you for using Tilda",
      iconURL: client.user.displayAvatarURL(),
    });

    member
      .send("Don't forget to do your dailies before your streak expires!")
      .catch(console.error);
  }
};

export default {
  randomCoinEvent,
  bleedTopUser,
  checkStreaks,
  resetDailies,
  notifyDailyReset,
  checkChampion,
  createUser,
  checkInteraction,
  checkUser,
  getUser,
  claim,
  notifyUsers,
};
