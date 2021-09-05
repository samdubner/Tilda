const MessageEmbed = require("discord.js").MessageEmbed;

const coin = require("./coinHelper");
const User = require("../models/User");

const createCategory = async (interaction) => {
  let user = await coin.checkInteraction(interaction);

  if (user.categoryId) {
    interaction.reply({
      content:
        "You already have a room started, you may only have one room at a time!",
      ephemeral: true,
    });
    return;
  }

  let permissionOverwrites = [
    {
      id: interaction.guild.roles.everyone,
      deny: ["VIEW_CHANNEL"],
    },
    {
      id: interaction.user.id,
      allow: [
        "MANAGE_CHANNELS",
        "VIEW_CHANNEL",
        "READ_MESSAGE_HISTORY",
        "MANAGE_MESSAGES",
        "MUTE_MEMBERS",
        "DEAFEN_MEMBERS",
      ],
    },
  ];

  let categoryOptions = {
    type: "GUILD_CATEGORY",
    permissionOverwrites,
  };

  let category = await interaction.guild.channels.create(
    `${interaction.member.displayName}'s Room`,
    categoryOptions
  );

  let textChatOptions = {
    type: "GUILD_TEXT",
    parent: category.id,
  };

  let voiceChatOptions = {
    type: "GUILD_VOICE",
    parent: category.id,
    userLimit: 99,
  };

  let textChannel = await interaction.guild.channels.create(
    `text-chat`,
    textChatOptions
  );

  let voiceChannel = await interaction.guild.channels.create(
    `voice-chat`,
    voiceChatOptions
  );

  await textChannel.lockPermissions();
  await voiceChannel.lockPermissions();

  textChannel
    .send(`<@${interaction.user.id}> Welcome to your new room!`)
    .catch(console.error);

  user.categoryId = category.id;
  user.save();
};

const removeCategory = async (interaction) => {
  let user = await coin.checkInteraction(interaction);

  if (!user.categoryId) {
    interaction.reply({
      content: "You haven't started a room, there is nothing to close!",
      ephemeral: true,
    });
    return;
  }

  let category = await interaction.guild.channels.fetch(user.categoryId);

  category.children.each((channel) => {
    channel.delete().catch(console.error);
  });

  category
    .delete()
    .then(() => {
      user.categoryId = undefined;
      user.save();
    })
    .catch(console.error);

  interaction
    .reply({ content: "Your room has been removed!", ephemeral: true })
    .catch(console.error);
};

const changeCategoryPrivacy = async (interaction, privacy) => {
  let user = await coin.checkInteraction(interaction);

  if (!user.categoryId) {
    interaction.reply({
      content: "You have to create a room before you can set it as private!",
      ephemeral: true,
    });
    return;
  }

  let category = await interaction.guild.channels.fetch(user.categoryId);

  await category.permissionOverwrites.edit(interaction.guild.roles.everyone, {
    VIEW_CHANNEL: privacy,
  });

  category.children.each((channel) => {
    channel.lockPermissions().catch(console.error);
  });

  notifyStatus(interaction, privacy);
};

const notifyStatus = (interaction, status) => {
  status = status === true ? "public" : "private";

  const notifyEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Room status")
    .setDescription(
      `${interaction.member.displayName}'s room was changed to \`${status}\``
    );

  interaction.reply({ embeds: [notifyEmbed] });
};

const addUserToRoom = async (message) => {
  let user = await User.findOne({ userId: message.author.id });

  if (!user) {
    user = await coin.createUser(message);
  }

  if (!user.categoryId) {
    message.reply("You have to create a room before you can add users!");
    return;
  }

  let category = await message.guild.channels.resolve(user.categoryId);

  let mentionedUsers = message.mentions.users.filter(
    (user) => user.id != message.author.id
  );

  mentionedUsers.each((user) => {
    category
      .updateOverwrite(user.id, {
        VIEW_CHANNEL: true,
        READ_MESSAGE_HISTORY: true,
      })
      .then((categoryChannel) => {
        categoryChannel.children.each((channel) => {
          channel.lockPermissions().catch(console.error);
        });
      })
      .catch(console.error);
  });

  const notifyEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Room status")
    .setDescription(
      `Added \`${message.mentions.users.size}\` user(s) to the room`
    );

  message.reply(notifyEmbed);
};



const removeUserFromRoom = async (message) => {
  let user = await User.findOne({ userId: message.author.id });

  if (!user) {
    user = await coin.createUser(message);
  }

  if (!user.categoryId) {
    message.reply(
      "You have to create a room before you can set it as private!"
    );
    return;
  }

  let category = await message.guild.channels.resolve(user.categoryId);

  let mentionedUsers = message.mentions.users.filter(
    (user) => user.id != message.author.id
  );

  if (mentionedUsers.size <= 0) {
    message.reply("You must remove one user besides yourself...");
    return;
  }

  mentionedUsers.each((user) => {
    category
      .updateOverwrite(user.id, {
        VIEW_CHANNEL: false,
      })
      .then((categoryChannel) => {
        categoryChannel.children.each((channel) => {
          channel.lockPermissions().catch(console.error);
        });
      })
      .catch(console.error);
  });

  const notifyEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Room status")
    .setDescription(
      `Removed \`${message.mentions.users.size}\` user(s) from the room`
    );

  message.reply(notifyEmbed);
};

module.exports = {
  createCategory,
  removeCategory,
  changeCategoryPrivacy,
  addUserToRoom,
  removeUserFromRoom
};
