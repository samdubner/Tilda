const voice = require("../helpers/voiceHelper");

module.exports = {
  name: "leave",
  description: "have Tilda leave the vc and empty the song queue",
  async execute(interaction) {
    voice.leaveChannel(interaction);
  },
};
