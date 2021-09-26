const mainGuildId = "881621682870190091";
const mainRoleId = "881627506908737546";

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
  "Sane",
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
  "Sexy"
];

const nouns = [
  "Server",
  "Madhouse",
  "Home",
  "Festival",
  "Boot Camp",
  "Hotel",
  "Mansion",
  "Resort",
  "Island",
  "Landfill",
  "Space Station",
  "Junkyard",
  "Haunted House",
  "Closet",
  "Dungeon"
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

  let randName = guild.members.cache.random().displayName;
  let randAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  let randNoun = nouns[Math.floor(Math.random() * nouns.length)];

  guild.setName(`${randName}'s ${randAdj} ${randNoun}`, "why not");
};

module.exports = {
  setActivity,
  randomizeRoleColor,
  randomizeServerName,
};