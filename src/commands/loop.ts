// const voice = require("../helpers/voiceHelper");

module.exports = {
  name: "loop",
  description: "Turn on/off the ability to loop the current song",
  async execute(interaction) {
    voice.loopCurrentSong(interaction);
  },
};
