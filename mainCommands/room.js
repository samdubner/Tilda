const room = require("../helpers/roomHelper");

module.exports = {
  name: "room",
  description: "create/manage your private category",
  options: [
    {
      type: "STRING",
      name: "option",
      description: "select what you'd like to do with your category",
      required: true,
      choices: [
        {
          name: "Start Room",
          value: "start",
        },
        {
          name: "End Room",
          value: "end",
        },
        {
          name: "Set Private",
          value: "private",
        },
        {
          name: "Set Public",
          value: "public",
        },
      ],
    },
  ],
  async execute(interaction) {
    let options = interaction.options.get("option").value;

    switch (options) {
      case "start":
        room.createCategory(interaction);
        break;
      case "end":
        room.removeCategory(interaction);
        break;
      case "private":
        room.changeCategoryPrivacy(interaction, false);
        break;
      case "public":
        room.changeCategoryPrivacy(interaction, true);
        break;
    }
  },
};
