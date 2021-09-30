const coin = require("../helpers/coinHelper.js");
const User = require("../models/User");
const Role = require("../models/Role");
const roleHelper = require("../helpers/roleHelper");

module.exports = {
  name: "role",
  description: "create, edit, and delete your custom role",
  options: [
    {
      type: "SUB_COMMAND",
      name: "create",
      description: "create a custom role just for you",
    },
    {
      type: "SUB_COMMAND",
      name: "delete",
      description:
        "remove your custom role and delete it from the server/Tilda's db",
    },
    {
      type: "SUB_COMMAND",
      name: "edit",
      description: "change the name/color of your custom role",
      options: [
        {
          type: "STRING",
          name: "aspect",
          description: "select what you would like to change about your role",
          required: true,
          choices: [
            {
              name: "Role Name",
              value: "name",
            },
            {
              name: "Role Color",
              value: "color",
            },
          ],
        },
        {
          type: "STRING",
          name: "data",
          description:
            "the name or hex code ex. [#fa0378] you would like to give your role",
          required: true,
        },
      ],
    },
  ],
  async execute(interaction) {
    let user = await coin.checkInteraction(interaction);

    let sub = interaction.options.getSubcommand()

    switch(sub) {
      case "create":
        roleHelper.createRole(user, interaction)
        break;
      case "delete":
        roleHelper.deleteRole(user, interaction)
        break;
      case "edit":
        roleHelper.editRole(user, interaction)
    }
  },
};