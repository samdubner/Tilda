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

module.exports = {
  name: "8ball",
  description: "uses the power of the all-might 8ball to answer your questions",
  options: [
    {
      type: "STRING",
      name: "question",
      description: "the question you would like to ask the 8ball",
      required: true,
    },
  ],
  async execute(interaction) {
    let response =
      eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)];

    let embed = new MessageEmbed()
      .setAuthor(`8ball`, message.author.avatarURL())
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setThumbnail("https://i.imgur.com/z7ayPJL.gif")
      .addField("Question", interaction.options.get("question"))
      .addField("Answer", response);

    interaction.reply({ embeds: [embed] }).catch(console.error);
  },
};