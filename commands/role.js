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
      description: "the name or hex code ex. [#fa0378] you would like to give your role",
      required: true,
    },
  ],
  async execute(interaction) {
    let user = await User.findOne({ userId: interaction.user.id });
    let data = intercation.options.get("data").value

    if (!user) {
      user = await coin.createUser(interaction.user);
      user = await createRole(interaction.member);
    } else if (!user.role) {
      user = await createRole(interaction.member);
    }

    customRole = await interaction.guild.roles.fetch(user.role.roleId);

    switch (interaction.options.get("aspect").value) {
      case "name":
        updateRole("name", data, customRole, interaction);
        break;
      case "color":
        updateRole("color", data, customRole, interaction);
        break;
      default:
        let embed = new MessageEmbed()
          .setColor(customRole.hexColor)
          .setTitle(`${interaction.user.username}'s Custom Role`)
          .setThumbnail(interaction.user.displayAvatarURL())
          .addField(
            "Role Details",
            `Your role currently has a color of \`${customRole.hexColor}\` and name of \`${customRole.name}\``,
            false
          )
          .setFooter(
            "Don't forget to check out ~help",
            interaction.client.user.displayAvatarURL()
          );

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};

const createRole = async (member) => {
  let role = await member.guild.roles
    .create({
      data: {
        name: member.user.username,
        color: "00d5ff",
        position: 6,
        permissions: 0,
        mentionable: false,
      },
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
