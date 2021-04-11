const Discord = require("discord.js");
const client = new Discord.Client();

const fs = require("fs");

const basic = require("./commands/basic");
const info = require("./commands/info");
const coin = require("./commands/coin");
const help = require("./commands/help");
const roles = require("./commands/roles");
const shop = require("./commands/shop");
const fish = require("./commands/fish");

const schedule = require("node-schedule");
const rule = new schedule.RecurrenceRule();
rule.hour = 0;

schedule.scheduleJob(rule, async () => {
  coin.bleedTopUser();
  coin.resetDailies();

  coin.notifyDailyReset(client);
});

client.on("ready", () => {
  console.log(`[${new Date().toLocaleTimeString("en-US")}] Tilda is online`);

  client.user.setActivity("with ~help").catch(console.error);

  client.guilds
    .fetch("735395621703385099")
    .then((guild) => {
      guild.roles.fetch("735395776967999515").then((role) => {
        setInterval(() => {
          role
            .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
            .catch(console.error);
          client.user.setActivity("with ~help").catch(console.error);
        }, 1000 * 60 * 60 * 12);
      });
    })
    .catch(() =>
      console.log("Main server not found... unable to change role colors")
    );

  setInterval(() => {
    if (Math.floor(Math.random() * 2) && !coin.coinEvent.isUp)
      coin.randomCoinEvent(client);
  }, 1000 * 60 * 60);
});

client.on("guildMemberAdd", (member) => {
  member.roles.add("735395776967999515");
  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] ${
      member.displayName
    } has joined the server`
  );
});

client.on("message", (message) => {
  if (
    message.channel.id == "735404269426966580" &&
    !["340002869912666114", "670849450599645218"].includes(message.author.id)
  ) {
    message
      .delete()
      .then((message) => {
        console.log(
          `[DELETED] ${message.author.username}#${message.author.discriminator} => ${message.content}`
        );
      })
      .catch(console.error);
    return;
  }

  let messageContent = message.content.split(" ");
  let command = messageContent[0].toLowerCase();

  if (message.author.bot || !command.startsWith("~")) return;

  let args = messageContent.slice(1).join(" ");

  const COMMANDS = {
    "~help": () => help.help(message),
    "~pfp": () => info.pfp(message),
    "~ui": () => info.ui(message),
    "~si": () => info.si(message),
    "~suggest": () => basic.suggest(message),
    "~8ball": () => basic.eightBall(message, args),
    "~roll": () => basic.roll(message, args),
    "~leaderboard": () => coin.leaderboard(message),
    "~l": () => COMMANDS["~leaderboard"](),
    "~flip": () => coin.continueUser(message, args, "flip"),
    "~f": () => COMMANDS["~flip"](),
    "~daily": () => coin.continueUser(message, args, "daily"),
    "~balance": () => coin.continueUser(message, args, "balance"),
    "~bal": () => COMMANDS["~balance"](),
    "~give": () => coin.continueUser(message, args, "give"),
    "~print": () => coin.continueUser(message, args, "print"),
    "~beg": () => coin.continueUser(message, args, "beg"),
    "~claim": () => coin.continueUser(message, args, "claim"),
    "~challenge": () => coin.continueUser(message, args, "challenge"),
    "~shop": () => shop.shopManager(message, args),
    "~c": () => COMMANDS["~fish"](),
    "~catch": () => COMMANDS["~fish"](),
    "~fish": () => fish.fishManager(message, args),
    "~role": () => roles.role(message, args),
    "~kill": () => basic.kill(client, message),
    "~update": () => basic.update(client, message),
  };

  if (COMMANDS[command]) {
    COMMANDS[command]();
  } else {
    message.reply(`\`${command}\` is not a valid command`);
  }
});

client.login(JSON.parse(fs.readFileSync("./token.json")).token);