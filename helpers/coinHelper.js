const MessageEmbed = require("discord.js").MessageEmbed;

const fs = require("fs");
const mongoose = require("mongoose");
const db = JSON.parse(fs.readFileSync("./token.json")).mongoURI;

const MAIN_GUILD_ID = "881621682870190091";
const CHAMPION_ROLE_ID = "881626975649796097";
const PODIUM_ROLE_ID = "881627048014151730";

const MAIN_BOT_CHANNEL = "881622803449774090";
const TEST_BOT_CHANNEL = "469659852109643788";

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
    guildId == MAIN_GUILD_ID ? MAIN_BOT_CHANNEL : TEST_BOT_CHANNEL;

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

  user.score += coinEvent.coinAmount;
  user.save();

  let embed = new MessageEmbed()
    .setColor(`#00ff00`)
    .setThumbnail("https://i.imgur.com/hPCYkuG.gif")
    .setTitle("Coin Event Over")
    .addField(
      `${interaction.user.username} won the coin event and gained ${coinEvent.coinAmount} coins! :tada:`,
      `They now have ${user.score} coins`,
      false
    );

  let message = await interaction.channel.messages.fetch(coinEvent.messageId);
  message.edit({ embeds: [embed] }).catch(console.error);

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

    let currentChampion = await guild.members.fetch(topUsers.shift().userId);
    currentChampion.roles.add(CHAMPION_ROLE_ID);

    podiumRole.members.each((member) => {
      member.roles.remove(PODIUM_ROLE_ID);
    });

    for (let user of topUsers) {
      let podiumMember = await guild.members.fetch(user.userId);
      podiumMember.roles.add(PODIUM_ROLE_ID);
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
    .setFooter(
      "Thank you for registering with Tilda",
      interaction.client.user.displayAvatarURL()
    );

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
  getUser,
  claim,
};
