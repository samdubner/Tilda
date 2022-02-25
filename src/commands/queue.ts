import voice from "../helpers/voiceHelper";

module.exports = {
  name: "queue",
  description: "view all the songs currently in queue",
  async execute(interaction) {
    voice.viewQueue(interaction);
  },
};
