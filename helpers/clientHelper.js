const MAIN_GUILD_ID = "881621682870190091";
const MAIN_ROLE_ID = "881627506908737546";

const { MessageEmbed } = require("discord.js");

const User = require("../models/User");

const activities = [
  "all the coin flips",
  "everything that happens",
  "all the fun commands",
  "what /room does",
  "nothing at all",
  "how useful /help is",
  "over you",
  "all my new features be used",
];

const adjectives = [
  "Bussin",
  "Bustling",
  "Calm",
  "Contemporary",
  "Crazy",
  "Creepy",
  "Cringy",
  "Evil",
  "Fantastic",
  "Funny",
  "Gamer",
  "Huge",
  "Insane",
  "Lovely",
  "Quirky",
  "Sad",
  "Sexy",
  "Spooky",
  "Superior",
  "Sussy",
  "Toxic",
  "Wacky",
  "Wild",
  "Zesty",
];

const nouns = [
  "Bathroom",
  "Black Hole",
  "Boot Camp",
  "Closet",
  "Dungeon",
  "Festival",
  "Garden",
  "Haunted House",
  "Hotel",
  "House",
  "Hub",
  "Island",
  "Junkyard",
  "Kingdom",
  "Lair",
  "Madhouse",
  "Mansion",
  "Resort",
  "Room",
  "Prison",
  "Server",
  "Shack",
  "Space Station",
  "Supermarket",
];

const setActivity = async (client) => {
  client.user.setActivity(
    activities[Math.floor(Math.random() * activities.length)],
    { type: "WATCHING" }
  );
};

const randomizeRoleColor = async (client) => {
  let guild;
  try {
    guild = await client.guilds.fetch(MAIN_GUILD_ID);
  } catch (e) {
    console.log("Main server not found... unable to change role colors");
    return;
  }
  const role = await guild.roles.fetch(MAIN_ROLE_ID);
  role.setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
};

const randomizeServerName = async (client) => {
  let guild;
  try {
    guild = await client.guilds.fetch(MAIN_GUILD_ID);
  } catch (e) {
    console.log("Main server not found... unable to change server name");
    return;
  }

  let count = await User.countDocuments();
  let randUser = await User.findOne().skip(Math.floor(Math.random() * count));
  let member;
  try {
    member = await guild.members.fetch(randUser.userId);
  } catch (e) {
    member = await guild.members.fetch(randUser.userId);
  }
  let randName = member.user.username;

  let randAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  let randNoun = nouns[Math.floor(Math.random() * nouns.length)];
  let randServerName = `${randName}'s ${randAdj} ${randNoun}`;

  guild.setName(randServerName, "why not");

  let embed = new MessageEmbed()
    .setAuthor(`Updated Server Name`, client.user.avatarURL())
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setThumbnail(guild.iconURL)
    .setTitle(randServerName);

  let channel = await guild.channels.fetch("881621682870190094");
  channel.send({ embeds: [embed] });
};

module.exports = {
  setActivity,
  randomizeRoleColor,
  randomizeServerName,
};
