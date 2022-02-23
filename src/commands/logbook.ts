// const fishHelper = require("../helpers/fishHelper");

module.exports = {
  name: "logbook",
  description: "see all the fish you've caught",
  async execute(interaction) {
    fishHelper.fishLog(interaction);
  },
};
