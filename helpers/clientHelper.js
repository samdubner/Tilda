const activities = [
  "all the coin flips",
  "everything that happens",
  "all the fun commands",
  "what /room does",
  "nothing at all",
  "how useful /help is",
  "over you"
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
    guild = await client.guilds.fetch("881621682870190091");
  } catch (e) {
    console.log("Main server not found... unable to change role colors");
    return;
  }
  const role = await guild.roles.fetch("881627506908737546");
  role.setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
};

module.exports = {
  setActivity,
  randomizeRoleColor
}