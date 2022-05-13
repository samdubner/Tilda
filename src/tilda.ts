const MAIN_GUILD_ID = "881621682870190091";
const PERSON_ROLE_ID = "881627506908737546";

import {
  Client,
  Collection,
  Intents,
  MessageEmbed,
  CommandInteraction,
} from "discord.js";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

interface Command {
  name: string;
  description: string;
  options?: Object[];
  execute(interaction: CommandInteraction): any;
}

const COMMANDS = new Collection<string, Command>();

import * as fs from "fs";

const commandFiles = fs.readdirSync("./out/commands");

const schedule = require("node-schedule");

import clientHelper from "./helpers/clientHelper";
import coinHelper from "./helpers/coinHelper";
import guildHelper from "./helpers/guildHelper";

schedule.scheduleJob("0 9 * * *", async () => {
  coinHelper.notifyUsers(client);
});

schedule.scheduleJob("0 0 * * *", async () => {
  let topUsers = await coinHelper.bleedTopUser();
  await coinHelper.checkStreaks();
  coinHelper.resetDailies();
  coinHelper.notifyDailyReset(client, topUsers);
  await coinHelper.checkChampion(client, topUsers);

  await clientHelper.randomizeRoleColor(client);
  clientHelper.randomizeServerName(client);
});

client.on("ready", async () => {
  for (let file of commandFiles) {
    let command = require(`./commands/${file}`);

    client.application.commands.create(command);
    COMMANDS.set(command.name, command);
  }

  console.log(`[${new Date().toLocaleTimeString("en-US")}] Tilda is online`);

  clientHelper.setActivity(client);

  setInterval(() => {
    clientHelper.setActivity(client);
  }, 1000 * 60 * 60);

  setInterval(() => {
    if (Math.floor(Math.random() * 2)) coinHelper.randomCoinEvent(client);
  }, 1000 * 60 * 60 * 3);
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
  let user = await coinHelper.getUser(guildMember.id);

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

  if (!COMMANDS.has(interaction.commandName)) return;

  if (!interaction.inGuild()) {
    interaction.reply({
      content: "Tilda's commands can only be used inside of a server",
      ephemeral: true,
    });
    return;
  }

  if (
    !(await guildHelper.verifyCommandChannel(interaction)) &&
    interaction.commandName != "config"
  ) {
    interaction.reply({
      content:
        "You cannot use commands outside of the bot channel, make sure a server admin has used the `/config` command!",
      ephemeral: true,
    });
    return;
  }

  try {
    await COMMANDS.find((cmd) => cmd.name == interaction.commandName).execute(
      interaction
    );
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

client.on("guildCreate", async (guild) => {
  let guildOwner = await guild.fetchOwner();

  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setThumbnail(guild.iconURL())
    .setTitle("How to set up Tilda in your server!")
    .setDescription(
      "Use the `/config` command in your server to select the channel you would like Tilda to use! (NOTE: the /config command can only be run by the server owner or anyone with the ADMINISTRATOR permission)"
    )
    .addFields({
      name: "config command",
      value: "`/config channel <#channel here>`",
    });

  guildOwner.send({ embeds: [embed] });
  guildHelper.createGuild(guild);
});

client.on("guildDelete", async (guild) => guildHelper.removeGuild(guild));

client.login(JSON.parse(fs.readFileSync("./token.json").toString()).token);
