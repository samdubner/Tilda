let request = (message, MessageEmbed) => {
  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Bot Request Sent")
    .setDescription("It will be taken very seriously");

  console.log(
    `[REQUEST] ${message.author.username}#${message.author.discriminator} => ${message.content}`
  );
  message.reply(embed);
};

let eightBall = (message, args) => {
  if (args == "") {
    message.reply("Please ask a question when you try again");
    return;
  }

  var responses = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes definitely",
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
  ];

  var response = responses[Math.floor(Math.random() * responses.length)];

  var embed = new MessageEmbed()
    .setAuthor(`8ball`, message.author.avatarURL())
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setThumbnail("https://i.imgur.com/z7ayPJL.gif")
    .addField("Question", args)
    .addField("Answer", response);

  message.channel.send({ embed }).catch(console.error);
};

export { request, eightBall };
