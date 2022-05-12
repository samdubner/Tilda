// import { MessageEmbed } from "discord.js";
import coinHelper from "../helpers/coinHelper";

module.exports = {
  name: "notify",
  description:
    "toggle if you want tilda to send you notifications to help you do your dailies :)",
  async execute(interaction) {
    let user = await coinHelper.checkInteraction(interaction);

    user.notifyStatus = !user.notifyStatus

    interaction
      .reply(`Your notification settings is now set to ${user.notifyStatus}`)
      .catch(console.error);
  },
};
