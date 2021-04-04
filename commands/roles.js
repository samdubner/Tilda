const { MessageEmbed } = require("discord.js");

const coin = require("./coin.js");
const User = require("../models/User");
const Role = require("../models/Role");

const role = async (message, args) => {
  let user = await User.findOne({ userId: message.author.id });

  if (!user) {
    user = await coin.createUser(message);
    user = await createRole(message, user);
  } else if (!user.role) {
    user = await createRole(message, user);
  }

  let command = args.split(" ")[0].toLowerCase();
  let data = args.split(" ").splice(1, args.length).join(" ");

  customRole = await message.guild.roles.fetch(user.role.roleId);

  switch (command) {
    case "name":
      updateRole("name", data, customRole, message);
      break;
    case "color":
      updateRole("color", data, customRole, message);
      break;
    default:
      let embed = new MessageEmbed()
        .setColor(customRole.hexColor)
        .setTitle(`${message.author.username}'s Custom Role`)
        .setThumbnail(message.author.displayAvatarURL())
        .addField(
          "Role Details",
          `Your role currently has a color of \`${customRole.hexColor}\` and name of \`${customRole.name}\``,
          false
        )
        .setFooter(
          "Don't forget to check out ~help",
          message.client.user.displayAvatarURL()
        );

      message.channel.send(embed);
  }
};

const createRole = async (message, user) => {
  let role = await message.guild.roles
    .create({
      data: {
        name: message.author.username,
        color: "00d5ff",
        position: 6,
        permissions: 0,
        mentionable: false,
      },
    })
    .catch(console.error);

  message.member.roles.add(role);

  let dbRole = new Role({
    roleId: role.id,
  });

  user.role = dbRole;
  user.save();

  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] Gave <${user.userId}> ${
      message.author.username
    } a custom role`
  );

  return user;
};

const updateRole = (type, data, role, message) => {
  console.log(
    `[${new Date().toLocaleTimeString("en-US")}] Changing ${
      message.member.displayName
    }'s custom role ${type} to '${data}'`
  );
  switch (type) {
    case "color":
      role.setColor(data).catch(console.error);
      message.reply(`Successfully changed role color to \`${data}\``);
      break;
    case "name":
      role.setName(data).catch(console.error);
      message.reply(`Successfully changed role name to \`${data}\``);
      break;
  }
};

module.exports = {
  role,
};
