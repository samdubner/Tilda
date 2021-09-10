const { Client, Collection, Intents, MessageEmbed } = require("discord.js");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});
client.commands = new Collection();

const fs = require("fs");

const mainCommands = fs
  .readdirSync("./mainCommands")
  .filter((file) => file.endsWith(".js"));
const musicCommands = fs
  .readdirSync("./musicCommands")
  .filter((file) => file.endsWith(".js"));

const commandFiles = mainCommands.concat(musicCommands);

const schedule = require("node-schedule");

const coin = require("./helpers/coinHelper");

const activities = [
  "all the coin flips",
  "everything that happens",
  "all the fun commands",
  "what /room does",
];

const randomizeRoleColor = async () => {
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

const setActivity = async () => {
  client.user.setActivity(
    activities[Math.floor(Math.random() * activities.length)],
    { type: "WATCHING" }
  );
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
  const guildId =
    client.user.id == "670849450599645218"
      ? "881621682870190091"
      : "469659852109643786";
  const mainGuild = await client.guilds.fetch(guildId);

  for (let file of commandFiles) {
    let command;
    try {
      command = require(`./mainCommands/${file}`);
    } catch (e) {
      command = require(`./musicCommands/${file}`);
    }

    mainGuild.commands.create(command);
    client.commands.set(command.name, command);
  }

  console.log(`[${new Date().toLocaleTimeString("en-US")}] Tilda is online`);

  setActivity();

  setInterval(() => {
    setActivity();
  }, 1000 * 60 * 60);

  setInterval(() => {
    if (Math.floor(Math.random() * 2) && !coin.coinEvent.isUp)
      coin.randomCoinEvent(client, guildId);
  }, 1000 * 60 * 60 * 3);
});

client.on("guildMemberAdd", (member) => {
  member.roles.add("881627506908737546");
  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] ${
      member.displayName
    } has joined the server`
  );
});

client.on("interactionCreate", async (interaction) => {
  let isInRoom = false;

  if (coin.checkUser(interaction.user)) {
    let user = await User.findOne({ userId: interaction.user.id });
    if (user.categoryId) isInRoom = true;
  }

  if (
    (interaction.channelId != "881622803449774090" &&
      !["340002869912666114", "171330866189041665"].includes(
        interaction.user.id
      )) ||
    !isInRoom
  ) {
    interaction.reply({
      content: "You cannot use commands outside of the bot channel or your room",
      ephemeral: true,
    });
    return;
  }

  if (!interaction.isCommand()) return;

  if (!client.commands.has(interaction.commandName)) return;

  try {
    await client.commands.get(interaction.commandName).execute(interaction);
  } catch (error) {
    console.log(error);
    let embed = new MessageEmbed()
      .setColor(`#ff0000`)
      .setTitle(`Interaction Failed`)
      .setThumbnail(interaction.guild.iconURL())
      .addField(
        "Command failed to execute",
        "Look at the footer to see the error"
      )
      .setFooter(`${error}`);

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }

  // const COMMANDS = {
  //   "~shop": () => shop.shopManager(message, args),
  //   "~catch": () => fish.catchManager(message, args),
  //   "~fish": () => fish.fishManager(message, args),
  // };
});

client.login(JSON.parse(fs.readFileSync("./token.json")).token);
