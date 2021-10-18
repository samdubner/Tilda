const voice = require("../helpers/voiceHelper");

module.exports = {
  name: "loop",
  description: "keep the current song looping ",
  options: [
    {
      type: "STRING",
      name: "query",
      description: "the url/search of the youtube audio you'd like to play",
      required: true,
    },
  ],
  async execute(interaction) {
    voice.loopCurrentSong(interaction);
  },
};
