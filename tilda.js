const { Client, Collection, Intents, MessageEmbed } = require("discord.js");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES,
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
const clientHelper = require("./helpers/clientHelper");

schedule.scheduleJob("0 0 * * *", async () => {
  let topUsers = await coin.bleedTopUser();
  await coin.checkStreaks();
  coin.resetDailies();
  coin.notifyDailyReset(client, topUsers);
  await coin.checkChampion(client, topUsers);

  let color = await clientHelper.randomizeRoleColor(client);
  clientHelper.randomizeServerName(client, color);
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
      // console.log(e)
      command = require(`./musicCommands/${file}`);
    }

    mainGuild.commands.create(command);
    client.commands.set(command.name, command);
  }
  console.log(`[${new Date().toLocaleTimeString("en-US")}] Tilda is online`);

  clientHelper.setActivity(client);

  setInterval(() => {
    clientHelper.setActivity(client);
  }, 1000 * 60 * 60);

  setInterval(() => {
    if (Math.floor(Math.random() * 2) && !coin.coinEvent.isUp)
      coin.randomCoinEvent(client, guildId);
  }, 1000 * 60 * 60 * 2);
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
  if (!interaction.isCommand()) return;

  if (!client.commands.has(interaction.commandName)) return;

  let isInRoom = false;

  if (await coin.checkUser(interaction.user)) {
    let user = await User.findOne({ userId: interaction.user.id });
    if (user.categoryId == interaction.channel.id) isInRoom = true;
  }

  if (
    interaction.channelId != "881622803449774090" &&
    !["340002869912666114", "171330866189041665"].includes(
      interaction.user.id
    ) &&
    !isInRoom
  ) {
    interaction.reply({
      content:
        "You cannot use commands outside of the bot channel or your room",
      ephemeral: true,
    });
    return;
  }

  try {
    await client.commands.get(interaction.commandName).execute(interaction);
  } catch (error) {
    console.log(error);
    let embed = new MessageEmbed()
      .setColor(`#ff0000`)
      .setTitle(`Interaction Failed`)
      .setThumbnail(interaction.guild.iconURL())
      .addField("Command failed to execute", `${error}`);

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }
});

client.login(JSON.parse(fs.readFileSync("./token.json")).token);
