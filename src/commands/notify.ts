// import { MessageEmbed } from "discord.js";
import coinHelper from "../helpers/coinHelper";

module.exports = {
  name: "notify",
  description:
    "toggle if you want tilda to send you notifications to help you do your dailies :)",
  async execute(interaction) {
    let user = await coinHelper.checkInteraction(interaction);

    interaction
      .reply(`Your notification settings is currently set to ${user.notifyStatus}`)
      .catch(console.error);
  },
};
