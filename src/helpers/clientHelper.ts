const MAIN_GUILD_ID = "881621682870190091";
const PERSON_ROLE_ID = "881627506908737546";
const GENERAL_CHANNEL_ID = "881621682870190094";

import User from "../models/User";
import * as fs from "fs";

//store random strings in another file
let strings = JSON.parse(fs.readFileSync("./src/helpers/strings.json").toString());
const ACTIVITIES = strings.activities;
const NOUNS = strings.nouns;
const ADJECTIVES = strings.adjectives;

//set the bot's activity to a random string
const setActivity = async (client) => {
  client.user.setActivity(
    ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)],
    { type: "WATCHING" }
  );
};

//randomize the role color in the bot's main server
const randomizeRoleColor = async (client) => {
  let guild;
  try {
    guild = await client.guilds.fetch(MAIN_GUILD_ID);
  } catch (e) {
    console.log("Main server not found... unable to change role colors");
    return;
  }
  const role = await guild.roles.fetch(PERSON_ROLE_ID);
  let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  await role.setColor(color);
};

//randomize the server in the bot's main server
const randomizeServerName = async (client) => {
  let guild;
  try {
    guild = await client.guilds.fetch(MAIN_GUILD_ID);
  } catch (e) {
    console.log("Main server not found... unable to change server name");
    return;
  }

  let users = await User.find({ inMainGuild: true });
  let randUser = users[Math.floor(Math.random() * users.length)];
  let member = await guild.members.fetch(randUser.userId);

  let randAdj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  let randNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)];

  let randServerName = `${member.user.username}'s ${randAdj} ${randNoun}`;
  guild.setName(randServerName);

  let guildRole = await guild.roles.fetch(PERSON_ROLE_ID);
  let color = guildRole.hexColor;

  let embed = new MessageEmbed()
    .setAuthor({ name: `Updated Server Name`, iconURL: guild.iconURL() })
    .setColor(color)
    .setThumbnail(guild.iconURL)
    .setTitle(randServerName)
    .setDescription(
      `The <@&${PERSON_ROLE_ID}> role color was also changed to \`${color}\``
    );

  let channel = await guild.channels.fetch(GENERAL_CHANNEL_ID);
  channel.send({ embeds: [embed] });
};

module.exports = {
  setActivity,
  randomizeRoleColor,
  randomizeServerName,
};
