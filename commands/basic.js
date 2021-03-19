const MessageEmbed = require("discord.js").MessageEmbed;

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

const Basic = {
  request: (message) => {
    let embed = new MessageEmbed()
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setTitle("Bot Request Sent")
      .setDescription("It will be taken very seriously");
  
    console.log(
      `[REQUEST] ${message.author.username}#${message.author.discriminator} => ${message.content}`
    );
  
    message.reply(embed);
  },
  eightBall: (message, args) => {
    if (args == "") {
      message.reply("Please ask a question when you try again");
      return;
    }
  
    let response = eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)];
  
    let embed = new MessageEmbed()
      .setAuthor(`8ball`, message.author.avatarURL())
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setThumbnail("https://i.imgur.com/z7ayPJL.gif")
      .addField("Question", args)
      .addField("Answer", response);
  
    message.channel.send({ embed }).catch(console.error);
  },
  roll: (message, args) => {
    args = args ? args : "6"
    randomResult = Math.floor(Math.random() * parseInt(args.split(" ")[0])) + 1
    let embed = new MessageEmbed()
    .setAuthor(`Roll`, message.author.avatarURL())
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .addField(`You rolled a ${parseInt(args.split(" ")[0])} sided die`,`You got a ${randomResult}`)
  
    message.channel.send({ embed }).catch(console.error);
  }

}

module.exports = Basic;