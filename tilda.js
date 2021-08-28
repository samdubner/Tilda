const { Client, Collection, Intents, MessageEmbed } = require("discord.js");

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
rework give command to use simpler logic
change coinevent to main channel
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
    const guildId =
      client.user.id == "670849450599645218"
        ? "735395621703385099"
        : "469659852109643786";
    const mainGuild = await client.guilds.fetch(guildId);
    mainGuild.commands.create(command);
    client.commands.set(command.name, command);
  }

  console.log(`[${new Date().toLocaleTimeString("en-US")}] Tilda is online`);

  client.user.setActivity("all the coin flips", {type: 'WATCHING'});

  setInterval(() => {
    if (Math.floor(Math.random() * 2) && !coin.coinEvent.isUp)
      coin.randomCoinEvent(client);
  }, 1000 * 60 * 60 * 3);
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
    interaction.channelId != "735399594917363722" &&
    !["340002869912666114", "171330866189041665"].includes(interaction.user.id)
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
  //   "~room": () => room.channelManager(message, args),
  // };
});

client.login(JSON.parse(fs.readFileSync("./token.json")).token);
