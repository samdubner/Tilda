const MAIN_GUILD_ID = "881621682870190091";
const MAIN_ROLE_ID = "881627506908737546";

const { MessageEmbed } = require("discord.js");
const fs = require("fs")

let strings = JSON.parse(fs.readFileSync('./helpers/strings.json'))

const ACTIVITIES = strings.activities

const NOUNS = strings.nouns
const ADJECTIVES = strings.adjectives

const User = require("../models/User");

const setActivity = async (client) => {
  client.user.setActivity(
    ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)],
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
  let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`
  role.setColor(color);
  return color
};

const randomizeServerName = async (client, color) => {
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

  let randAdj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  let randNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  let randServerName = `${randName}'s ${randAdj} ${randNoun}`;

  guild.setName(randServerName, "why not");

  let embed = new MessageEmbed()
    .setAuthor(`Updated Server Name`, guild.iconURL())
    .setColor(color)
    .setThumbnail(guild.iconURL)
    .setTitle(randServerName)
    .setDescription(`The default role color was also changed to \`${color}\``);

  let channel = await guild.channels.fetch("881621682870190094");
  channel.send({ embeds: [embed] });
};

module.exports = {
  setActivity,
  randomizeRoleColor,
  randomizeServerName,
};
