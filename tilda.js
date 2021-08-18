const { Client, Collection, Intents } = require("discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
client.commands = new Collection();

const fs = require("fs");
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

const schedule = require("node-schedule");

const coin = require("./helpers/coinHelper");

/*
TODO:
make the ui command show activities
*/

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
  randomizeRoleColor();
});

client.on("ready", async () => {
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.application.commands.create(command, "469659852109643786"); //uncomment when adding new commands
    client.commands.set(command.name, command);
  }

  console.log(`[${new Date().toLocaleTimeString("en-US")}] Tilda is online`);

  //   setInterval(() => {
  //     if (Math.floor(Math.random() * 2) && !coin.coinEvent.isUp)
  //       coin.randomCoinEvent(client);
  //   }, 1000 * 60 * 60 * 3);
  // });
});

client.on("guildMemberAdd", (member) => {
  member.roles.add("735395776967999515");
  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] ${
      member.displayName
    } has joined the server`
  );
});

client.on("interactionCreate", async (interaction) => {
  if (
    interaction.channelId != "735404269426966580" &&
    !["340002869912666114", "670849450599645218"].includes(interaction.user.id)
  ) {
    interaction.reply({
      content: "You cannot use commands outside of the bot channel",
      ephemeral: true,
    });
    return;
  }

  if (!interaction.isCommand()) return;

  if (!client.commands.has(interaction.commandName)) return;

  try {
    await client.commands.get(interaction.commandName).execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }

  // const COMMANDS = {
  //   "~leaderboard": () => coin.leaderboard(message),
  //   "~flip": () => coin.continueUser(message, args, "flip"),
  //   "~daily": () => coin.continueUser(message, args, "daily"),
  //   "~balance": () => coin.continueUser(message, args, "balance"),
  //   "~give": () => coin.continueUser(message, args, "give"),
  //   "~print": () => coin.continueUser(message, args, "print"),
  //   "~beg": () => coin.continueUser(message, args, "beg"),
  //   "~claim": () => coin.continueUser(message, args, "claim"),
  //   "~challenge": () => coin.continueUser(message, args, "challenge"),
  //   "~shop": () => shop.shopManager(message, args),
  //   "~catch": () => fish.catchManager(message, args),
  //   "~fish": () => fish.fishManager(message, args),
  //   "~room": () => room.channelManager(message, args),
  // };
});

client.login(JSON.parse(fs.readFileSync("./token.json")).token);
