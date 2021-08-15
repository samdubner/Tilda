const MessageEmbed = require("discord.js").MessageEmbed;

const OpenAi = require("openai-api");
const fs = require("fs");
const openai = new OpenAi(
  JSON.parse(fs.readFileSync("./token.json")).openaiToken
);

const roll = (message, args) => {
  args = args ? args : "6";
  randomResult = Math.floor(Math.random() * parseInt(args.split(" ")[0])) + 1;
  let embed = new MessageEmbed()
    .setAuthor(`Roll`, message.author.avatarURL())
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .addField(
      `You rolled a ${parseInt(args.split(" ")[0])} sided die`,
      `You got a ${randomResult}`
    );

  message.channel.send({ embed }).catch(console.error);
};

const ui = (message) => {
  let person = message.mentions.members.first();

  if (person == undefined) {
    let nick = message.member.nickname;
    let role = message.member.roles.hoist;
    let roleColor = message.member.displayHexColor;

    if (roleColor == "#000000") roleColor = "#99aab5";

    let embed = new MessageEmbed()
      .setAuthor("User Info", message.author.avatarURL())
      .setColor(roleColor)
      .setThumbnail(message.author.avatarURL())
      .addField("Username", message.author.username, false);
    if (!(nick == null || nick == message.author.username)) {
      embed.addField("Nickname", nick, false);
    }
    if (message.member.presence.activity != null) {
      embed.addField("Game", message.member.presence.activity.name, false);
    }
    embed.addField("Status", message.member.presence.status, false);
    embed.addField(
      "Joined Date",
      message.member.joinedAt.toLocaleString(),
      false
    );
    embed.addField(
      "Account Creation Date",
      message.author.createdAt.toLocaleString(),
      false
    );
    embed.addField("Highest Role", role, false);

    message.channel.send(embed).catch(console.error);
  } else {
    message.mentions.members.forEach((person) => {
      let nick = person.nickname;
      let role = person.roles.hoist;
      let roleColor = person.displayHexColor;

      if (roleColor == "#000000") roleColor = "#99aab5";

      let embed = new MessageEmbed()
        .setAuthor("User Info", person.user.avatarURL())
        .setColor(roleColor)
        .setThumbnail(person.user.avatarURL())
        .addField("Username", person.user.username, false);
      if (!(nick == null || nick == message.author.username)) {
        embed.addField("Nickname", nick, false);
      }
      if (person.presence.activity != null) {
        embed.addField("Game", person.presence.activity.name, false);
      }
      embed.addField("Status", message.member.presence.status, false);
      embed.addField("Joined Date", person.joinedAt.toLocaleString(), false);
      embed.addField(
        "Account Creation Date",
        person.user.createdAt.toLocaleString(),
        false
      );
      embed.addField("Highest Role", role, false);

      message.channel.send(embed).catch(console.error);
    });
  }
};

const pfp = (message) => {
  if (message.mentions.users.first() == undefined) {
    let embed = new MessageEmbed()
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTitle(`${message.author.username}'s pfp`)
      .setImage(message.author.avatarURL());

    message.channel.send(embed);
  } else {
    message.mentions.users.forEach((user) => {
      let embed = new MessageEmbed()
        .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
        .setTitle(`${user.username}'s pfp`)
        .setImage(user.displayAvatarURL());

      message.channel.send(embed);
    });
  }
};

const question = async (message, question) => {
  if (message.channel.type == "dm") return;

  const gptResponse = await openai.answers({
    documents: [],
    question,
    model: "davinci",
    examples_context: "In 2017, U.S. life expectancy was 78.6 years.",
    examples: [
      ["What is human life expectancy in the United States?", "The life expectancy in the United States is 78 years."],
    ],
    max_tokens: 100,
    temperature: 0.9,
    stop: ["\n", "<|endoftext|>"]
  });

  message.reply(gptResponse.data.answers[0])
};

module.exports = {
  roll,
  ui,
  pfp,
  question,
};