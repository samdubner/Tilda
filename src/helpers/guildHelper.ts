const fs = require("fs");
const mongoose = require("mongoose");
const db = JSON.parse(fs.readFileSync("./token.json")).mongoURI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

import Guild from "../models/Guild"

//create a new guild document and save to DB then return the guild
const createGuild = async (guild) => {
  const newGuild = new Guild({
    guildId: guild.id,
  });

  await newGuild.save();
  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] Added ${
      guild.name
    } to Tilda's DB`
  );
  return newGuild;
};

//remove a guild from the DB
const removeGuild = async (guild) => {
  Guild.deleteOne({ guildId: guild.id }).then((res) =>
    console.log(`Deleted ${res.deletedCount} document(s)`)
  );

  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] Removed ${
      guild.name
    } from Tilda's DB`
  );
};

//set the bot channel of a given guild
//create a mew guild if one is not found
const setGuildChannel = async (channel) => {
  let guild = await Guild.findOne({ guildId: channel.guild.id });

  if (!guild) {
    guild = await createGuild(channel.guild);
  }

  guild.botChannelId = channel.id;
  guild.save();

  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] updated bot channel in ${
      channel.guild
    } to #${channel.name}`
  );
};

//compare if an interaction's channel matches a guild's bot channel and return the result
//create a new guild if one is not found
const verifyCommandChannel = async (interaction) => {
  let guild = await Guild.findOne({ guildId: interaction.guild.id });
  if (!guild) {
    guild = await createGuild(interaction.guild);
  }

  return guild.botChannelId == interaction.channelId;
};

module.exports = {
  createGuild,
  removeGuild,
  setGuildChannel,
  verifyCommandChannel,
};
