const { Client, Collection, Intents } = require("discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
client.commands = new Collection();

const fs = require("fs");
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const commandData = require("./commandData")

const schedule = require("node-schedule");

const coin = require("./helpers/coinHelper");

const randomizeRoleColor = async () => {
  let guild;
  try {
    guild = await client.guilds.fetch("735395621703385099");
  } catch (e) {
    console.log("Main server not found... unable to change role colors");
    return;
  }
  const role = await guild.roles.fetch("735395776967999515");
  role.setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
};

schedule.scheduleJob("0 0 * * *", async () => {
  let topUsers = await coin.bleedTopUser();
  await coin.checkStreaks();
  coin.resetDailies();

  coin.notifyDailyReset(client, topUsers);
  coin.checkChampion(client, topUsers);
  randomizeRoleColor()
});

client.on("ready", async () => {
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // client.application.commands.create(command, "469659852109643786")
    client.commands.set(command.name, command);
  }

  console.log(`[${new Date().toLocaleTimeString("en-US")}] Tilda is online`);

//   setInterval(() => {
//     if (Math.floor(Math.random() * 2) && !coin.coinEvent.isUp)
//       coin.randomCoinEvent(client);
//   }, 1000 * 60 * 60 * 3);
// });

// client.on("guildMemberAdd", (member) => {
//   member.roles.add("735395776967999515");
//   console.log(
//     `[${new Date().toLocaleTimeString("en-US")}] ${
//       member.displayName
//     } has joined the server`
//   );
});

client.on("interactionCreate", async (interaction) => {
  console.log(interaction);

	if (!interaction.isCommand()) return;

	if (!client.commands.has(interaction.commandName)) return;

	try {
		await client.commands.get(interaction.commandName).execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
  // if (
  //   message.channel.id == "735404269426966580" &&
  //   !["340002869912666114", "670849450599645218"].includes(message.author.id)
  // ) {
  //   message
  //     .delete()
  //     .catch(console.error);
  //   return;
  // }

  // let messageContent = message.content.split(" ");
  // let command = messageContent[0].toLowerCase();

  // if (message.author.bot || !command.startsWith("~")) return;

  // let args = messageContent.slice(1).join(" ");

  // const COMMANDS = {
  //   "~help": () => help.help(message),
  //   "~pfp": () => basic.pfp(message),
  //   "~ui": () => basic.ui(message),
  //   "~si": () => basic.si(message),
  //   "~suggest": () => basic.suggest(message),
  //   "~8ball": () => basic.eightBall(message, args),
  //   "~roll": () => basic.roll(message, args),
  //   "~leaderboard": () => coin.leaderboard(message),
  //   "~l": () => COMMANDS["~leaderboard"](),
  //   "~flip": () => coin.continueUser(message, args, "flip"),
  //   "~f": () => COMMANDS["~flip"](),
  //   "~daily": () => coin.continueUser(message, args, "daily"),
  //   "~balance": () => coin.continueUser(message, args, "balance"),
  //   "~bal": () => COMMANDS["~balance"](),
  //   "~give": () => coin.continueUser(message, args, "give"),
  //   "~print": () => coin.continueUser(message, args, "print"),
  //   "~beg": () => coin.continueUser(message, args, "beg"),
  //   "~claim": () => coin.continueUser(message, args, "claim"),
  //   "~challenge": () => coin.continueUser(message, args, "challenge"),
  //   "~shop": () => shop.shopManager(message, args),
  //   "~c": () => COMMANDS["~catch"](),
  //   "~catch": () => fish.catchManager(message, args),
  //   "~fish": () => fish.fishManager(message, args),
  //   "~role": () => roles.role(message, args),
  //   "~kill": () => basic.kill(client, message),
  //   "~update": () => basic.update(client, message),
  //   "~room": () => room.channelManager(message, args),
  //   "~question": () => COMMANDS["~q"](),
  //   "~q": () => basic.question(message, args),
  //   "~response": () => COMMANDS["~r"](),
  //   "~r": () => basic.response(message)
  // };

  // if (COMMANDS[command]) {
  //   COMMANDS[command]();
  // } else {
  //   let embed = new Discord.MessageEmbed()
  //     .setColor(`#ff0000`)
  //     .setTitle(`Invalid Command`)
  //     .setDescription(`\`${messageContent[0]}\` is not a valid command`);

  //   message.reply(embed).catch(console.error);
  // }
});

client.login(JSON.parse(fs.readFileSync("./token.json")).token);
