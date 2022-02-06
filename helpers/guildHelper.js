const { MessageEmbed } = require("discord.js");

const fs = require("fs");
const mongoose = require("mongoose");
const db = JSON.parse(fs.readFileSync("./token.json")).mongoURI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

const Guild = require("../models/Guild");

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
};

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

const setGuildChannel = async (channel) => {
  let guild = await Guild.findOne({ guildId: channel.guild.id });
  guild.botChannelId = channel.id;
  guild.save();

  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] updated bot channel in ${
      channel.guild
    } to #${channel.name}`
  );
};

const verifyCommandChannel = async () => {
    
}

module.exports = { createGuild, removeGuild, setGuildChannel };
