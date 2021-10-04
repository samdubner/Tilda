const mainGuildId = "881621682870190091";
const mainRoleId = "881627506908737546";

const User = require("../models/User");

const activities = [
  "all the coin flips",
  "everything that happens",
  "all the fun commands",
  "what /room does",
  "nothing at all",
  "how useful /help is",
  "over you",
];

const adjectives = [
  "Crazy",
  "Wild",
  "Wacky",
  "Huge",
  "Insane",
  "Gamer",
  "Fantastic",
  "Superior",
  "Calm",
  "Bustling",
  "Contemporary",
  "Toxic",
  "Bussin",
  "Quirky",
  "Sexy",
  "Love",
  "Lovely"
];

const nouns = [
  "Server",
  "Madhouse",
  "Home",
  "Festival",
  "Boot Camp",
  "Hotel",
  "Resort",
  "Mansion",
  "Room",
  "Island",
  "Hub",
  "Space Station",
  "Shack",
  "Junkyard",
  "Haunted House",
  "Closet",
  "Dungeon",
  "Black Hole"
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
    guild = await client.guilds.fetch(mainGuildId);
  } catch (e) {
    console.log("Main server not found... unable to change role colors");
    return;
  }
  const role = await guild.roles.fetch(mainRoleId);
  role.setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
};

const randomizeServerName = async (client) => {
  let guild;
  try {
    guild = await client.guilds.fetch(mainGuildId);
  } catch (e) {
    console.log("Main server not found... unable to change server name");
    return;
  }

  let count = await User.countDocuments()
  let randUser = await User.findOne().skip(Math.floor(Math.random() * count))
  let member = await guild.members.fetch(randUser.userId)
  let randName = member.user.username

  let randAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  let randNoun = nouns[Math.floor(Math.random() * nouns.length)];

  guild.setName(`${randName}'s ${randAdj} ${randNoun}`, "why not");
};

module.exports = {
  setActivity,
  randomizeRoleColor,
  randomizeServerName,
};
