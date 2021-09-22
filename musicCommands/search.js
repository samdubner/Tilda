const voice = require("../helpers/voiceHelper");

module.exports = {
  name: "search",
  description: "search for a video on youtube and add it to queue",
  options: [
    {
      type: "STRING",
      name: "search",
      description: "the search query for the video you'd like to add",
      required: true,
    },
  ],
  async execute(interaction) {
    voice.searchThenAddToQueue(interaction);
  },
};
