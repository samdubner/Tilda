const voice = require("../helpers/voiceHelper");

module.exports = {
  name: "play",
  description: "add a song to the music queue",
  options: [
    {
      type: "STRING",
      name: "query",
      description: "the url/search of the youtube audio you'd like to play",
      required: true,
    },
  ],
  async execute(interaction) {
    voice.addToQueue(interaction);
  },
};
