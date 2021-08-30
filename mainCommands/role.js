const MessageEmbed = require("discord.js").MessageEmbed;

const coin = require("../helpers/coinHelper.js");
const User = require("../models/User");
const Role = require("../models/Role");

module.exports = {
  name: "role",
  description: "a command to change your custom role's name and color",
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
  async execute(interaction) {
    let user = await User.findOne({ userId: interaction.user.id });
    let data = interaction.options.get("data").value;

    if (!user) {
      user = await coin.createUser(interaction);
      user = await createRole(interaction.member, user, interaction);
    } else if (!user.role) {
      user = await createRole(interaction.member, user, interaction);
    }

    customRole = await interaction.guild.roles.fetch(user.role.roleId);

    switch (interaction.options.get("aspect").value) {
      case "name":
        updateRole("name", data, customRole, interaction);
        break;
      case "color":
        updateRole("color", data, customRole, interaction);
    }
  },
};

const createRole = async (member, user, interaction) => {
  let role = await member.guild.roles
    .create({
      name: member.user.username,
      color: "00d5ff",
      position: 5,
      permissions: [],
      mentionable: false,
      reason: `${member.user.username} wanted a new role`
    })
    .catch(console.error);

  member.roles.add(role);

  let dbRole = new Role({
    roleId: role.id,
  });

  user.role = dbRole;
  user.save();

  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] Gave <${user.userId}> ${
      member.user.username
    } a custom role`
  );

  interaction.channel.send("Created your custom role!");

  return user;
};

const updateRole = (type, data, role, interaction) => {
  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] Changing ${
      interaction.member.displayName
    }'s custom role ${type} to '${data}'`
  );
  switch (type) {
    case "color":
      role.setColor(data).catch(console.error);
      interaction.reply(`Successfully changed role color to \`${data}\``);
      break;
    case "name":
      role.setName(data).catch(console.error);
      interaction.reply(`Successfully changed role name to \`${data}\``);
      break;
  }
};
