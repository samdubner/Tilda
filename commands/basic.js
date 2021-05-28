const MessageEmbed = require("discord.js").MessageEmbed;
const { execSync } = require("child_process");

const OpenAi = require("openai-api");
const fs = require("fs");
const openai = new OpenAi(
  JSON.parse(fs.readFileSync("./token.json")).openaiToken
);

const suggest = (message) => {
  let suggestion = mesage.content.split(" ").slice(1).join(" ");
  console.log(
    `[SUGGESTION] ${message.author.username}#${message.author.discriminator} => ${suggestion}`
  );

  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Bot Feature Suggestion Sent")
    .addField("Request", suggestion, false)
    .setThumbnail(message.author.displayAvatarURL())
    .setFooter("It will be taken very seriously");

  message.reply(embed);
};

const eightBallResponses = [
  "It is certain",
  "It is decidedly so",
  "Without a doubt",
  "Yes, definitely",
  "You may rely on it",
  "As I see it, yes",
  "Most likely",
  "Yes",
  "Signs point to yes",
  "Reply hazy try again",
  "Ask again later",
  "Better not tell you now",
  "Cannot predict now",
  "Concentrate and ask again",
  "Don't count on it",
  "My reply is no",
  "My sources say no",
  "Very doubtful",
  "Absolutely not",
  "Probably not",
];

const eightBall = (message, args) => {
  if (args == "") args = "<?>";

  let response =
    eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)];

  let embed = new MessageEmbed()
    .setAuthor(`8ball`, message.author.avatarURL())
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setThumbnail("https://i.imgur.com/z7ayPJL.gif")
    .addField("Question", args)
    .addField("Answer", response);

  message.channel.send({ embed }).catch(console.error);
};

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

const kill = (client, message) => {
  if (!["340002869912666114", "171330866189041665"].includes(message.author.id))
    return;
  message.react("✅").then((messageReaction) => {
    const filter = (reaction, user) =>
      reaction.emoji.name === "✅" &&
      ["340002869912666114", "171330866189041665"].includes(user.id);
    messageReaction.message
      .awaitReactions(filter, { time: 5000 })
      .then((collected) => {
        if (collected.get("✅") != undefined) {
          client.destroy();
          console.log(
            `${message.member.displayName} has destroyed the client, exiting node process...`
          );
          process.exit(0);
        }
      });
  });
};

const update = (client, message) => {
  if (!["340002869912666114", "171330866189041665"].includes(message.author.id))
    return;
  message.react("✅").then((messageReaction) => {
    const filter = (reaction, user) =>
      reaction.emoji.name === "✅" &&
      ["340002869912666114", "171330866189041665"].includes(user.id);
    messageReaction.message
      .awaitReactions(filter, { time: 5000 })
      .then((collected) => {
        if (collected.get("✅") != undefined) {
          client.destroy();
          console.log(
            `${message.member.displayName} has destroyed the client, updating local repository...`
          );
          execSync("git pull --ff-only");
          console.log("Exiting node process...");
          process.exit(0);
        }
      });
  });
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

const si = (message) => {
  let embed = new MessageEmbed()
    .setAuthor("Server Info", message.author.avatarURL())
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setThumbnail(message.guild.iconURL())
    .addFields([
      { name: "Server Name", value: message.guild.name, inline: false },
      { name: "# of Members", value: message.guild.memberCount, inline: false },
      {
        name: "# of Boosters",
        value: message.guild.premiumSubscriptionCount,
        inline: false,
      },
      {
        name: "Server Creation Date",
        value: message.guild.createdAt.toLocaleString(),
        inline: false,
      },
      { name: "Owner", value: message.guild.owner, inline: false },
    ]);

  message.channel.send(embed).catch(console.error);
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
  const gptResponse = await openai.answers({
    documents: [],
    question,
    model: "davinci",
    examples_context: "In 2017, U.S. life expectancy was 78.6 years.",
    examples: [
      ["What is human life expectancy in the United States?", "78 years."],
    ],
    max_tokens: 100,
    stop: ["\n", "<|endoftext|>"]
  });

  message.reply(gptResponse.data.answers[0])
  console.log(gptResponse.data);
};

module.exports = {
  suggest,
  eightBall,
  roll,
  kill,
  update,
  ui,
  si,
  pfp,
  question,
};
