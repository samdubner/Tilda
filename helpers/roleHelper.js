const MessageEmbed = require("discord.js").MessageEmbed;

const coin = require("./coinHelper");
const Role = require("../models/Role");

const createRole = async (user, interaction) => {
  if (user.role) {
    let embed = new MessageEmbed()
      .setColor("#ff0000")
      .setTitle("You already have a role!")
      .setDescription(
        "Try using either `/role edit` if you were trying to change your role"
      );

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
    return;
  }

  let role = await interaction.guild.roles
    .create({
      name: interaction.user.username,
      color: "00d5ff",
      position: 4,
      permissions: [],
      mentionable: false,
      reason: `${interaction.user.username} wanted a new role`,
    })
    .catch(console.error);

  interaction.member.roles.add(role);

  let dbRole = new Role({
    roleId: role.id,
  });

  user.role = dbRole;
  user.save();

  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] Gave <${user.userId}> ${
      interaction.user.username
    } a custom role`
  );

  let embed = new MessageEmbed()
    .setColor("#00ff00")
    .setTitle("Created your custom role")
    .setDescription(
      "Created your custom role with default values use `/role edit` to customize your role further"
    );

  interaction.reply({ embeds: [embed] });
};

const editRole = async (user, interaction) => {
  if (!user.role) {
    let embed = new MessageEmbed()
      .setColor("#ff0000")
      .setTitle("You don't have a role to edit!")
      .setDescription("Try using `/role create` first to create your role!");

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
    return;
  }

  let aspect = interaction.options.get("aspect").value;
  let data = interaction.options.get("data").value;
  let customRole = await interaction.guild.roles.fetch(user.role.roleId);

  switch (aspect) {
    case "name":
      updateRole("name", data, customRole, interaction);
      break;
    case "color":
      updateRole("color", data, customRole, interaction);
  }

  let embed = new MessageEmbed()
    .setColor("#00ff00")
    .setTitle("Edited your custom role")
    .setDescription(`updated your role ${aspect} to \`${data}\``);

  interaction.reply({ embeds: [embed] });
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
      break;
    case "name":
      role.setName(data).catch(console.error);
      break;
  }
};

const deleteRole = async (user, interaction) => {
  if (!user.role) {
    let embed = new MessageEmbed()
      .setColor("#ff0000")
      .setTitle("You don't have a role to delete!")
      .setDescription("I don't know what I did to deserve this :(");

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
    return;
  }

  let customRole = await interaction.guild.roles.fetch(user.role.roleId);
  customRole.delete();

  user.role = undefined;
  user.save();

  let embed = new MessageEmbed()
    .setColor("00ff00")
    .setTitle("Deleted your custom role")
    .setDescription("Deleted and removed your custom role");

  interaction.reply({ embeds: [embed] });

  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] Deleted ${
      interaction.member.displayName
    }'s custom role`
  );
};

module.exports = {
  createRole,
  editRole,
  deleteRole,
};
