const { MessageEmbed } = require("discord.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const UserRoles = sequelize.define("userRoles", {
  userId: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  roleName: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: false,
  }
});

let sync = () => UserRoles.sync();

let role = async (message, args) => {
  
  let user = await UserRoles.findOne({ where: { userId: message.author.id } });

  if (!user) {
    user = await createRole(message);
    console.log(
      `[${new Date().toLocaleTimeString("en-US")}] Added <${user.userId}> ${message.author.username} to the role table`
    );
  }

  let command = args.split(" ")[0].toLowerCase();
  let data = args.split(" ").splice(1, args.length).join(" ")
  
  customRole = message.guild.roles.cache.get(user.roleName);

  switch (command) {
    case "name":
      updateRole("name", data, customRole, message)
      break;
    case "color":
      updateRole("color", data, customRole, message)
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

let createRole = async (message) => {
  let role = await message.guild.roles.create({
    data: {
      name: message.author.username,
      color: "00d5ff",
      position: 6,
      permissions: 0,
      mentionable: false,
    },
  });

  message.member.roles.add(role);

  let user = await UserRoles.create({
    userId: message.author.id,
    roleName: role.id
  });

  let embed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle(`${message.author.username} has created their own custom role!`)
    .setThumbnail(message.author.displayAvatarURL())
    .addField(
      "Role Details",
      `Your role currently has the default color and username`,
      false
    )
    .setFooter(
      "Don't forget to check out ~help",
      message.client.user.displayAvatarURL()
    );

  message.channel.send(embed);

  return user;
};

let updateRole = (type, data, role, message) => {
  console.log(`[${new Date().toLocaleTimeString("en-US")}] Changing ${message.member.displayName}'s custom role ${type} to '${data}'`)
  switch(type) {
    case "color":
      role.setColor(data).catch(console.error)
      message.reply(`Successfully changed role color to \`${data}\``)
      break;
    case "name":
      role.setName(data).catch(console.error)
      message.reply(`Successfully changed role name to \`${data}\``)
      break;
  }
}

module.exports = {
  role,
  sync,
};
