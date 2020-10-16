const Discord = require("discord.js");
const client = new Discord.Client();

const fs = require("fs");

const basic = require("./commands/basic.js");
const info = require("./commands/info.js");
const coin = require("./commands/coin.js");
const help = require("./commands/help.js");

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
  let embed = new Discord.MessageEmbed()
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
      basic.request(message);
      break;
    case "~help":
      help.help(message);
      break;
    case "~pfp":
      info.pfp(message);
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
    case "~wiki":
      info.wikiSearch(message, args);
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
    case "~balance":
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
    case "~challenge":
    case "~c":
      coin.continueUser(message, args, "challenge");
      break;
    default:
      message.reply(`\`${command}\` is not a valid command`);
  }
});

client.login(JSON.parse(fs.readFileSync("./token.json")).token);
