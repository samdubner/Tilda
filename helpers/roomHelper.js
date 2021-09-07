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

  interaction.reply({
    content: "Your room has been created!",
    ephemeral: true,
  });
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
  try {
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
  } catch (e) {
    console.log("Someone mismanged their perms and deleted their custom category");
    user.categoryId = undefined;
    user.save();
    interaction.reply({
      content:
        "Something happened with your room and it couldn't be removed properly",
      ephemeral: true,
    });
  }
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

const addUserToRoom = async (interaction, mentionedUser) => {
  let user = await coin.checkInteraction(interaction);

  if (!user.categoryId) {
    interaction.reply({
      content: "You have to create a room before you can add users!",
      ephemeral: true,
    });
    return;
  }

  let category = await interaction.guild.channels.fetch(user.categoryId);

  await category.permissionOverwrites.edit(mentionedUser.id, {
    VIEW_CHANNEL: true,
    READ_MESSAGE_HISTORY: true,
  });

  category.children.each((channel) => {
    channel.lockPermissions().catch(console.error);
  });

  const notifyEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Room status")
    .setDescription(`Added \`${mentionedUser.username}\` to the room`);

  interaction.reply({ embeds: [notifyEmbed] });
};

const removeUserFromRoom = async (interaction, mentionedUser) => {
  let user = await coin.checkInteraction(interaction);

  if (!user.categoryId) {
    interaction.reply({
      content: "You have to create a room before you can add users!",
      ephemeral: true,
    });
    return;
  }

  if (!user.categoryId) {
    message.reply(
      "You have to create a room before you can set it as private!"
    );
    return;
  }

  let category = await interaction.guild.channels.fetch(user.categoryId);

  await category.permissionOverwrites.edit(mentionedUser.id, {
    VIEW_CHANNEL: false,
  });

  category.children.each((channel) => {
    channel.lockPermissions().catch(console.error);
  });

  const notifyEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Room status")
    .setDescription(`Removed \`${mentionedUser.username}\` from the room`);

  interaction.reply({ embeds: [notifyEmbed] });
};

module.exports = {
  createCategory,
  removeCategory,
  changeCategoryPrivacy,
  addUserToRoom,
  removeUserFromRoom,
};
