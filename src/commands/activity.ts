const axios = require("axios").default;
import { MessageEmbed } from "discord.js";

module.exports = {
  name: "activity",
  description:
    "use tilda to start any activity (youtube watch together, chess, etc...)",
  options: [
    {
      type: "STRING",
      name: "type",
      description: "the type of activity you'd like Tilda to start",
      required: true,
      choices: [
        { name: "Youtube Together", value: "Youtube Together" },
        { name: "Fishington", value: "Fishington" },
        { name: "Chess in the Park", value: "Chess in the Park" },
        { name: "Poker Night", value: "Poker Night" },
        { name: "Betrayal", value: "Betrayal" },
        { name: "Decoders", value: "Decoders"},
        { name: "Ocho", value: "Ocho"},
        { name: "Sketchy Artist", value: "Sketchy Artust"},
        { name: "Awkword", value: "Awkword"},
        { name: "Doodle Crew", value: "Doodle Crew"}

      ],
    },
  ],
  async execute(interaction) {
    await interaction.deferReply();

    let voiceId = interaction.member.voice.channelId;

    if (!voiceId) {
      interaction.editReply({
        content: "You must be in a voice channel to use the activity command",
        ephemeral: true,
      });
      return;
    }

    let activityIds = {
      "Youtube Together": "880218394199220334",
      "Fishington": "814288819477020702",
      "Chess in the Park": "832012774040141894",
      "Poker Night": "755827207812677713",
      "Betrayal": "773336526917861400",
      "Decoders": "891001866073296967",
      "Ocho": "832025144389533716",
      "Sketchy Artist": "879864070101172255",
      "Awkword": "879863881349087252",
      "Doodle Crew": "878067389634314250"
    };
    let activityName = interaction.options.get("type").value;
    let activityCode = activityIds[activityName];

    let response = await axios({
      method: "post",
      url: `https://discord.com/api/v9/channels/${voiceId}/invites`,
      data: {
        target_type: 2,
        target_application_id: activityCode,
      },
      headers: {
        "Authorization": `Bot ${interaction.client.token}`,
        "Content-Type": "application/json",
      },
    });

    const embed = new MessageEmbed()
      .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
      .setThumbnail(interaction.guild.iconURL())
      .setTitle("Started Voice Activity")
      .setDescription("Click the invite link below to join the activity!")
      .addFields(
        {
          name: "Invite URL",
          value: `https://discord.com/invite/${response.data.code}`,
        },
        { name: "Activity Name", value: activityName }
      );

    interaction.editReply({
      embeds: [embed],
    });
  },
};
