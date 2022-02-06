const MAIN_GUILD_ID = "881621682870190091";
const PERSON_ROLE_ID = "881627506908737546";

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

const commandFiles = fs.readdirSync("./commands");
const testingFiles = fs.readdirSync("./testing");

const schedule = require("node-schedule");

const coin = require("./helpers/coinHelper");
const clientHelper = require("./helpers/clientHelper");

schedule.scheduleJob("0 0 * * *", async () => {
  let topUsers = await coin.bleedTopUser();
  await coin.checkStreaks();
  coin.resetDailies();
  coin.notifyDailyReset(client, topUsers);
  await coin.checkChampion(client, topUsers);

  await clientHelper.randomizeRoleColor(client);
  clientHelper.randomizeServerName(client);
});

client.on("ready", async () => {
  const guildId =
    client.user.id == "670849450599645218"
      ? MAIN_GUILD_ID
      : "469659852109643786";
  const mainGuild = await client.guilds.fetch(guildId);

  for (let file of commandFiles) {
    let command = require(`./commands/${file}`);

    client.application.commands.create(command);
    client.commands.set(command.name, command);
  }

  for (let file of testingFiles) {
    let command = require(`./testing/${file}`);

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
  if (member.guild.id == MAIN_GUILD_ID) {
    member.roles.add(PERSON_ROLE_ID);
    updateGuildStatus(member, true);
  }

  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] ${
      member.displayName
    } has joined ${member.guild.name}`
  );
});

client.on("guildMemberRemove", async (member) => {
  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] ${
      member.user.username
    } is no longer in \'${member.guild.name}\'`
  );
  if (member.guild.id == MAIN_GUILD_ID) updateGuildStatus(member, false);
});

let updateGuildStatus = async (guildMember, status) => {
  let user = await coin.getUser(guildMember.id);

  if (!!user) {
    user.inMainGuild = status;
    user.save();
    console.log(
      `[${new Date().toLocaleTimeString("en-US")}] Updated ${
        guildMember.user.username
      }'s guild status in Tilda's DB`
    );
  }
};

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (!client.commands.has(interaction.commandName)) return;

  // let isInRoom = false;

  // if (await coin.checkUser(interaction.user)) {
  //   let user = await User.findOne({ userId: interaction.user.id });
  //   if (user.categoryId == interaction.channel.id) isInRoom = true;
  // }

  if (
    !["881622803449774090", "939372816887857202"].includes(
      interaction.channelId
    ) &&
    !interaction.user.id == "340002869912666114" //&&
    // !isInRoom
  ) {
    interaction.reply({
      content: "You cannot use commands outside of the bot channel",
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

client.on("guildCreate", (guild) => {
  
})

client.login(JSON.parse(fs.readFileSync("./token.json")).token);
