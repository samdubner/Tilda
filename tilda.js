import { Client, MessageEmbed, MessageCollector } from "discord.js";
const client = new Client();

import fs from "fs"

import * as basic from "./commands/basic.js";
import * as info from "./commands/info.js";
import * as coin from "./commands/coin.js";
import help from "./commands/help.js";

client.on("ready", async () => {
  console.log(
    `[${
      new Date().getHours().toString().length == 1
        ? "0" + new Date().getHours().toString()
        : new Date().getHours()
    }:${
      new Date().getMinutes().toString().length == 1
        ? "0" + new Date().getMinutes().toString()
        : new Date().getMinutes()
    }:${
      new Date().getSeconds().toString().length == 1
        ? "0" + new Date().getSeconds().toString()
        : new Date().getSeconds()
    }] Tilda is online`
  );

  client.user.setActivity("with the mainframe");

  client.guilds.cache
    .get("735395621703385099")
    .roles.cache.get("735395776967999515")
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);

  client.guilds.cache
    .get("735395621703385099")
    .roles.cache.get("737364395776278541")
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);

  coin.sync();

  setInterval(() => {
    if (Math.floor(Math.random() * 2) && !coin.coinEvent.isUp)
      coin.randomCoinEvent(client);
  }, 3600000);
});

client.on("guildMemberAdd", (guildMember) => {
  guildMember.roles.add("735395776967999515");
});

client.on("guildBanAdd", (guild, user) => {
  let embed = new MessageEmbed()
    .setAuthor("Ban", guild.iconURL)
    .setColor(`#ff0000`)
    .setTitle(
      `**${user.username}#${user.discriminator}** has been banned from **${guild.name}**`
    );

  guild.channels.cache
    .get("735395621703385102")
    .send(embed)
    .catch(console.error);
});

client.on("message", async (message) => {
  if (
    message.channel.id == "735404269426966580" &&
    message.author.id != "340002869912666114" &&
    message.author.id != "670849450599645218"
  ) {
    console.log(
      `[DELETED] ${message.author.username}#${message.author.discriminator} => ${message.content}`
    );
    message.delete();
    return;
  }

  let command = message.content.toLowerCase().split(" ")[0];
  let args = message.content.split(" ").slice(1).join(" ");

  if (message.author.bot || !command.startsWith("~")) return;

  switch (command) {
    case "~suggest":
      basic.request(message, MessageEmbed);
      break;
    case "~help":
      help(message);
      break;
    case "~pfp":
      info.pfp(message, MessageEmbed);
      break;
    case "~ui":
      info.ui(message);
      break;
    case "~si":
      info.si(message);
      break;
    case "~8ball":
      basic.eightBall(message, args);
      break;
    case "~leaderboard":
    case "~l":
      coin.leaderboard(message);
      break;
    case "~flip":
    case "~f":
      coin.continueUser(message, args, "flip");
      break;
    case "~daily":
      coin.continueUser(message, args, "daily");
      break;
    case "~bal":
      coin.continueUser(message, args, "balance");
      break;
    case "~give":
      coin.continueUser(message, args, "give");
      break;
    case "~print":
      coin.continueUser(message, args, "print");
      break;
    case "~beg":
      coin.continueUser(message, args, "beg");
      break;
    case "~claim":
      coin.continueUser(message, args, "claim");
      break;
    default:
      message.reply("Please use a valid command");
  }
});

client.login(JSON.parse(fs.readFileSync('./token.json')).token);
